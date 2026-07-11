<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# StockSense Frontend - Agent Guide

StockSense is a **data-first financial platform** for CSE (Colombo Stock Exchange)
retail investors. It surfaces AI-generated, news-driven stock direction signals,
company impact analysis, and live price data from the `core` backend.

**Design north star:** Bloomberg / TradingView-grade. Communicate **trust, speed,
precision, clarity** - never flashy. Restrained color, excellent typography,
data-focused layouts. If a choice trades "looks exciting" against "looks
credible," pick credible.

## Stack

- **Next.js 16** (App Router, React 19, RSC by default) - read `node_modules/next/dist/docs/` before writing Next code (see rule above).
- **Tailwind v4** - tokens via `@theme` in `app/globals.css`. Use `@tailwindcss/postcss` (NOT the `tailwindcss` PostCSS plugin).
- **Fonts via `next/font`** - never `<link>` Google Fonts.
- Server Components by default; `"use client"` only on interactive leaves (theme toggle, accordions, charts).

## Installed skills (`.claude/skills/`)

- **`design-taste-frontend`** - anti-slop frontend rules. Follow them. Most relevant here: max 1 accent color, borders-over-shadows, no glassmorphism, hero discipline, theme lock, real images (no div fake-screenshots), WCAG checks.
- **`ui-ux-pro-max`** - design-system recommender. Query with:
  `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system` (run from this dir; needs Python 3).

## Brand identity

**Personality:** Professional · Premium · Trustworthy · Intelligent · Modern · Data-first
**Keywords:** Clean · Minimal · Enterprise · Financial · Glass-free · Sharp edges · High information density

## Color system (single source of truth)

One accent (blue). Green/red/amber are **semantic data colors only** - never decorative.

### Brand / structure
| Token | Hex | Use |
|---|---|---|
| `navy` | `#0B1220` | nav, header, sidebar, dark bg |
| `slate` | `#1E293B` | cards, tables, containers (dark) |
| `accent` | `#2563EB` | buttons, links, active tabs, chart primary, focus rings |

### Semantic (data only)
| Token | Hex | Use |
|---|---|---|
| `up` | `#16A34A` | price ↑, gains, buy |
| `down` | `#DC2626` | price ↓, loss, sell |
| `warn` | `#F59E0B` | watchlist, pending, neutral alert |
| `error` | (see rule) | form/validation errors - MUST be visually distinct from `down` |

### Light theme (default)
`bg #F8FAFC` · `card #FFFFFF` · `border #E5E7EB` · `text #111827` · `text-secondary #6B7280` · `text-muted #94A3B8`

### Dark theme (toggle)
`bg #0B1220` · `card #111827` · `card-2 #1F2937` · `border #334155` · `text #FFFFFF` · `text-secondary #CBD5E1`

### Neutral ramp (Slate - cool gray, do NOT mix with warm grays)
`50 #F8FAFC · 100 #F1F5F9 · 200 #E2E8F0 · 300 #CBD5E1 · 400 #94A3B8 · 500 #64748B · 600 #475569 · 700 #334155 · 800 #1E293B · 900 #0F172A`
Use for table zebra/hover, headers, disabled states.

## Typography

- **Inter** - UI + body. Headlines `tracking-tight`; body uses `text-secondary`.
- **IBM Plex Mono** - ALL numerics (prices, %, tickers, volumes, AUC, dates in tables). Always apply `font-variant-numeric: tabular-nums` so digits align in columns. This is the primary "precision" signal - do not render data numbers in Inter.

## Shape & materiality

- **Corner radius lock: `6px`** for cards, inputs, buttons. One scale everywhere (sharp-leaning; not pill, not zero).
- **Borders over shadows.** Compose with `border` + `divide-y`. Shadows only for true overlays (dropdowns, modals), tinted to the bg hue - never pure black.
- **Density: compact.** Table rows `h-9`/`h-10`; section rhythm `gap-4`.

## Theme rule

Light-first. Theme set ONCE at the root and locked - **no section inversions**
(a dark section must not appear mid-scroll on a light page). Dark mode via toggle.

## Non-negotiable rules (accessibility + correctness)

1. **Never encode price direction by color alone.** Always pair `up`/`down` color with a glyph or sign (`▲`/`▼`, `+`/`−`). ~8% of men are red-green colorblind; this also reinforces the signal for everyone.
2. **`error` ≠ `down`.** Form/validation errors must be distinguishable from "price fell" - use an icon + border treatment, not the same bare red text.
3. **WCAG AA contrast.** `text-muted #94A3B8` on white fails AA (~2.8:1) - use it only for large/decorative labels, never body content. Use darkened `up`/`down` variants for small numbers on light cards.
4. **Western market convention** (green = up, red = down). Do not flip unless explicitly targeting a market where the convention differs.
5. **One accent, locked.** No second accent color appearing in later sections. No AI-purple/teal gradients (that earlier marketing palette is superseded by this navy/blue system).
6. **"Not financial advice"** disclaimer in the footer on public-facing pages.
7. **Always write "CSE" - never spell out "Colombo Stock Exchange"** anywhere in copy, headings, alt text, or metadata.
8. **No real stock tickers, company names, prices, or signals in marketing/landing copy.** Use obviously-illustrative placeholders (e.g. `SAMPLE.A`, "Example Bank PLC") and label sample data as illustrative. Real tickers/prices imply recommendations and conflict with "not financial advice." (Real tickers are fine inside the authenticated app, driven by live data.)

## Backend integration

API is the `core` service: `https://core-stocksense-backend.vercel.app`.
Auth: Supabase Auth via `/api/auth/*` (signup, login, refresh, logout, me) -
tokens returned in JSON body, `Authorization: Bearer <access_token>` for
protected calls. Other data: `/api/prices/update`, `/api/analysis/:id` (read via
`GET /api/analysis/:articleId`), `/api/news/top`.
