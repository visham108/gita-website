# Deploying to Cloudflare Workers

The site runs on Cloudflare Workers via `@opennextjs/cloudflare`. Free tier is
fine for launch volume, and commercial use is permitted.

## Live status (2026-07-21)

**DEPLOYED and verified in production** at
<https://gita-website.visham-rawat.workers.dev>. wrangler is authenticated
(OAuth). The 5 runtime secrets are set on the Worker (service role, 3 Razorpay,
ADMIN_EMAILS). Verified live: pages render, catalog from Postgres, made-to-order
editions purchasable with stock untouched on capture, admin 404s for anonymous,
a real Razorpay test order created + captured by valid signature, tampered
signature and webhook both 403.

Nameservers have propagated — `vrnda.store` now answers from Cloudflare, store
still resolves to Shopify.

**Done since:** ✅ custom domain `gita.vrnda.store` attached · ✅
`NEXT_PUBLIC_SITE_URL` baked in · ✅ Razorpay **live keys** set + production
webhook registered (id `TGSRw1BtlSQcUB`) with a fresh 64-char secret · ✅ Resend
key + `EMAIL_FROM=orders@vrnda.store` set, domain DKIM/SPF added to Cloudflare
(verification auto-completing) · ✅ test orders deleted, order sequence reset to
BG-1001.

**Still to do before real customers:**
- **A real ₹1 end-to-end test** — must be done by the seller (enters real
  payment; the assistant cannot). Temporarily price something at ₹1 in `/admin`,
  buy it, confirm the email + admin flow, refund, restore the price.
- **Real MRP prices** (seller decided to keep ₹399/₹199 — must stay at/below the
  printed cover MRP; over-MRP is an offence under the Legal Metrology Act).
- **Redirect the old GitHub Pages site** to `gita.vrnda.store` — do AFTER the ₹1
  test proves live payments end to end.

---

## 0. Before you deploy — the placeholder audit

These are wrong on purpose right now. Fix them or you'll launch with fake data.

| What | Where | Current (fake) value |
|---|---|---|
| Hardcover price | Supabase `products`, or `/admin` → Inventory | ₹399 |
| Paperback price | same | ₹199 |
| Stock counts | same | 18 / 28 (left over from test orders) |
| Shipping charge | `lib/commerce.ts` `SHIPPING_FLAT_PAISE` | ₹49 |
| Free-shipping threshold | `lib/commerce.ts` `FREE_SHIPPING_THRESHOLD_PAISE` | ₹499 |
| ~~Business name, address, phone~~ | ~~Contact + Terms~~ | ✅ done — Visham Singh Rawat, Pune |
| ~~Support email~~ | ~~Contact + Terms~~ | ✅ done — orders@vrnda.store (**mailbox must exist before launch**) |
| ~~Grievance officer~~ | ~~Contact + Terms~~ | ✅ done |
| ~~Test admin account~~ | ~~`ADMIN_EMAILS`~~ | ✅ done — test account removed, only your address remains |
| Test orders | Supabase `orders` | BG-1001, BG-1002, BG-1003 — delete before launch |

Prices and stock are editable at `/admin` after launch without a redeploy;
the rest are code/config changes.

---

## 1. Pending database migration

`supabase/migrations/0003_admin.sql` adds `cancel_order`. Until it runs, the
**Cancel order** button in `/admin` returns a 500. Paste it into the Supabase
SQL editor and run it.

---

## 2. Cloudflare account **[needs your account]**

1. Sign up at <https://dash.cloudflare.com/sign-up> (free).
2. Authenticate the CLI from the project folder:
   ```
   npx wrangler login
   ```

## 3. Set the secrets **[needs your account]**

