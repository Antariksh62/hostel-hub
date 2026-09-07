# Hostel Hub

I want to design a completely modern, minimal and professional frontend UI for an existing Hostel Management System.

This is a college hostel management application with three main user roles:

STUDENT

STAFF

WARDEN

There is also an existing INCHARGE / HEAD WARDEN HOIDSS decision-support dashboard elsewhere in the project.

IMPORTANT:
The new Student, Staff and Warden interfaces should NOT copy the HOIDSS dashboard.

HOIDSS is a specialized management intelligence interface.

The new interfaces should share the same overall design language but have simpler, role-specific experiences.

This is currently a FRONTEND UI PROTOTYPE.

Do NOT create a backend.
Do NOT create authentication logic.
Do NOT create database models.
Do NOT create API integrations.

Use realistic mock data for the prototype.

The final UI will later be integrated into an existing React + Vite Hostel Management System.

==================================================
CORE DESIGN DIRECTION

Create a modern SaaS-quality interface.

The design should feel:

modern

minimal

clean

professional

calm

intuitive

fast

approachable

polished

Think modern productivity/SaaS software rather than a traditional college admin dashboard.

Prioritize:

excellent spacing

strong visual hierarchy

readable typography

clear navigation

simple interactions

meaningful information

whitespace

accessibility

Avoid:

excessive cards

excessive statistics

giant dashboards

unnecessary charts

excessive gradients

glowing effects

excessive glassmorphism

excessive shadows

excessive animations

decorative elements that don't serve a purpose

unnecessarily complicated navigation

The interface should look impressive because it is well designed, NOT because it contains lots of visual effects.

==================================================
SHARED DESIGN SYSTEM

All three roles should feel like the same product.

Create a consistent design system for:

typography

colors

spacing

buttons

inputs

cards

badges

dialogs

drawers

navigation

tables

forms

empty states

loading states

error states

Use a restrained palette:

neutral white/light gray backgrounds

dark charcoal primary text

muted secondary text

subtle borders

one primary blue/accent color

green for resolved/success

amber for pending/attention

red ONLY for genuinely critical states

Use rounded corners moderately.

Do not make everything look like a floating card.

==================================================
RESPONSIVE DESIGN — CRITICAL

This must be a genuinely responsive web application.

Do NOT design desktop first and simply shrink it for mobile.

Design intentionally for:

small phones

large phones

tablets

laptops

desktops

large monitors

Approximate test widths:

360px

390px

768px

1024px

1280px

1440px+

There must be:

no horizontal scrolling

no clipped content

no overlapping elements

no unreadable text

no broken navigation

no buttons extending outside the viewport

no desktop-only interaction required on mobile

Mobile

Use compact mobile navigation or bottom navigation where appropriate.

Do not force a desktop sidebar onto phones.

Cards should stack naturally.

Tables should become mobile-friendly lists/cards where necessary.

Forms should use available width.

Buttons must be comfortable to tap.

Use appropriately sized touch targets.

Modals/drawers must work correctly on small screens.

Important actions should remain easily accessible.

Use progressive disclosure instead of showing everything at once.

Tablet

Use the extra space intelligently.

Do not simply stretch the mobile layout.

Use two-column layouts when they genuinely improve usability.

Laptop/Desktop

Use the available space without making content excessively wide.

Maintain readable maximum content widths.

Use side navigation where appropriate.

Use multi-column layouts only when useful.

Maintain generous whitespace.

==================================================
ROLE 1 — STUDENT

The Student experience should answer:

"What do I need to do?"

"What's happening with my complaints?"

"How do I report a problem?"

Students will likely use this primarily from their phones.

Therefore the Student experience should be mobile-first.

Student Navigation

Home

My Complaints

Room

Profile

Primary action:

"Report a Problem"

Student Home

Show:

personalized greeting

room number

floor

current complaint summary

prominent Report a Problem action

recent complaints

quick actions

Example:

Good morning

Room 204
Floor 2

[ Report a Problem ]

My Complaints

Water leakage — In Progress
Fan not working — Resolved

Quick Actions

[New Complaint]
[My Complaints]
[Room Information]

Do NOT overwhelm students with analytics.

Report a Problem

Make this extremely simple.

Fields:

category

description

optional image

optional video if supported by the existing system

Room number should come from the student's profile.

Do NOT make the student manually enter their room number if the actual HMS already knows it.

After submission, show a clear success/confirmation state.

Complaint Tracking

Use a simple timeline:

Submitted
↓
Assigned
↓
In Progress
↓
Resolved

Show:

category

room

created date

current status

assigned staff where appropriate

resolution information

Do not expose unnecessary internal management information to students.

==================================================
ROLE 2 — STAFF

The Staff experience should answer:

"What work do I need to complete?"

Staff may use the system while moving around the hostel.

Therefore Staff should have an excellent mobile experience.

Staff Navigation

My Work

Assigned Complaints

History

Profile

