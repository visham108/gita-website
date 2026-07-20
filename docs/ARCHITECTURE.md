# Architecture
### Bhagavad-gītā As It Is — as actually built

This describes the system that exists. An earlier revision of this file proposed
Sanity + Shopify + Stripe + Clerk + Neon/Prisma + Typesense on Vercel; **none of
that was used.** The stack below was chosen for a one-person operation selling
physical books in India, and every piece of it is running.

For deployment steps and launch checklist, see [DEPLOY.md](./DEPLOY.md).

---

## 0. Hard requirement: independence from Shopify

**This site must keep working if the VRNDA Shopify storefront is taken down.**

It already does, and any future change must preserve this:

- `gita.vrnda.store` is its own DNS record pointing at the Cloudflare Worker.
  Subdomains resolve independently of the root, so Shopify going away breaks
  `vrnda.store` / `www` and leaves this site untouched.
- The application has **no Shopify dependency of any kind** — no API, no SDK, no
  shared data. It runs on Supabase, Razorpay, Resend and Cloudflare. Do not
  introduce one.
- The domain is registered at **GoDaddy**, not through Shopify (confirmed from
  the `_domainconnect.gd.domaincontrol.com` and `secureserver.net` records), so
  closing the Shopify account cannot take the domain with it.
- DNS is served by Cloudflare and email by GoDaddy's mail servers. Neither
  routes through Shopify.

The one real coupling is **Razorpay**: the merchant account is KYC'd to the VRNDA
business entity. Closing the *storefront* leaves it intact; winding up the
*business* would require a new merchant account.

If Shopify is decommissioned, the only work is repointing the root: change the
`A` record and `www` CNAME from Shopify to the Worker and add redirects, so
`vrnda.store` serves this site. Until then both stay **DNS only** (grey cloud) —
that reproduces today's behaviour exactly and cannot disturb the storefront.

---

## 1. Stack

| Layer | Choice | Why this, not the alternative |
|---|---|---|
| Framework | **Next.js 15** (App Router, React 19, TypeScript) | Static pages for content, server routes for money. |
| Styling | **Plain CSS** — one file, `app/globals.css` | Ported byte-identical from the prototype's tuned ~1700 lines. Re-theming that into Tailwind was pure regression risk for zero user benefit. |
| Auth + DB | **Supabase** (GoTrue + Postgres, RLS) | One service for both, generous free tier, and RLS enforces per-user isolation *in the database* rather than in application code. |
| Payments | **Razorpay** | UPI/cards/netbanking, INR-native. Stripe's India support doesn't match a domestic seller's needs. |
| Email | **Resend** over REST | No SDK, so it runs on Workers unchanged. |
| Hosting | **Cloudflare Workers** via `@opennextjs/cloudflare` | Free tier permits commercial use; Vercel's would have cost $20/mo. |
| CMS | *None* | Content is a typed TS module (`lib/data.ts`). A CMS earns its keep when non-technical people edit daily; here it would be pure overhead. |
| Search | *None* | Client-side filtering over 40 verses. Typesense for this would be absurd. |

Deferred deliberately: i18n, analytics, a search service, digital editions.
None of them block selling a book.

## 2. Shape

```
Browser
  │
  ▼
Next.js on Cloudflare Workers
  ├─ Static: home, book, explorer, course, resources, policies
  ├─ Dynamic: /admin, /orders
  ├─ Routes:  /api/checkout, /api/checkout/verify,
  │           /api/razorpay/webhook, /api/orders/lookup, /api/admin/*
  ├─ Middleware: Supabase session refresh
  │
  ├──► Supabase   Auth (magic link) + Postgres (RLS)
  ├──► Razorpay   Orders API + Checkout widget + signed webhooks
  └──► Resend     order confirmation / shipped / refunded
```

## 3. Data model

**Commerce** (`0002_commerce.sql`)

```
products     id, type, title, price_paise, tag, features, format, active, stock_qty
orders       id, order_no (BG-1001…), user_id?, email, phone, status,
             amount_paise, shipping_paise, razorpay_order_id/payment_id,
             awb, tracking_url, gift, gift_note, ship_*, paid_at
order_items  order_id, product_id, qty, unit_price_paise, title
```

