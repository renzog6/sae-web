# Copilot Instructions for SAE Web

This repository is a monorepo for the SAE business-management application:

- `sae-frontend/` is a Next.js 16 App Router application using TypeScript, Tailwind CSS v4, shadcn/ui, and NextAuth.
- `sae-backend/` is a NestJS API using Prisma and MySQL.
- The root folder contains Docker Compose files for running the app stack together.

Use the project conventions from the frontend `AGENTS.md` and the backend README when working in either half of the repo.

## Commands

### Root-level stack

```bash
# Start the full stack with Docker Compose
# (check the compose files first for the exact container names and env files)
docker compose -f docker-compose.yml up --build
```

### Frontend (`sae-frontend/`)

```bash
cd sae-frontend
npm install
cp .env.example .env.local    # if a local env file is needed
npm run dev                   # Next.js dev server on port 3003
npm run build                 # Production build
npm run start                 # Production server on port 3003
npm run lint                 # ESLint
npm run typecheck            # TypeScript check
```

Single frontend validation:

```bash
cd sae-frontend
npx eslint app/path/to/file.tsx
npx tsc --noEmit
```

There is no dedicated frontend Jest/Vitest test runner configured in the current package.json; prefer lint + typecheck for local validation in this app.

### Backend (`sae-backend/`)

```bash
cd sae-backend
npm install
cp .env.example .env         # if a local env file is needed
npm run start:dev            # NestJS watch mode
npm run build                # Build for production
npm run start:prod           # Run built app
npm run lint                # ESLint on src/apps/libs/test
npm test                    # Run all Jest tests
npm run test:cov            # Coverage
npm run test:e2e            # End-to-end tests
```

Run a single backend test file:

```bash
cd sae-backend
npm test -- --runTestsByPath src/modules/<domain>/<file>.spec.ts
# or the equivalent Jest invocation
npx jest src/modules/<domain>/<file>.spec.ts --runInBand
```

Common database setup commands:

```bash
cd sae-backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run db:setup
```

## High-level architecture

### Frontend architecture

The frontend is organized as a domain-driven App Router app. Main route groups include:

- `app/companies/`
- `app/employees/`
- `app/equipments/`
- `app/tires/`
- `app/users/`
- `app/settings/`
- `app/dashboard/`

The app follows a service/hook pattern:

- `app/` contains route-based pages and layouts.
- `components/ui/` holds shadcn/ui primitives.
- `lib/api/` contains API client/service classes.
- `lib/hooks/` contains TanStack Query hooks.
- `lib/validations/` contains Zod schemas.
- `lib/types/` contains shared TypeScript models.

The app is not a generic CRUD app; it mirrors the business domains in the backend (companies, employees, equipment, tires, settings, users), with route folders and API services aligned to those domains.

### Backend architecture

The backend is a modular NestJS application centered on `src/modules/`:

- `auth/` for authentication and JWT guards
- `common/` for shared DTOs, validators, filters, logging, and utilities
- `modules/*` for business domains such as `companies`, `employees`, `equipment`, `locations`, `persons`, `tires`, `users`, etc.
- `reports/` for export/report generation
- `server-files/` for file upload and document handling
- `prisma/` for Prisma integration

The app uses Prisma with MySQL and relies on structured module boundaries rather than a single giant controller. If a change affects a business domain, look for the corresponding module and its DTO/service/controller files before editing shared code.

### Cross-app contract

The frontend calls the backend through environment-based URLs (`NEXT_PUBLIC_API_URL`, `API_URL`, `NEXTAUTH_URL`), and the backend exposes JSON APIs plus Swagger/OpenAPI docs. Keep the frontend and backend contracts aligned when adding or renaming endpoints or fields.

## Key conventions

### Frontend conventions

- Use `PascalCase` for React component names and TypeScript type names.
- Use `camelCase` and `useX` naming for hooks, e.g. `useCompanies`.
- Use kebab-case filenames for app and utility files.
- Prefer existing service and hook patterns over ad hoc fetch logic.
- Use Zod schemas for form/validation logic and the `@/` alias for internal imports.
- Keep route-level folders and domain API services aligned, e.g. `app/companies/*` goes with `lib/api/companies/*`.

### Backend conventions

- Keep business logic inside domain modules under `src/modules/*`.
- Follow the NestJS pattern: controller -> service -> Prisma access, with DTO validation.
- Reuse shared validation, exception, and response utilities from `src/common/` instead of duplicating logic.
- Keep Prisma usage centralized through the Prisma service/module.
- Prefer additive, domain-scoped changes over cross-cutting edits unless the issue is truly shared infrastructure.

### Repository conventions

- Do not treat the repo as a single package; work in the correct half (`sae-frontend` or `sae-backend`) for the issue.
- If you add a new feature with UI and API pieces, update both sides together to preserve the contract.
- Follow the existing patterns already described in `sae-frontend/AGENTS.md` for frontend work and in `sae-backend/README.md` for backend architecture.

## Practical workflow

- For frontend work, start in `sae-frontend/` and validate with `npm run lint` and `npm run typecheck`.
- For backend work, start in `sae-backend/` and validate with `npm run lint` and the narrowest Jest test possible.
- If a change touches domain data contracts or API payload shape, check both the backend DTO/service layer and the frontend API hooks/forms.

## Notes for future Copilot sessions

- This repo is materially split between a frontend and a backend app, so “big picture” understanding comes from both halves together.
- The frontend is organized around business domains and route folders; the backend is organized around NestJS modules and Prisma-backed domain services.
- Keep domain responsibilities separated and prefer existing project patterns over introducing a new abstraction.
