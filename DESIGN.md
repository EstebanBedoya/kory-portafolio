---
name: Kory — Portafolio Celestial
description: A constellation-lit sky-blue portfolio for painter Estefanía Bedoya Giraldo, built on frosted glass, hairline rules, and a curtain-wipe reveal.
colors:
  brand: "#2D5A82"
  accent: "#1C3F5E"
  canvas: "#93CAED"
  canvas-deep: "#7BBCE0"
  neutral-dark: "#121212"
  paper: "#FBFBFB"
typography:
  display:
    fontFamily: "var(--font-cormorant), Georgia, serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "var(--font-cormorant), Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.15
  quote:
    fontFamily: "var(--font-cormorant), Georgia, serif"
    fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.35
    fontStyle: italic
  body:
    fontFamily: "var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.7
  lede:
    fontFamily: "var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 1.2vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.3em"
  eyebrow:
    fontFamily: "var(--font-outfit), system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.4em"
  label:
    fontFamily: "var(--font-outfit), system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.3em"
rounded:
  sm: "2px"
  card: "16px"
  full: "9999px"
spacing:
  section: "8rem"
  section-lg: "12rem"
  shell: "72rem"
  reading: "48rem"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "#FBFBFB"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "#FBFBFB"
    textColor: "{colors.neutral-dark}"
  card-artwork:
    backgroundColor: "rgba(255,255,255,0.4)"
    rounded: "{rounded.card}"
---

# Design System: Kory — Portafolio Celestial

## Overview

**Creative North Star: "The Constellation Field"**

The site stages the work inside a literal sky: a saturated cerulean canvas (`#93CAED`) threaded by a drifting, mouse-repelled particle constellation, under a bespoke dashed-orbit cursor that stands in for a star. Every surface that carries content — nav, cards, the mobile menu — is cut from frosted glass (`bg-white/10–40` + `backdrop-blur`) laid over that sky, so structure reads as condensed atmosphere rather than opaque panels. Content itself arrives through a curtain-wipe reveal (a clip-path wipe, not a fade), as if being uncovered rather than fading in.

Typography carries the emotional half of the brief — an editorial serif (Cormorant Garamond) for anything the artist "says" (titles, pull-quotes, artwork names), paired with a quiet geometric sans (Outfit) for anything the interface "says" (nav, labels, metadata), always letter-spaced and uppercase at the smallest sizes. The two voices never swap roles.

This is a deliberate departure from a literal "gothic/matérico" palette: the artist's stated visual world (PRODUCT.md) is dark and material, but this build renders her declared theme — memory becoming matter, contemplation, being observed by the work — through a celestial, sky-lit register instead of a dark one. Treat that choice as intentional and confirmed by the shipped code, not as a gap to "correct" toward literal darkness.

**Key Characteristics:**
- Saturated sky-blue base surface, not a desaturated neutral.
- Frosted glass over hard panels; blur and translucency carry depth, not shadow.
- A recurring hairline rule (1px, low-opacity) as the only decorative line.
- One curtain-wipe reveal used everywhere content enters.
- A cursor and a particle field that both perform "celestial" literally.

## Colors

A single saturated blue family carries the entire system; ink and paper are the only non-blue notes, both used sparingly and deliberately.

### Primary
- **Deep Cerulean** (`#2D5A82`, `brand`): the interactive color — link/label hover states, card hover glow (`shadow-brand/20`), overlay tints on hover, pull-quote text and rule, particle field strokes and dots. Owns every "this is clickable / this responded" moment.

### Secondary
- **Midnight Indigo** (`#1C3F5E`, `accent`): reserved for two roles only — eyebrow labels and every focus-visible outline ring. Its scarcity is the point.

### Neutral
- **Sky Canvas** (`#93CAED`, `canvas`): the page's base background — a saturated sky-blue, standing in for the "neutral" surface role a desaturated gray would normally hold.
- **Deep Sky** (`#7BBCE0`, `canvas-deep`): a token reserved for a darker sky value (gradients/depth); not yet consumed by a component — treat as available headroom, not dead weight.
- **Ink** (`#121212`, `neutral-dark`): all body text, the Lightbox scrim (`neutral-dark/95`), and the cursor's stroke/fill.
- **Paper** (`#FBFBFB`, `paper`): the mobile-menu overlay fill and the lightest edge of glass surfaces.