`unit_price_paise` and `title` are **snapshots**. Editing a product later must
never rewrite what a customer already paid or what they think they bought.

**Study** (`0001_study_schema.sql`) — `profiles`, `bookmarks`, `highlights`,
`notes`, `last_read`, `course_progress`, all keyed by `user_id` with
`auth.uid() = user_id` RLS. Verse ref `"2.47"` is the universal join key.

> This Supabase project has **default privileges stripped**. Every new table
> needs explicit `grant` to *both* `authenticated` and `service_role`, plus RLS
> policies. A missing `service_role` grant once caused blanket 403s.

## 4. How money is handled

Four rules, each defending against a specific failure:

1. **Integers in paise, never floats.** `₹399.00` is `39900`. Floating-point
   money accumulates rounding errors.
2. **The client never sets a price.** `/api/checkout` ignores any amount in the
   request, re-reads the catalog server-side, and computes the total itself.
   Otherwise a crafted request buys a book for ₹1.
3. **Signatures are verified server-side.** The browser callback proves nothing —
   HMAC-SHA256 over `order_id|payment_id` with the key secret does. The webhook
   is verified over its *raw* body with the webhook secret.
4. **Capture is atomic and idempotent.** `mark_order_paid()` flips
   `pending → paid` and decrements stock in one transaction, returning `true`
   only to the first caller. The browser callback and the webhook both race to
   call it; exactly one wins. Verified: replayed captures move stock once and
   send one email, not four.

`cancel_order()` mirrors this, with one asymmetry that matters: it restocks only
if the order reached `paid`/`packed`. Cancelling a `pending` order restocks
nothing, because nothing was ever deducted — otherwise cancellations would
invent inventory you don't own.

## 5. Study data: two backends, one interface

`lib/study/StudyProvider.tsx` presents a single store. Anonymous visitors write
to `localStorage` (`bgaii_*`); signed-in users write to Postgres. On first
sign-in, local state is uploaded once and the local copy cleared — so nobody
loses notes by making an account. The cart (`bgaii_cart_v1`) stays local
throughout.

## 6. Admin

`/admin`, gated on `ADMIN_EMAILS`. Non-admins get a plain 404 — same title, same
body as any other 404 — so the dashboard doesn't announce itself. Every
`/api/admin/*` route re-verifies the session; the page gate is not trusted.

Fulfillment transitions name their allowed predecessor statuses in the `WHERE`
clause, so a stale browser tab double-applying an action gets a 409 rather than
corrupting state.

## 7. Security posture

- Payment card data never touches this app — Razorpay's widget handles it.
- Secrets are server-only: `SUPABASE_SERVICE_ROLE_KEY` and Razorpay secrets are
  never imported into a client component. `.env.local`, `.dev.vars` and `*.csv`
  are gitignored.
- RLS is the enforcement boundary for user data, not application logic. Verified:
  user B reads zero rows of user A's notes.
- Guest order lookup requires order number **and** email, so order numbers can't
  be enumerated.
- Customer-supplied text (gift notes) is HTML-escaped before entering email.

## 8. Known limits

- **No incremental cache binding on Workers**, so `revalidateTag` is per-isolate.
  Admin price edits reach every edge isolate within the 5-minute ISR window
  rather than instantly. Fix with an R2 cache in `open-next.config.ts`.
- **Verse text is placeholder.** The English translations and purports are ©
  Bhaktivedanta Book Trust; the site ships clearly-labelled original "study
  renderings" pending a BBT licence. **Never paste BBT translation text into
  this repo.** This gates the 700-verse SEO expansion, not the commerce launch.
- **Only 40 of 700 verses** are present, for the same reason.
- Shipping is manual: book the courier in Shiprocket, paste the AWB. The
  Shiprocket API is post-launch work.

## 9. If you pick this up later

- `npm run dev` — Next dev server, port 3000
- `npm run cf:preview` — build and run the real Workers bundle locally
- `npm run cf:deploy` — build and deploy
- Migrations in `supabase/migrations/` are applied by pasting into the Supabase
  SQL editor, in order.
- Don't run `npm run build` while `next dev` is live; it corrupts `.next` and the
  dev server 500s until you `rm -rf .next` and restart.
