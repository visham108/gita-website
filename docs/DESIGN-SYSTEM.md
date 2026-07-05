# Design System — "Gītā Radiance"
### Bhagavad-gītā As It Is — Digital Experience

The system is implemented in `css/styles.css` as CSS custom properties + components.
This document is the specification behind it.

---

## 1. Design Language

**Mood:** sunrise over Kurukṣetra — warm ivory light, vibrant burnt-orange (terracotta),
pale amber highlights, teal counterpoints. The palette is drawn directly from the
original 1972 cover painting (reds, oranges, creams), so the book always looks native to
its surroundings. Vibrant flame bands alternate with airy light sections; nothing is
dull or heavy. Ornament is used sparingly (mandala watermark, thin amber rules, ✦
markers).

## 2. Color

| Token | Value | Role |
|---|---|---|
| `--night-950…600` | `#7c3409 → #ca6c2a` | Flame (burnt-orange) surfaces: hero, bands, footer |
| `--ivory` | `#fdf9f2` | Default page background |
| `--cream` / `--sand` | `#faefdf` / `#f4e0c2` | Alternate light sections |
| `--gold` | `#d97e2f` | Primary amber-orange accent |
| `--gold-bright` | `#ffd9a3` | Pale-amber accent on flame surfaces |
| `--gold-deep` | `#a3480e` | Accent text on light surfaces (AA-safe) |
| `--saffron` | `#e2542c` | Notification moments (cart badge) |
| `--teal` | `#0c6b5f` | Contrast accent (success, sage badges) |
| `--lotus` | `#c2554f` | Destructive/error accents only |
| `--ink` / `--ink-soft` / `--ink-faint` | `#362719` … `#a08b78` | Warm espresso text on light |
| `--moon` / `--moon-soft` / `--moon-faint` | `#fff8ed` … `#f0bf95` | Cream text on flame |

Rules: mid-amber is never used for body text; on light backgrounds use `--gold-deep`
(contrast ≥ 4.5:1). Flame sections use `--moon` for primary text, never pure white.
(The `--night-*` token names are retained from v1 for compatibility; they now hold the
flame ramp.)

## 3. Typography

| Role | Face | Usage |
|---|---|---|
| Display | **Fraunces** (variable, optical sizing) | H1–H3, verse translations, prices |
| UI / body | **Inter** (variable) | Body, nav, buttons, forms, captions |
| Sanskrit | **Tiro Devanagari Sanskrit** | All Devanagari text |
| IAST | Inter italic | Transliteration lines |

Fluid scale (`clamp()`): hero `2.6–5.4rem`, display-lg `2.4–4rem`, display-md `1.9–2.9rem`,
lg `1.375rem`, md `1.125rem`, base `1rem`, sm `.875rem`, xs `.75rem`.
Body line-height 1.65; display 1.12; Devanagari 1.9. Eyebrow labels: 12px, 650 weight,
0.22em tracking, uppercase, preceded by a 26px gold rule.

## 4. Space, Shape, Elevation

- Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 112 px` (`--space-1…9`).
  Sections breathe at `--space-9` (7rem) desktop, `--space-8` mobile.
- Radii: 8 (small controls), 14 (inputs/rows), 22 (cards), pill (buttons/chips).
- Shadows: 3 elevation steps + one branded `--shadow-gold` reserved for primary CTAs.
- Containers: 1180px default, 1360px wide (header, explorer).

## 5. Motion

- Signature easing `cubic-bezier(0.16, 1, 0.3, 1)` ("ease-out-quint" feel).
- Scroll-reveal: 26px rise + fade, 0.8s, staggered with `data-delay="1…4"` (0.1s steps).
- Ambient only in the hero: 240s mandala rotation, 7s book float. Nothing loops loudly.
- Hovers: −2 to −4px translate + shadow/border shift, 0.25–0.35s.
- `prefers-reduced-motion`: all animation and reveals collapse to instant.

## 6. Iconography

1.7–1.8px stroke, round caps/joins, 24px grid, drawn inline (no icon font). A stylized
lotus mark serves as the brand glyph; product thumbnails use the real cover art.
Decorative markers: ✦ (lists), ★ (bookmarks), thin amber rules.

## 7. Core Components (implemented)

Buttons (gold / ghost-dark / ghost-light / night; sm-lg-block) · Header (fixed, blur-on-
scroll, mobile sheet nav) · Cards (light + night) · Verse card & verse detail (5-layer
anatomy) · Chapter rail (sticky sidebar → horizontal scroller on mobile) · Verse toolbar
(bookmark/highlight/note/share) · Accordion (FAQ) · Timeline · Stats · Testimonials ·
Pricing/format cards · Cart drawer + badge · Toast · Steps (checkout) · Progress bars ·
Module/lesson list · Quiz options · Certificate · Reading-plan selector · Empty states ·
Breadcrumbs · Chips/filters · Newsletter inline input · Footer.

## 8. Responsive Strategy

Mobile-first; breakpoints at 560, 680, 900, 980px. Grids collapse 4→2→1; explorer sidebar
becomes a snap-scrolling chapter rail; hero becomes single column with the book above the
fold; nav becomes a full-width blurred sheet. Touch targets ≥ 44px.