### Named Rules
**The One Accent Rule.** Midnight Indigo (`accent`) never fills a surface and never carries body copy — it only labels (eyebrows, focus rings, and small static metadata stamps like an artwork's year, where `brand` fails AA contrast on the sky canvas). If a new element wants `accent` for anything else, it should almost certainly want `brand`.

## Typography

**Display/Title/Quote Font:** Cormorant Garamond (with Georgia, serif fallback)
**Body/Label Font:** Outfit (with system-ui, sans-serif fallback)

**Character:** A restrained editorial serif for anything the artist expresses, over a quiet geometric sans for anything the interface reports — the pairing never crosses roles.

### Hierarchy
- **Display** (400, `clamp(2.75rem, 7vw, 6rem)`, line-height 1.05): the hero line only (`HeroCelestial`), sometimes with an italic emphasis word in `brand`.
- **Title** (400, `clamp(2rem, 4vw, 3rem)`, line-height 1.15): every `SectionHeading` `<h2>`, the Lightbox item title, contact links.
- **Quote** (400 italic, `clamp(1.5rem, 2.5vw, 1.875rem)`, line-height 1.35): pull-quote paragraphs in project intros, left-bordered in `brand/40`.
- **Body** (400, `clamp(1.0625rem, 1.2vw, 1.25rem)`, line-height 1.7): running prose (About, project intros).
- **Lede** (400, `clamp(0.875rem, 1.2vw, 1rem)`, line-height 1.6, tracking 0.3em, uppercase): the hero subtitle only.
- **Eyebrow** (500, `0.75rem`, line-height 1.4, tracking 0.4em, uppercase): section labels, desktop nav links — always paired with `accent` or `neutral-dark`.
- **Label/Meta** (400, `0.625rem`, line-height 1.6, tracking 0.3em, uppercase): captions, dates, footer copyright, artwork metadata.

### Named Rules
**The Two-Voice Rule.** Serif is reserved for what the artist says (titles, quotes, artwork names); sans is reserved for what the interface says (nav, labels, metadata). Never render a heading in Outfit or a nav label in Cormorant.

## Layout

Two container widths carry the whole site: `max-w-shell` (`72rem`) for anything grid-based (galleries), and `max-w-reading` (`48rem`) for prose-led sections (About, Contact, project introductions). Horizontal padding steps `px-6 → md:px-12 → lg:px-24`. Vertical rhythm is a single `py-section` (`8rem`) per section, stepping up to `py-section-lg` (`12rem`) once, for Contact, so the final section reads as a deliberate close rather than another beat.

`SectionHeading`'s "responsive" alignment (center on mobile, left from `md:`) is the default heading behavior for any grid-led section (Gallery, Project); prose-led sections (About, Contact) stay left- or center-aligned outright instead. Galleries step `grid-cols-1 → md:2 → lg:3` with `gap-8`/`lg:gap-12`; project image grids step `grid-cols-1 → md:2` with `gap-6`/`lg:gap-8`, and a "wide" image is allowed to span both columns.

## Elevation & Depth

The system is flat-and-frosted, not shadow-driven: depth comes from `backdrop-blur` + translucency (glass over the sky), and shadow appears only as a hover *response*, tinted `brand`, never neutral black. The one hard-shadow exception is the Lightbox scrim, which goes fully opaque-dark (`neutral-dark/95` + blur) because it is replacing the sky entirely, not sitting on top of it.

### Shadow Vocabulary
- **Card rest** (`shadow-sm`): the quiet default under any glass card.
- **Card hover** (`shadow-2xl shadow-brand/20`, paired with `-translate-y-2`): the artwork card's "lifted" response — always brand-tinted, never gray/black.
- **Cursor/menu glass** (`backdrop-blur-sm` / `backdrop-blur-md` / `backdrop-blur-xl`, no shadow): nav, cursor badge, and mobile menu use blur alone for separation.

### Named Rules
**The Response-Only Shadow Rule.** Nothing carries a resting shadow heavier than `shadow-sm`. A stronger, brand-tinted shadow appears only in reaction to hover/interaction — it is never a static decoration.

## Shapes

Two radius families, no in-between: **card radius** (16px, `rounded-2xl`) for anything rectangular that holds content (artwork cards), and **full/pill radius** (`rounded-full`) for anything circular or capsule-shaped (buttons, badges, the cursor, icon hit-areas). A near-square `rounded-sm` (2px) shows up only as a focus-outline offset container on plain links/nav items, not as a visible corner style. Hairline rules (`h-px`/`w-px`, 1px, low-opacity `brand` or `neutral-dark`) are the system's only ornamental line — under section eyebrows, between contact links and the footer, as the vertical hero scroll-cue.

The signature shape event is `GalleryFloating`'s hover overlay: a `border-radius` that animates from `100%` (a circular badge) to `16px` (a full panel) via Framer Motion's `layout` animation — the only place radius itself is the animated property.

## Components

### Buttons
- **Pill CTA** (`rounded-full`, e.g. Lightbox's "Continuar explorando"): thin `border-white/10`, transparent background, uppercase label text; **hover** inverts to solid `paper` background with `neutral-dark` text.
- **Ghost icon buttons** (Lightbox close/prev/next): no visible chrome at rest — just a colored SVG stroke (`white/50–80`); **hover** is a Framer Motion `whileHover` (scale 1.1, plus a rotate-90 on close, or a directional nudge on prev/next), `whileTap` scale 0.9.
- **Focus:** every interactive element — links, buttons, nav toggle — gets the same `focus-visible:outline-2 outline-offset-2|4 outline-accent` (outline-white inside the dark Lightbox). This is applied uniformly; never omit it on a new interactive element.

### Cards (Artwork)
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** frosted glass — `bg-white/40`, `border border-white/20`, `backdrop-blur-sm`.
- **Shadow Strategy:** see Elevation — `shadow-sm` at rest, `shadow-2xl shadow-brand/20` + lift on hover.
- **Hover:** image scales to 105%, a `brand/10` tint washes the frame, and (Gallery only) the circle→panel overlay described in Shapes appears.

### Navigation
- **Style:** fixed, transparent at rest; once scrolled (or the mobile menu is open) it becomes `bg-white/10 backdrop-blur-md shadow-sm`.
- **Links:** eyebrow type (uppercase, tracked), `neutral-dark` at rest → `brand` on hover, always with the shared focus ring.
- **Mobile menu:** full-screen `paper/95` + `backdrop-blur-xl` panel sliding in from the right with a spring (`damping: 25, stiffness: 200`); links stagger in individually (`delay: 0.1 + i * 0.1`).

### Signature Component: Custom Cursor
Desktop-only (`pointer: fine`, motion-safe). Default state is a small `neutral-dark` dot inside a dashed, slowly-orbiting ring — a literal star glyph standing in for the pointer. Over any `[data-gallery-item]` it morphs into a soft `neutral-dark/90` circular badge reading "Ver obra." Cursor position is spring-smoothed (`damping: 20, stiffness: 300`), never 1:1 with the raw pointer.

### Signature Component: Particle Constellation
A full-viewport canvas behind everything: ~150 `brand`-colored dots drifting slowly, connected by `brand`-tinted lines that fade by proximity, and gently repelled by the pointer. This is the literal "celestial" field the rest of the system's glass and sky sit inside. Halves its particle count under 768px width; renders one static frame (no animation loop) under reduced motion.

### Signature Motion: Curtain Reveal
Every content block (`ScrollReveal`) enters via a `clip-path` wipe from a flat baseline up to full reveal — not a fade or a slide. Grid children within a revealed block stagger via `containerVariants`/`itemVariants` on top of that.

## Do's and Don'ts

### Do:
- **Do** treat the sky-blue canvas as the system's neutral base — don't introduce a gray/white page background as a "safer" neutral.
- **Do** use `brand` for every hover/interactive response color; reserve `accent` strictly for eyebrow labels and focus rings (The One Accent Rule).
- **Do** give every new interactive element the shared `focus-visible:outline-2 outline-offset-2|4 outline-accent` treatment (`outline-white` on dark surfaces).
- **Do** enter new content through `ScrollReveal`'s curtain wipe, not a plain fade/slide, so the reveal language stays singular across the site.
- **Do** keep new shadows brand-tinted and hover-only; a resting card never carries more than `shadow-sm`.

### Don't:
- **Don't** render headings, quotes, or artwork titles in the sans (Outfit) family, or nav/labels/metadata in the serif (Cormorant) family (The Two-Voice Rule).
- **Don't** add a third radius family. Everything is either 16px-rounded (content containers) or fully pill/circular (interactive chrome); nothing sits in between.
- **Don't** push `accent` into a background fill or body-copy color — it reads as a UI accent only, never as content color.
- **Don't** replace the custom cursor's dashed-orbit default with a plain dot, and don't let it run without the `pointer: fine` + reduced-motion guards.
- **Don't** darken the base palette toward the artist's literal "gothic/matérico" description (PRODUCT.md) without an explicit redesign request — this build's committed answer to that brief is the celestial, sky-lit register, not a literal dark one.
