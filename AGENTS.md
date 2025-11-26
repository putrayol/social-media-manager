# Repository Guidelines

## Project Structure & Module Organization
- Next.js app router lives in `src/app`; route groups and layout composition follow the folder hierarchy.
- Reusable UI sits in `src/components`; feature-scoped pieces live under `src/features`.
- Shared utilities/config are in `src/lib`, `src/config`, and `src/constants`.
- Middleware/auth is handled via `src/middleware.ts` and Clerk instrumentation in `src/instrumentation*.ts`.
- Database schema and migrations are managed in `prisma/schema.prisma`; static assets go in `public`.
- Automation helpers and seeds belong in `scripts/`.

## Build, Test, and Development Commands
- `npm run dev` — start the Next.js dev server with Turbopack.
- `npm run build` — production build; must succeed before release.
- `npm run start` — serve the built app locally.
- `npm run lint` / `npm run lint:strict` — lint with ESLint (strict fails on warnings).
- `npm run lint:fix` — autofix lint issues and run Prettier.
- `npm run format` / `npm run format:check` — format or verify formatting with Prettier.
- `npm run prisma:generate` — regenerate Prisma client; run after schema edits.
- `npm run prisma:migrate` — create/apply a dev migration; ensure `DATABASE_URL` is set (see `env.example.txt`).

## Coding Style & Naming Conventions
- TypeScript-first; keep components typed and prefer `zod` for validation.
- Use 2-space indentation, single quotes via Prettier defaults, and avoid implicit `any`.
- Name React components in `PascalCase`, hooks in `useCamelCase`, helpers in `camelCase`.
- Co-locate feature styles/assets with the feature when practical; prefer shadcn/Radix patterns already in `src/components`.

## Testing Guidelines
- No unified test runner is configured; add targeted tests alongside new features (component tests in `src/*`, API tests in `src/app/api`).
- For new data flows, add type-safe guards and runtime validation (zod) and exercise critical paths via lint + manual flows.
- Keep seeds/mocks deterministic; prefer faker factories in `dev` scripts when needed.

## Commit & Pull Request Guidelines
- Use short, present-tense subjects; prefer a clear prefix when relevant (e.g., `fix: ...`, `feat: ...`, `chore: ...`).
- One logical change per commit; include schema and generated Prisma client updates together.
- PRs should describe intent, key changes, and test/validation steps; link issues when available.
- Include screenshots/GIFs for UI-impacting work and note migration impacts or env var changes explicitly.

## Environment & Security Notes
- Copy `env.example.txt` to `.env.local` for local runs; never commit secrets.
- Prisma migrations alter the local database; back up or reseed before destructive changes.
- Keep third-party keys (Clerk, Sentry) in the environment; avoid inlining them in code or config.
