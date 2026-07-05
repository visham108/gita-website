# UX Strategy & Information Architecture
### Bhagavad-gītā As It Is — Digital Experience

---

## 1. Experience Vision

**One sentence:** Every pixel exists to move one person one step closer to opening
*Bhagavad-gītā As It Is* — and keeping it open for a lifetime.

**Design principles (in priority order):**

1. **The book is the hero.** Never the site, never the organization, never the features.
   Every page answers: *how does this bring someone closer to reading the book?*
2. **Reverence without distance.** Sacred, but never intimidating. The tone is a warm,
   learned friend — not a museum placard, not a sales page.
3. **Serenity as a performance budget.** Calm typography, generous whitespace, slow subtle
   motion. Nothing blinks, nothing chases. Speed itself is part of the serenity (LCP < 1.5 s).
4. **Depth on demand.** First-time visitors get clarity in 30 seconds; students get 700
   verses, notes, and courses. Progressive disclosure everywhere.
5. **Honest persuasion.** Real distribution numbers, real testimonials, real scholarly
   standing. The book has earned its authority; the site only needs to present it.

## 2. Audiences & Core Journeys

| Persona | Arrives via | Needs | Primary journey |
|---|---|---|---|
| **The Curious** (search: "what is the bhagavad gita") | SEO / social | Orientation, trust, low commitment | Home → What is the Gītā → sample verse → email capture or paperback |
| **The Seeker** (life event, recommendation) | Direct / referral | Meaning, guidance, a path | Home → Why As It Is → Course enrollment → book purchase |
| **The Student** (has the book) | Returning | Study tools, structure, community | Explorer → notes/bookmarks → course → resources |
| **The Gift-giver** | Search: "gita gift edition" | Confidence, beauty, logistics | Book page → editions → gift options → checkout |
| **The Scholar/Skeptic** | Academic reference | Textual fidelity, apparatus, credentials | Book page (5 layers) → sample → FAQ → purchase |

**North-star metric:** completed first readings (proxy: course module 2 completion + 30-day
book activation). Supporting: verse-explorer weekly actives, purchase conversion, gift rate.

## 3. Sitemap

```
/
├── book/                     The Book (overview, 5 layers, sample, editions, guide, FAQ)
│   ├── sample/               Full sample chapter (production)
│   └── editions/#hardcover…  Format deep-links
├── gita/                     Verse Explorer
│   └── [chapter]/[verse]     e.g. /gita/2/47 — canonical shareable verse URLs
├── course/                   Gītā Foundations (landing + curriculum)
│   └── lessons/[module]/[n]  Lesson player (auth)
├── resources/                Library (articles, lectures, videos, downloads)
│   └── [type]/[slug]         Individual resource pages
├── author/                   Śrīla Prabhupāda (long-form biography — v2)
├── account/                  My Study: dashboard, plans, bookmarks, notes, orders
├── checkout/                 Cart → details → payment → confirmation
├── about/, contact/, languages/, privacy/, terms/
└── admin/                    CMS studio (role-gated)
```

**Navigation model:** 5 primary items + persistent "Get the Book" CTA in header on scroll.
Footer = full sitemap + language switcher + trust signals. Breadcrumbs on all interior pages.

## 4. Key User Flows

**Flow A — Discover → Purchase (The Curious):**
Hero (emotional hook + proof bar) → "What is the Gītā" (orientation) → "Why As It Is"
(differentiation) → featured verses (product experience before purchase) → testimonials
(social proof) → editions (choice) → cart drawer (no page exit) → 2-step checkout →
confirmation cross-sell to the free course. *Every scroll section ends with an exit ramp
to either "read free" (low commitment) or "buy" (high intent).*

**Flow B — Study loop (The Student):**
Explorer → verse → bookmark/highlight/note → account dashboard aggregates → daily-verse
re-engagement (email + dashboard) → course lesson → back to explorer. The loop is the
retention engine; localStorage in prototype, account-synced in production.

**Flow C — Course completion:**
Enroll (1 click, free) → module lessons with progress → per-module quiz → certificate →
prompted next steps (Bhāgavatam, community). Completion certificate doubles as a shareable
social artifact.

## 5. Content Strategy

- **Verse content:** Sanskrit (Devanagari + IAST) is public domain. Translations and
  purports are © Bhaktivedanta Book Trust — **production requires a BBT license**; the
  prototype ships original "study renderings" clearly labeled as placeholders.
- **Voice:** dignified, warm, concrete. Sanskrit terms always glossed at first use.
  No exclamation-mark spirituality; the material carries its own weight.
- **Editorial cadence:** weekly article + weekly featured verse (drives the newsletter),
  monthly lecture spotlight. All CMS-driven.
- **Localization:** UI strings and editorial content translatable from day one (the book
  exists in 80+ languages; the site should follow — launch EN, then HI/ES/PT/RU).

## 6. Accessibility & Trust

- WCAG 2.2 AA: semantic landmarks, skip links, focus-visible styles, aria on all
  interactive composites (drawer, accordions, toolbars), contrast ≥ 4.5:1 for body text,
  `prefers-reduced-motion` honored throughout.
- Devanagari rendered with a dedicated font; IAST diacritics in real Unicode (screen-reader
  and copy-paste safe).
- Trust: BBT attribution, distribution stats, money-back guarantee, secure-checkout
  signals, genuine reviews (verified-purchase flag in production).
