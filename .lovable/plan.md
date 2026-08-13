# Hostel Management System — Role-Based UI Prototype

A frontend-only prototype with three role experiences (Student, Staff, Warden) sharing one calm, minimal design system. Mock data only — no backend, auth, or APIs. The existing HOIDSS dashboard is not touched or imitated.

## Entry flow

`/login` is the entry point: `/` redirects there, and the normal flow is login → authentication → the matching dashboard. The old role picker is demoted to a prototype-only route, `/prototype-roles`, reachable from a small plain "Switch prototype role" text link in the app chrome and a discreet link under the login form. It is styled as a developer/testing utility — plain list, explicit "Prototype testing only" label — never as a production sign-in mechanism.

## Navigation model

- Mobile: bottom tab bar (4–6 items, icon + label), no sidebar.
- Tablet: same content, two-column where it helps (list + detail).
- Laptop/desktop: quiet left sidebar, content capped at a readable max width.

## Student (mobile-first)

Tabs: Home, My Complaints, Room, Profile.

- **Home** — greeting, room 204 / Floor 2, one-line complaint summary, prominent "Report a Problem" button, 2–3 recent complaints, three quick actions.
- **Report a Problem** — single-screen form: category, description, optional photo/video (mock file picker). Room prefilled from profile, shown read-only. Submit → confirmation screen with complaint ID.
- **Complaint detail** — vertical timeline Submitted → Assigned → In Progress → Resolved, plus category, room, date, assigned staff, resolution note. No internal management data.
- **My Complaints** — active/resolved segmented list. **Room** — room, floor, roommates, facilities. **Profile** — static details.

## Staff (mobile-first, task-focused)

Tabs: My Work, Assigned, History, Profile.

- **My Work** — "Today's Work" strip (Assigned / Pending / In Progress / Resolved as compact inline counts, not four big cards), then the task list.
- **Task card** — room number leading, category, short description, time since assignment, status badge.
- **Task detail** — full complaint, attached media thumbnail, and one clear action to advance status (Start Work → Mark Resolved) with a resolution note and a confirmation step.
- **History** — completed work, grouped by day. No analytics.

## Warden (denser, still calm)

Nav: Overview, Complaints, Rooms, Staff, Reports, Profile.

- **Overview** — six restrained metrics (total rooms, occupied, open, in progress, resolved, overdue) as a bordered stat row, then a "Needs Attention" list of 2–3 items tagged Attention / Monitor / Informational.
- **Complaints** — searchable table on desktop, card list on mobile. Filters: status, category, floor, date. Row opens a detail drawer with room, staff, media, and assign/update controls (local state only).
- **Rooms** — floor tabs (1–5) with real numbering 101–120, 201–220, 301–320, 401–420, 501–510 = 90 rooms. Compact room tiles with three states: Normal, Has Active Complaints, Multiple Complaints — state shown by label/icon plus color, never color alone. Tap opens room detail. No heatmap.
- **Staff** — simple workload table: name, active assignments, in progress, resolved, with a plain flag on genuine imbalance.
- **Reports** — light summary lists (complaints by category, by floor, resolution time), no chart-heavy dashboard.

## Light + dark mode

Both themes are first-class, built from one shared token set — no duplicated components, no inverted palette.

- A `ThemeProvider` writes `.dark` on `<html>`, reads/writes `localStorage`, and defaults to the system preference. A labelled sun/moon toggle sits in the app chrome (sidebar footer on desktop, header on mobile) and on the role picker, so it works everywhere including dialogs, drawers, tables and mobile nav.
- Dark surfaces are soft charcoal (never pure black) with slightly lifted card/popover layers; text is near-white, not `#fff`. Light mode stays white/light-gray with charcoal text.
- Tokens defined per mode for background, foreground, card/popover, border, input, muted, primary blue, and status colors (green resolved, amber pending, red critical only) — with separate accessible foreground/tint values per mode for badges, empty states and error states.
- Contrast checked in both modes; status always carries an icon and text label, never color alone.

## States

Loading skeletons, empty states ("No complaints yet.", "All caught up.", "No active assignments."), an inline error state, submit-success and destructive-action confirmation dialogs. Empty states stay empty — no filler data.

## Scope guarantees

- This project currently contains only the blank template — no HOIDSS files exist here, so nothing of HOIDSS is redesigned, replaced, or touched. All work is additive: new routes, new components, new mock-data files, plus token additions in `src/styles.css`.
- The prototype's TanStack routing is a demo shell only. Screens are built as plain, portable React components with mock data passed in, so they drop into the existing React + Vite / React Router HMS without carrying routing or architecture changes along.
- No backend, auth, database, API, notifications, or AI features. No extra KPI cards, charts, or analytics beyond what is listed above.

## Technical notes

