# NY START – Recovery Companion

*Ett steg av gangen. Et nytt liv er mulig.*

A Norwegian-first recovery and sobriety companion with particular depth for crack and powder cocaine, supporting 12 substance types. It is a supportive companion – **not** medical treatment and not a replacement for healthcare professionals.

> Status: Phases 1–4 implemented and tested for the web (Phase 4 = launch readiness). **Not production-ready and not deployed** – all educational content awaits clinical review, legal documents are drafts, and the AI module is disabled. See [docs/LAUNCH_PLAN.md](docs/LAUNCH_PLAN.md), [docs/LAUNCH_READINESS.md](docs/LAUNCH_READINESS.md) and [docs/PHASE_4_REPORT.md](docs/PHASE_4_REPORT.md).

## What works today
- Onboarding with substance selection, goals (incl. reduction / exploring), safety notices, optional personal info and motivations, generated first plan
- Dashboard: sobriety counter or reduction progress, estimated savings, next milestone, daily message, daily check-in, quick actions
- SOS without an account: 113 / 116 117, crisis lines, breathing, grounding, craving timer, trusted contacts, your own reasons, reflection
- Progress: per-substance stats, milestones that survive a lapse, achievements, savings chart; compassionate relapse registration
- Savings goals with estimated completion; plan checklist
- Verified support directory (sources + dates)
- Profile: edit everything, accessibility (text size, high contrast, dark mode, reduced motion), export JSON, delete all
- **Kunnskapssenter**: 62 original Norwegian articles (20 on crack/cocaine), search, bookmarks, reading progress, offline – marked "Venter på faglig gjennomgang"
- **Min dagbok**: private journal with guided prompts, mood 1–10, emotions, tags, search, export
- **Mine triggere**: triggers (no GPS), craving log, deterministic pattern insights with stated limits, coping suggestions from your own feedback
- **Min plan**: daily tasks with recurrence, weekly goals without penalties, 8-step personal recovery plan
- **Min AI-støtte**: built with a deterministic safety layer but **disabled** (server flag)
- Optional passphrase encryption of local data; offline support for SOS and essential articles
- Data is stored **only on the device**; optional account (register with 18+ and terms, e-mail confirmation, sign-in, password reset, account data export, account deletion) – no recovery data is uploaded
- Installable PWA (Android and iOS home screen), calm offline notice and offline fallback page
- Daily check-in with optional "drug-free today", savings explanation, calm milestone acknowledgement
- Aggregate-only admin overview (`/admin`) – administrators cannot see journals or other personal data

## Quick start
```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # unit + database tests
pnpm build && pnpm test:e2e
# real Supabase stack (Docker): see docs/TESTING.md
supabase start && pnpm test:integration
```

## Repository
| Path | |
|---|---|
| `packages/core` | platform-independent domain logic, content, i18n |
| `apps/web` | Next.js 16 web app |
| `supabase/` | migrations, generated seed, RLS test suite |
| `docs/` | [architecture](docs/ARCHITECTURE.md) · [features](docs/FEATURES.md) · [database](docs/DATABASE.md) · [design system](docs/DESIGN_SYSTEM.md) · [roadmap](docs/ROADMAP.md) · [risk register](docs/RISK_REGISTER.md) · [privacy](docs/PRIVACY_COMPLIANCE.md) · [AI safety](docs/AI_SAFETY.md) · [local data security](docs/LOCAL_DATA_SECURITY.md) · [clinical review](docs/CLINICAL_REVIEW.md) · [deployment](docs/DEPLOYMENT.md) · [launch readiness](docs/LAUNCH_READINESS.md) · [launch plan](docs/LAUNCH_PLAN.md) · [testing](docs/TESTING.md) · [performance](docs/PERFORMANCE.md) · [AI evaluation plan](docs/AI_EVALUATION_PLAN.md) · [Phase 3 report](docs/PHASE_3_COMPLETION_REPORT.md) · [Phase 4 report](docs/PHASE_4_REPORT.md) |

## Safety
In an emergency in Norway call **113**. Urgent medical help: **116 117**.
