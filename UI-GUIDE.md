# NexClinic interface

## Run locally

From `fe/`, run `npm ci` then `npm run dev`. The API defaults to
`http://localhost:8080/api/v1`; override it with `NEXT_PUBLIC_API_BASE_URL`
in `.env.local`. Sign in using an existing backend account.

Validation: `npm run lint`, `npx tsc --noEmit`, and `npm run build -- --webpack`.
The Webpack option is useful in environments where Turbopack cannot bind a port.

## Visual system

Warm off-white backgrounds, forest-green actions, restrained borders, text-first
navigation and generous spacing are defined in `src/app/globals.css`. Existing
blue/purple utility tokens map to the same green palette to keep older screens
consistent. New surfaces use `clinic-panel`, `btn-primary`, `btn-secondary`,
`field-label` and `field-input`.

Page entrances, panels, hover states and dialogs have subtle motion.
`prefers-reduced-motion` disables movement. Native dialog elements supply focus
containment and Escape dismissal. Mobile navigation and messaging have separate
compact layouts. Fonts use the system stack without a Google Fonts request.

## Flow coverage

- Public landing page, registration, login and protected dashboard.
- Role-aware navigation to appointments, doctors, patients, medical records,
  prescriptions, inventory, payments, messaging, NexAI, users and settings.
- Doctor and patient details link to a preselected two-step booking dialog.
- Booking shows available time slots, the seven-day date limit, same-day minimum
  lead time, fee summary and pending confirmation result. All mutations still
  use the existing services.
- Patients can open “Cập nhật” to retrieve their confirmed appointments.
- Shared feedback toasts, confirmation dialogs, loading, empty and error states.

## Verification checklist

Use desktop and 390px mobile widths. Check keyboard navigation, modal focus and
Escape, reduced motion, mobile menu, chat back navigation, failed service calls,
empty lists, booking steps and totals, and Vietnamese input composition.

Backend integration remains necessary for authoritative business validation,
including patient appointment spacing, concurrent requests, fee changes and
doctor ownership. The updates panel reads confirmed appointments; it is not a
persistent notification inbox with unread state or push delivery. Backend
authorization must enforce access regardless of which controls the UI shows.
