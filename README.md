# NY START – Recovery Companion

*Ett steg av gangen. Et nytt liv er mulig.*

A Norwegian-first recovery and sobriety companion with particular depth for crack and powder cocaine, supporting 12 substance types. It is a supportive companion – **not** medical treatment and not a replacement for healthcare professionals.

> Status: Phase 1 (architecture) and Phase 2 (core web app) implemented and tested. **Not production-ready** – see [docs/LAUNCH_READINESS.md](docs/LAUNCH_READINESS.md).

## What works today
- Onboarding with substance selection, goals (incl. reduction / exploring), safety notices, optional personal info and motivations, generated first plan
- Dashboard: sobriety counter or reduction progress, estimated savings, next milestone, daily message, daily check-in, quick actions
- SOS without an account: 113 / 116 117, crisis lines, breathing, grounding, craving timer, trusted contacts, your own reasons, reflection
- Progress: per-substance stats, milestones that survive a lapse, achievements, savings chart; compassionate relapse registration
- Savings goals with estimated completion; plan checklist
- Verified support directory (sources + dates)
- Profile: edit everything, accessibility (text size, high contrast, dark mode, reduced motion), export JSON, delete all
- Data is stored **only on the device**; optional Supabase sign-in (no recovery data uploaded yet)

## Quick start
```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # unit + database tests
pnpm build && pnpm test:e2e
```

## Repository
| Path | |
|---|---|
| `packages/core` | platform-independent domain logic, content, i18n |
| `apps/web` | Next.js 16 web app |
| `supabase/` | migrations, generated seed, RLS test suite |
| `docs/` | [architecture](docs/ARCHITECTURE.md) · [features](docs/FEATURES.md) · [database](docs/DATABASE.md) · [design system](docs/DESIGN_SYSTEM.md) · [roadmap](docs/ROADMAP.md) · [risk register](docs/RISK_REGISTER.md) · [privacy](docs/PRIVACY_COMPLIANCE.md) · [deployment](docs/DEPLOYMENT.md) · [launch readiness](docs/LAUNCH_READINESS.md) |

## Safety
In an emergency in Norway call **113**. Urgent medical help: **116 117**.
