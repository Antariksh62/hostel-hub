# Keep the prototype honestly local

Audit result: the app already has no network calls — no `fetch`, no API client, no server functions, no database. Complaint creation, status updates and assignment all run through `src/services/hms-store.tsx`, which is pure React state over seed data in `src/data/prototype-data.ts`.

One thing does imitate a backend and should change:

## Remove simulated network latency

`src/services/auth.tsx` contains a `delay()` helper (650–800ms artificial waits) used by sign-in, OTP send, OTP verify and registration. That exists only to fake a server round-trip. It will be removed so the mock layer resolves immediately and never pretends to be talking to anything.

Where a submit button currently shows a "signing in…" pending state driven by that delay, the state stays in the component, but it resolves instantly rather than waiting on a fake request.

## Reinforce the separation

- `src/data/prototype-data.ts` stays the only place mock records live, with a top-of-file comment marking it as prototype data.
- `src/services/hms-store.tsx` and `src/services/auth.tsx` each keep an explicit header comment: local state only, no network, replace this module with the real HMS API layer.
- Components keep consuming `useHms()` / `useAuth()` only — no direct imports of mock data in UI files.

## Technical notes

- Files touched: `src/services/auth.tsx` (drop `delay`, make the four mock methods synchronous-resolving), `src/routes/index.tsx` only if a call site needs adjusting after that.
- No changes to UI, layout, tokens, routes or the complaint/room/staff data model.
