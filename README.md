# Bhagavad-gītā As It Is — Premium Digital Experience

A complete design prototype and strategy package for a world-class website dedicated to
**Bhagavad-gītā As It Is** by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda.

## Run it

No build step, no dependencies. Serve the folder statically:

```bash
python -m http.server 4173
# or: npx serve .
```

Then open http://localhost:4173. (Opening `index.html` directly also works.)

## What's inside

| Page | Highlights |
|---|---|
| `index.html` | Cinematic hero with CSS-3D book, what-is-the-Gītā, why "As It Is", author timeline, global impact, testimonials, editions, newsletter |
| `book.html` | Five-layer verse anatomy, sample verse spread (2.20), editions with cart, reading guides, FAQ, Book JSON-LD |
| `explorer.html` | 18 chapters, 40 key verses (Devanagari + IAST), search, bookmarks, highlights, notes, share — persisted in localStorage |
| `course.html` | "Gītā Foundations": 6 modules / 27 lessons, progress tracking, live quiz with feedback, certificate unlock |
| `resources.html` | Filterable library: articles, lectures, videos, downloads |
| `account.html` | My Study dashboard: stats, continue-reading, daily verse, reading plans, bookmarks and reflections |
| `checkout.html` | 3-step demo checkout: order review → details/gift options → confirmation |
| `docs/` | `STRATEGY.md` (UX, IA, flows) · `DESIGN-SYSTEM.md` (tokens, type, motion) · `ARCHITECTURE.md` (production stack) |

## Important content note

The Sanskrit text (Devanagari and IAST) is public domain. The English **translations and
purports of *Bhagavad-gītā As It Is* are © The Bhaktivedanta Book Trust** and are *not*
reproduced here: verse pages carry clearly-labeled original "study renderings" as
placeholders. A production launch requires a BBT content license, after which the
official translations, word-for-word meanings and full purports drop into the same
templates (see `docs/ARCHITECTURE.md` §5).

Commerce and media are demo-mode: no payments are collected and no user data leaves the
browser (everything persists in `localStorage` under `bgaii_*` keys).
