---
date: 2026-01-02
capture_type: LEARNING
category: auto-captured
severity: high
tags: [error-correction, verification]
session_context: Todos have been modified successfully. Ensure that you continue to use the todo list to track your p
auto_captured: true
---

# Apprentissage Automatique - 2026-01-02

## Points Clés (Haute Confiance)

### CAPTURE

** Tailwind 4 does not support `@apply btn` where `btn` is a custom class - must inline all utility classes.

**NEXT:**
1. Create D1 database: `wrangler d1 create boulet-finances-db`
2. Run migrations: `bun run db:migrate`
3. Start dev servers: `bun run dev` (frontend) + `bun run dev:api` (backend)
4. Test the application locally

**STORY EXPLANATION:**
1. Previous session created complete BOULET-Finances accounting app
2. Build was failing with 25+ TypeScript errors
3. Table component's generic constraint was too restrictive for entity types
4. Dashboard expected different data structure than shared types defined
5. Multiple unused imports were flagged by strict TypeScript
6. Tailwind 4's new architecture rejected chained custom class references
7. Fixed all issues by relaxing generics, aligning types, and inlining styles
8. Build now succeeds and app is ready for local testing

**COMPLETED:** BOULET-Finances build errors fixed, ready for testing.

> Contexte: Response format CAPTURE field

## Points Secondaires (Confiance Moyenne)

- errors to get the app compiling. Let me read the Table component and fix
- errors are fixed. Now there's a Tailwind 4 CSS issue. Let me check and fix

---

*Capturé automatiquement par capture-learning.ts*
