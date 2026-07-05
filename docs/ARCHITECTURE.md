# Production Technology Architecture
### Bhagavad-gītā As It Is — Digital Experience

The prototype in this repo is intentionally dependency-free (static HTML/CSS/JS) so the
design system and flows can be evaluated instantly. This document specifies the
recommended production build.

---

## 1. Recommended Stack (summary)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 15 (App Router, React 19, TypeScript)** | SSG/ISR for content pages (SEO + speed), server components for verse pages, first-class i18n and image optimization |
| Styling | **Tailwind CSS v4 + CSS variables from this design system** | Tokens port 1:1 from `styles.css`; design-system fidelity with utility speed |
| CMS | **Sanity** | Structured content (verses, purports, courses, articles) with Portable Text, real-time preview, localization, roles; GROQ queries fit verse-addressable content perfectly |
| E-commerce | **Shopify (headless, Storefront API) + Stripe** | Shopify handles catalog/inventory/tax/fulfillment for 4+ physical/digital SKUs and gift options; Stripe for wallets/UPI in India-heavy traffic; digital delivery via webhook-issued signed URLs |
| Auth | **Clerk** (or Auth.js if self-hosting) | Email/OTP + Google/Apple, session handling, user metadata for study state; low integration cost |
| Database (study data) | **Postgres (Neon/Supabase) + Prisma** | Bookmarks, highlights, notes, course progress, reading plans — relational, per-user, synced across devices |
| Search | **Typesense** (or Algolia) | Typo-tolerant instant search across 700 verses + purports + articles; Devanagari + IAST analyzers; self-hostable |
| Course engine | Custom (DB above) | Requirements are light (progress, quizzes, certificates); LMS platforms are heavier than the need |
| Email | **Resend + React Email** | Transactional (orders, certificates) + daily-verse digest |
| Analytics | **Plausible** (privacy-first) + Sentry | Respectful measurement fits the brand; error monitoring |
| Hosting | **Vercel** + Cloudflare CDN/WAF | Edge ISR for verse pages, image CDN, DDoS protection |
| i18n | `next-intl` + Sanity locale documents | Launch EN → HI/ES/PT/RU; the book exists in 80+ languages |

## 2. Architecture Shape

```
Browser
  │
  ▼
Next.js on Vercel ──────────────┬────────────────────────────
  ├─ Static/ISR: home, book, resources, verse pages (/gita/2/47)
  ├─ Server actions/API routes: study data, course progress, quiz
  ├─ Edge middleware: locale negotiation, AB flags
  │
  ├──► Sanity (content: verses*, purports*, courses, articles, testimonials, events)
  ├──► Shopify Storefront API (catalog, cart, discounts) ──► Stripe (payment)
  ├──► Postgres/Prisma (user study state)      ◄── Clerk (identity)
  ├──► Typesense (search index, rebuilt on Sanity webhook)
  └──► Resend (email)                          * BBT-licensed text
```

**Verse pages are the SEO engine:** 700 statically generated, canonical URLs
(`/gita/[ch]/[v]`) with JSON-LD (`Book` + `Quotation`), OpenGraph share images generated
per-verse (`@vercel/og`), and hreflang across locales. This is how seekers searching any
verse find the book.

## 3. Data Model (core)

```
User (Clerk id) ─┬─ Bookmark {verseRef, createdAt}
                 ├─ Highlight {verseRef, color}
                 ├─ Note {verseRef, body, updatedAt}
                 ├─ Enrollment {courseId, startedAt}
                 ├─ LessonProgress {lessonId, completedAt}
                 ├─ QuizAttempt {quizId, score, answers}
                 ├─ ReadingPlan {planId, startedAt, cursor}
                 └─ Certificate {courseId, issuedAt, serial}

Sanity: chapter, verse (devanagari, iast, wordForWord[], translation, purport,
        crossRefs[], locale), course/module/lesson/quiz, article, lecture,
        testimonial, product-content, page
Shopify: products (4 formats + gift wrap), orders, inventory, fulfillment
```

Prototype → production migration: the localStorage keys (`bgaii_*`) map 1:1 onto these
tables; a one-time import endpoint adopts anonymous device state into the account on
first sign-in (no study data lost).

## 4. Security, Performance, Scalability

- **Security:** all payment via Stripe/Shopify hosted fields (SAQ-A scope); Clerk-managed
  sessions (httpOnly, SameSite); CSP + strict security headers; Cloudflare WAF + rate
  limiting on write APIs; least-privilege service tokens; automated dependency audit in CI.
- **Performance budgets:** LCP < 1.5 s, CLS < 0.05, INP < 200 ms, JS < 150 KB gz per page.
  Fonts subset (Devanagari loaded only where used), `next/image` AVIF, ISR for content.
- **Scalability:** content pages are static at the edge (effectively infinite); study-data
  API is stateless Node behind connection-pooled Postgres (Neon autoscaling); search is a
  small dedicated Typesense cluster; Shopify absorbs commerce spikes (Gita Jayanti,
  December gifting season).
- **SEO:** per-page metadata, sitemaps split by type (verses/articles), structured data
  (Book, Course, Product, FAQPage), hreflang, share images per verse/article.
- **Analytics events:** verse_read, bookmark_add, course_enroll, lesson_complete,
  add_to_cart, purchase, plan_start — funneled to the north-star dashboard.

## 5. CMS Editorial Model

Sanity Studio (at `/admin`) with roles: Editor (articles, testimonials, events),
Course author (modules/lessons/quizzes), Librarian (lectures/media), Admin (all + product
content). Scheduled publishing, localization workflow per document, preview mode
against the production frontend. BBT-licensed verse text is imported once via a guarded
script and locked to Admin edits.

## 6. Build & Delivery Roadmap

1. **Phase 1 (weeks 1–4):** Port prototype to Next.js + Tailwind tokens; Sanity schemas;
   verse pages ×700 (licensed text); search.
2. **Phase 2 (weeks 5–8):** Clerk auth + study-data API + device-state adoption; course
   engine + certificates (PDF via `@react-pdf`); Shopify + Stripe checkout.
3. **Phase 3 (weeks 9–12):** Localization (HI/ES), daily-verse email, community directory,
   editorial launch calendar; load testing, accessibility audit (axe + manual SR pass),
   security review; launch.
