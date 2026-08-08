<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NEXCLINIC FRONTEND - AI AGENT GUIDELINES

## 1. Core Tech Stack
- **Framework**: Next.js 15 (App Router with TypeScript).
- **Styling**: Tailwind CSS & `shadcn/ui`.
- **Icons**: `lucide-react`.
- **Data Fetching**: `TanStack Query v5` & `apiClient` from `@/lib/axios`.
- **State Management**: `Zustand` (`@/store/useAuthStore`).

## 2. Code Quality & Standards
- Add `'use client';` directive to components using hooks, state, or event handlers.
- Import types from `@/types` for data models (User, Patient, Doctor, Appointment, MedicalRecord).
- Ensure all user-facing UI labels, modals, and error messages are written in natural Vietnamese (`vi`).
- Implement proper loading indicators (`isLoading`) and error boundaries.