Secrets are **not** in `wrangler.jsonc` (it's committed). Set each one — the
command prompts for the value so it never lands in shell history:

```
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RAZORPAY_KEY_ID
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put RAZORPAY_WEBHOOK_SECRET
npx wrangler secret put ADMIN_EMAILS
npx wrangler secret put NEXT_PUBLIC_SITE_URL
npx wrangler secret put EMAIL_FROM
npx wrangler secret put RESEND_API_KEY
```

Values come from `.env.local`, **except**:

- `RAZORPAY_WEBHOOK_SECRET` — the local one is a random test value. Use the
  real secret from the Razorpay dashboard (step 6).
- `NEXT_PUBLIC_SITE_URL` — `https://gita.vrnda.store`. Emails build their
  tracking links from this; wrong value = broken links in customer email.
- `ADMIN_EMAILS` — your address only. Drop the test account.
- `RESEND_API_KEY` / `EMAIL_FROM` — step 7.

> `NEXT_PUBLIC_*` values are inlined at **build** time, so they must be set
> before `cf:deploy`, and changing them requires a rebuild, not just a restart.

## 4. Deploy

```
npm run cf:deploy
```

`npm run cf:preview` runs the same bundle locally first if you want a look.

## 5. Domain: `gita.vrnda.store` **[needs your account]**

1. Cloudflare dashboard → **Add a site** → `vrnda.store`.
2. Cloudflare gives you two nameservers. Set them at your domain registrar.
3. **Critical:** during the scan, Cloudflare imports existing DNS records.
   Verify your Shopify records survived and are set to **DNS only** (grey
   cloud), not proxied — proxying Shopify through Cloudflare breaks their SSL.
   `vrnda.store` and `www` must keep pointing at Shopify.
4. Workers & Pages → your worker → **Custom domain** → `gita.vrnda.store`.

The root domain keeps serving your Shopify store; only the subdomain changes.

> **Before ever closing the Shopify store:** check whether `vrnda.store` was
> registered *through* Shopify. If so, transfer the domain out first — closing
> the account can take the domain with it.

## 6. Razorpay **[needs your account]**

1. Dashboard → Settings → **Webhooks** → Add:
   - URL: `https://gita.vrnda.store/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.processed`
   - Copy the generated secret → that's your `RAZORPAY_WEBHOOK_SECRET`.
2. Settings → add `gita.vrnda.store` to your authorised website list.
3. Swap test keys for live: `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` change
   from `rzp_test_…` to `rzp_live_…`. Redeploy after changing them.

The checkout page shows a visible "test mode" note whenever the key starts
with `rzp_test_`, so you can always tell which mode is live.

## 7. Email — Resend **[needs your account]**

1. Sign up at <https://resend.com> (free: 3,000/month).
2. Verify a sending domain (`vrnda.store`) — needs DNS records, which is easy
   now that Cloudflare hosts the zone.
3. Create an API key → `RESEND_API_KEY`.
4. `EMAIL_FROM` — e.g. `Bhagavad-gītā As It Is <orders@vrnda.store>`.

Without a key, every send is a logged no-op: orders still work, nobody is
emailed. Nothing breaks, it's just silent.

Also worth doing: Supabase → Auth → SMTP, pointed at Resend. The built-in
sender is rate-limited to roughly 2 emails/hour, which will throttle magic-link
sign-ins.

## 8. Go-live check

With **live** keys, buy one real cheap item (temporarily price something at ₹1):

1. Complete a real payment → confirmation page shows an order number.
2. Confirmation email arrives; seller alert arrives.
3. `/admin` shows it → mark packed → mark shipped with a real AWB.
4. Shipped email arrives with a working tracking link.
5. Refund it from `/admin` → refund email arrives → money returns in 5–7 days.
6. Restore the real price.

## 9. Redirect the old site

Point `visham108.github.io/gita-website` at the new domain (a redirect in the
GitHub Pages repo), so old links and search results follow.

---

## Post-launch improvements

- **Global instant cache purge.** No incremental cache binding is configured,
  so `revalidateTag` (admin price edits) is per-isolate. Verified working —
  worst case an edit takes up to 5 minutes to reach every edge isolate rather
  than being instant everywhere. Add an R2 cache + queue in
  `open-next.config.ts` to fix.
- **Shiprocket API** to replace manual AWB entry.
- **Order status webhook** from the courier to auto-mark delivered.
- `npm audit` shows 2 moderate advisories in `postcss`, pulled in by Next at
  build time only — no runtime exposure. Clears with a future Next upgrade.

---

## Verified on the Workers runtime

Run locally against `wrangler dev` with real Supabase + Razorpay test mode:

- Pages render; catalog reads live prices from Postgres
- `/api/checkout` created real Razorpay order `order_TFexNIXKPihhJB` (₹199 +
  ₹49 = ₹248) — proves `btoa` auth works without the Node shim
- Valid HMAC accepted, tampered HMAC rejected 403 (Web Crypto)
- Payment captured once under replay: stock 29→28, exactly 2 emails, not 4
- `/admin` renders for the admin; anonymous gets 404 on page and all APIs
- Admin price edit → storefront updated immediately (`revalidateTag` works)
- Legacy `/book.html` → 308 → `/book`

---

## Security posture (reviewed 2026-07-22)

**Verified good:** payment signatures HMAC-checked server-side (forged → 403);
prices always recomputed server-side; RLS blocks the public key from every table
except the active catalog (orders, signups, notes, profiles all 401); admin
routes 404 for anonymous *and* signed-in non-admins, including refund and
reprice; no secrets reachable from client code; customer text escaped in email.

**Added:**
- HTTP security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS) — the site previously sent none.
- **CSP is `Content-Security-Policy-Report-Only`.** Do not flip it to enforcing
  without checking reports first: the initial policy blocked
  `cdn.razorpay.com`, which `checkout.js` uses for risk detection. Enforcing it
  blind would have degraded fraud checks on live payments.
- Length caps on checkout free-text (name/address/city/state/phone/gift note).
- **Cloudflare rate-limiting rule** "Throttle public API endpoints": 10 requests
  per 10s per IP on `/api/checkout`, `/api/signup`, `/api/orders/lookup`, block
  for 10s. Deliberately **excludes `/api/razorpay/webhook`** — throttling
  Razorpay's servers would cause missed payments — and `/api/admin/*`, which is
  already auth-gated and polled by the dashboard. Verified: abuse blocked at
  request 12, block self-clears, a normal customer session is untouched, and 12
  rapid webhook calls returned 403 (never 429).

**Known, accepted:** order numbers are sequential, so someone who knows a
customer's email could try numbers to find their order — rate limiting now makes
this slow, and the response exposes no payment details.
