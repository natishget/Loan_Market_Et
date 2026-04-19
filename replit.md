# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### LoanMarket Ethiopia (artifacts/loan-market)
Mobile app (Expo + React Native + TypeScript) for Ethiopian traders to create and manage loan agreements digitally.

**Stack:**
- Expo Router (file-based navigation)
- Redux Toolkit + React Redux (global state)
- Zod (form validation)
- @expo/vector-icons (Feather icons)
- AsyncStorage (persistence - not yet wired)

**Screens:**
- `app/(tabs)/index.tsx` — Home: stats, create loan CTA, recent activity
- `app/(tabs)/my-loans.tsx` — My Loans: "My Lending" tab + "Marketplace" tab with apply-as-lender
- `app/(tabs)/my-debts.tsx` — My Debts: all loans where user is borrower
- `app/(tabs)/profile.tsx` — Profile info + Notifications

**Redux Slices (store/slices/):**
- `authSlice` — current user (mock: Abebe Girma)
- `loanSlice` — loans[], marketplaceLoans[], createLoan, createMarketplaceLoan, applyToLoan, updateLoanStatus, cancelLoan
- `userSlice` — users list
- `notificationSlice` — notifications, markAsRead, markAllAsRead

**Key Files:**
- `types/index.ts` — all TypeScript interfaces
- `data/mockData.ts` — mock users, loans, marketplace loans, notifications
- `validation/loanSchema.ts` — Zod schemas for loan creation
- `constants/colors.ts` — design tokens (teal/gold fintech palette)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/loan-market run dev` — run Expo app

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
