# Copilot Instructions for PartPilot

## Project Overview
PartPilot is an open-source electronics part inventory system built with Next.js, React, TypeScript, Prisma, and NextAuth. It features direct LCSC integration, barcode scanning, and a user-friendly dashboard for managing electronic components.

## Architecture & Key Patterns
- **Frontend**: Located in `app/` and `components/`, using Next.js app router. Pages are organized by feature (e.g., `app/categories/`, `app/part/[partId]/`).
- **API Routes**: All backend logic is in `app/api/`, with RESTful endpoints for parts, categories, and authentication. Example: `app/api/parts/create/route.ts` for part creation.
- **Database**: Uses Prisma ORM (`prisma/schema.prisma`) with migrations in `prisma/migrations/`. Data access is abstracted via Prisma client (`lib/prisma.ts`).
- **Authentication**: Managed by NextAuth in `app/api/auth/[...nextauth]/route.tsx` and related files.
- **External Integrations**: LCSC API logic is in `lib/helper/lcsc_api.ts`.
- **UI Components**: Shared components are in `components/` and `lib/components/`.

## Developer Workflows
- **Local Development**: Use Docker Compose (`docker-compose.yml`) to run Next.js and PostgreSQL. Start with:
  ```bash
  docker-compose up --build
  ```
- **Access App**: Visit [http://localhost:3000](http://localhost:3000) after containers start.
- **Database Migrations**: Use Prisma CLI for schema changes. Example:
  ```bash
  npx prisma migrate dev
  ```
- **Seeding Data**: Seed scripts are in `prisma/seed.mjs`.

## Conventions & Patterns
- **File Naming**: API routes use `route.ts` (not `index.ts`).
- **TypeScript**: All logic and components are written in TypeScript.
- **Modular Structure**: Features are separated by directory (e.g., `categories`, `part`, `auth`).
- **Styling**: CSS modules are used for scoped styles (e.g., `page.module.css`).
- **Loading/Error States**: Each page/feature has a `loading.tsx` and/or `not-found.tsx` for UX consistency.
- **Provider Pattern**: Context providers (e.g., `SettingsProvider/`) are used for global state.

## Integration Points
- **LCSC API**: See `lib/helper/lcsc_api.ts` for supplier integration.
- **Prisma**: All DB access via `lib/prisma.ts`.
- **NextAuth**: Auth logic in `app/api/auth/`.

## Examples
- To add a new API route for parts, create a file in `app/api/parts/[action]/route.ts`.
- To add a new page, create a directory in `app/[feature]/` and add `page.tsx`.
- For global settings, use the provider in `components/SettingsProvider/`.

---
If any section is unclear or missing, please provide feedback to improve these instructions.