- TanStack Start file routes: `/` (role picker), `/student/*`, `/staff/*`, `/warden/*`, each role subtree with its own layout route rendering `<Outlet />` and role-appropriate nav.
- Design tokens in `src/styles.css` (`@theme inline` + `:root` + `.dark`). Moderate radii, minimal shadow, no gradients or glassmorphism.
- shadcn primitives (button, input, select, badge, dialog, drawer/sheet, table, tabs, skeleton) styled to the tokens.
- Mock data lives in `src/data/*.ts`: exactly 90 rooms (101–120, 201–220, 301–320, 401–420, 501–510), ~30 complaints across statuses/floors, ~6 staff, one student profile. Local React state per role subtree so status updates feel real during the session.
- Each route gets its own `head()` metadata.
- Final check with a headless browser at 360, 390, 768, 1024, 1280 and 1440px in both themes: no horizontal scroll, clipping, or overlap; nav, forms and drawers usable at every width.


## Integration constraints

- **CSS isolation** — all new tokens are namespaced (`--hms-*`) and mapped into Tailwind theme names, added additively to `src/styles.css`. No global element/tag resets, no assumption that this stylesheet replaces the HMS one; a single `hms-root` wrapper class scopes the token block so it can be dropped into the existing app without colliding.
- **Portable components** — every Student/Staff/Warden UI component is a plain React component taking props and callbacks. No `useNavigate`, `Link`, `useParams`, or loader APIs inside them; routing lives only in the route/layout files, which pass down data and `onNavigate`-style handlers. Components move to the React Router HMS unchanged.
- **Mock data separation** — mock records live in `src/data/*.ts` and all mutations go through a thin service layer (`src/services/*.ts`, e.g. `listComplaints`, `createComplaint`, `updateComplaintStatus`) backed by local state and exposed via a small context/hook. Swapping that layer for the real HMS API later requires no component changes.

## Implementation guardrails

- Smallest change that satisfies the requirement; no restructuring or renaming once implementation starts.
- No new dependencies unless genuinely required; use the existing shadcn primitives rather than custom rebuilds.
- Consistent visuals across roles, with information density adapted per role.
- No simulated backend behaviour — mock data is clearly labelled prototype data in `src/data/*.ts`, and the service layer is transparently local.
- Build only what this plan lists. Priority order: usability, responsive behaviour, visual consistency, accessibility, portability, then polish.

## Authentication UI (mock only)

Frontend-only. No real auth, JWT, hashing, email, or API — a replaceable mock layer the real HMS auth can later swap out.

### Entry

`/login` replaces the role picker as the prototype entry (the picker remains reachable as a small "prototype role switcher" for testing). One shared auth shell — same card, typography, tokens, theme toggle — with a role selector (Student / Staff / Warden / Hostel Incharge) that switches the flow, not the design.

### Staff / Warden / Incharge — email + password

One reusable `EmailPasswordForm`: email, password with show/hide toggle, labelled inputs, Sign In. Validation, loading, and an "Incorrect email or password." error state. On success: Staff → `/staff`, Warden → `/warden`, Incharge → a plain placeholder screen stating the existing HOIDSS dashboard lives in the real HMS (nothing built or redesigned here).

### Student — email + OTP

- Email step: domain check for `@ms.pict.edu`, else "Please use your college email address."
- OTP step: shows the verified email, a mobile-friendly 6-digit input (numeric keyboard, paste support), Verify, Resend with countdown cooldown, Change email, plus invalid ("That code is incorrect. Please try again.") and expired ("Your code has expired. Request a new one.") states. Any 6-digit code verifies in the mock, except a reserved wrong/expired code used to demo those states.
- After verification the mock service looks the email up in mock student data: existing → straight to `/student`; new → registration.

### New student registration

Short, mobile-friendly, with a `Email → Verify → Details → Done` progress indicator. Verified email shown read-only with a "✓ Email verified" line. Fields: Full Name, PRN, Branch, Joining Year, Roll Number, Class/Division, Academic Year, Room Number — with Branch and Joining Year derived from the PRN where it parses, and validation messages per field. Success → `/student`.

### Auth layer

`src/services/auth.ts` + a small `AuthProvider` context exposing `currentUser`, `role`, `isAuthenticated`, `login`, `sendOtp`, `verifyOtp`, `registerStudent`, `logout`. Student profile records (including the sample Antariksh Rajesh Kothari / f24ce307 / CE / 2024 / Room 204) live in `src/data/*.ts`, never inside components. Dashboard components stay auth-unaware — they receive data via props/hooks; only route/layout files read the auth context.

### Logout

A Sign Out action in each role's chrome (sidebar footer on desktop, profile screen on mobile) clears mock state and returns to `/login`.

Both themes and all six widths apply to login, OTP, and registration screens; no social login, password reset, or MFA beyond the student OTP flow.
