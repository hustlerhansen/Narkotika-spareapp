# Design system

Implemented in `apps/web/src/app/globals.css` (tokens) and `apps/web/src/components/ui/*` (primitives).

## Principles
Safe · calm · modern · trustworthy · motivational · accessible. No imagery of drugs or paraphernalia. No shame language, no red "streak lost" states. Red is reserved for SOS/emergency and destructive actions.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--navy` | #101827 | – | brand, hero gradient start, logo |
| `--teal` | #14B8A6 | – | **decorative only** (2.5:1 on white – fails AA for text) |
| `--primary` | #0F766E (teal-700, 5.5:1 on white) | #2DD4BF on navy text | buttons, links, active nav |
| `--accent` | #F5B841 gold | same | milestones, badges, savings icon – always with navy text |
| `--bg` | #F8FAFC | #0B1220 | page |
| `--surface` / `--surface-2` | #FFFFFF / #F1F5F9 | #111A2E / #1A2540 | cards / subtle fills |
| `--text` / `--text-muted` | #1E293B / #475569 | #E2E8F0 / #A3B1C6 | |
| `--danger` | #B91C1C | #F87171 | SOS, 113, delete |

High contrast (`data-contrast="high"`) switches to pure black/white with visible borders and no gradients, in light and dark. Dark mode follows the OS unless overridden (`data-theme`).

## Typography & sizing
System font stack (no web-font download → privacy, speed). Root size = 100% × `--text-scale` (1, 1.15, 1.3, 1.5). All sizes in rem, so user text scaling and browser zoom work.

## Components
`Button`/`ButtonLink` (primary, secondary, ghost, danger, accent; md/lg), `Card`, `PageHeader`, `Field` (label + hint + error wiring with `aria-describedby`/`aria-invalid`), `TextInput`, `TextArea`, `Select`, `Choice` (large native checkbox/radio cards), `ProgressBar` (role=progressbar), `Notice` (safety callout), `BottomNav` (5 items, SOS centre in red), `SobrietyCounter`, `MonthlySavingsChart` (single-series bars + sr-only table).

## Interaction & accessibility rules
- Minimum target 48×48 px (`.tap`).
- Visible focus ring (`:focus-visible`, 3px).
- Skip link to `#main`; onboarding moves focus to each step's heading.
- Native form controls only; custom visuals layered on top.
- Motion: entrance fade ≤ 350 ms; disabled under `prefers-reduced-motion` unless the user opts in, forced off with `data-motion="reduce"`.
- Every page passes axe WCAG 2.1 AA in light, dark and high contrast (E2E).
- Charts: one hue, rounded bar tops anchored to the baseline, hover readout, data table for screen readers.

## Navigation
Bottom bar: Hjem · Fremgang · **SOS** · AI Coach · Profil. "Få hjelp" in the header on every main screen. Onboarding header always shows "Russug nå".