Primary focus:

Assigned work.

Staff Home

Show:

Today's Work

8 Assigned
3 Pending
2 In Progress
3 Resolved

Then show the most relevant assigned tasks.

Each task should show:

room number

category

short description

time since assignment

status

Staff Workflow

A staff member should be able to:

Open assigned work

See the room number

See the complaint

View attached image/video

Update status

Complete the task

Keep this workflow extremely simple.

Prioritize tasks over analytics.

Do NOT give Staff the full Warden management interface.

==================================================
ROLE 3 — WARDEN

The Warden experience should answer:

"What is happening across the hostel?"

"What needs my attention?"

"Where are problems occurring?"

"How is staff performance?"

The Warden interface can be more information-dense than Student/Staff, but should still remain clean.

Warden Navigation

Overview

Complaints

Rooms

Staff

Reports

Profile

Warden Overview

Show a small number of meaningful metrics:

total rooms

occupied rooms

open complaints

in-progress complaints

resolved complaints

overdue complaints

Do NOT create 20 KPI cards.

Then show:

"Needs Attention"

Only show the most meaningful 2–3 issues.

Examples:

3 complaints overdue

Floor 2 maintenance complaints increased

Staff workload is uneven

Do not label everything as urgent.

Use:

Attention

Monitor

Informational

Use Critical only when genuinely justified.

Warden Complaints

Provide a clean searchable/filterable complaint list.

Filters:

status

category

floor

date

Allow Warden to:

view complaint

view room

view assigned staff

update/assign complaint if supported by the eventual HMS integration

inspect attached media

Warden Rooms

Use the ACTUAL hostel room structure:

Floor 1:
101–120

Floor 2:
201–220

Floor 3:
301–320

Floor 4:
401–420

Floor 5:
501–510

Total:
90 rooms

There is NO Block A/B/C/D structure.

Do NOT invent block names.

Use the first digit as the floor.

Rooms can have simple states such as:

Normal

Has Active Complaints

Multiple Complaints

Do not build a complicated heatmap for the Warden UI.

The detailed operational heatmap belongs to the separate HOIDSS Incharge/Head Warden dashboard.

Warden Staff

Show a simple workload view:

Staff member
Active assignments
In Progress
Resolved

Highlight meaningful workload imbalance.

Do NOT create a resource allocation simulator or complex scoring system.

==================================================
ROLE DIFFERENCES

The three interfaces must NOT feel like the same dashboard with different text.

They should have different mental models:

STUDENT:

"I need help and I want to track my complaint."

STAFF:

"I need to complete my assigned work."

WARDEN:

"I need to manage the hostel and resolve operational problems."

INCHARGE / HEAD WARDEN:

"I need decision-support and operational intelligence."

Share the same design system, but adapt information density and workflows to each role.

==================================================
EMPTY / LOADING / ERROR STATES

Design polished states for:

loading

empty

success

error

confirmation

Examples:

"No complaints yet."

"All caught up."

"No active assignments."

Do not fill empty states with fake information just to make the UI look populated.

==================================================
INTERACTION DESIGN

Use:

clear primary buttons

simple forms

searchable lists

compact filters

status badges

drawers/modals where useful

confirmation dialogs for destructive actions

subtle animations

Avoid unnecessary animations.

The interface should feel fast and responsive.

==================================================
ACCESSIBILITY

Ensure:

readable contrast

clear focus states

keyboard-friendly interactions

sufficiently large touch targets

labels for form inputs

meaningful button text

icons accompanied by labels when the meaning isn't obvious

Do not rely on color alone to communicate status.

==================================================
VISUAL QUALITY

The final result should feel like a real modern SaaS product that could actually be used by a college hostel.

It should NOT look like:

a generic Bootstrap dashboard

an old college portal

a template with random cards

an AI-generated UI overloaded with gradients

a Dribbble concept that is impossible to use

It should look:

SIMPLE
MODERN
PRACTICAL
PROFESSIONAL
EASY TO USE

==================================================
IMPORTANT SCOPE

This is a UI prototype.

Do not implement:

backend

authentication

database

API integration

notifications

announcements

chatbot

AI features

ML

advanced analytics

resource allocation

cost simulations

Use realistic mock data only to demonstrate the UI.

Do not modify or recreate the existing HOIDSS dashboard.

==================================================
FINAL OUTPUT

Generate a complete frontend prototype containing:

Student experience

Staff experience

Warden experience

Include enough screens to demonstrate the complete primary workflows.

Make the prototype navigable so I can switch between roles and test their experiences.

Make all major screens responsive.

Before considering the design complete, verify the experience at mobile, tablet, laptop and desktop widths.

The most important principle:

DO NOT MAKE THE DASHBOARD BIGGER.

MAKE THE EXPERIENCE BETTER.

The final product should feel like one cohesive Hostel Management System where every role immediately understands what they need to do.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ebeee489-bbcb-4897-9a4f-eab61a766fef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
