<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: None
- Added sections:
  - Principle VI: Design System Adherence
- Removed sections: None.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (No change needed)
  - ✅ .specify/templates/spec-template.md (No change needed)
  - ✅ .specify/templates/tasks-template.md (No change needed)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Determine the official project ratification date.
-->
# GrowGreen Constitution

## Core Principles

### I. Mobile-First Design
This is a mobile-first application. All features and UI MUST be designed and implemented with a primary focus on screen widths between 390px and 430px. Desktop views should be functional but secondary, presenting a clean, centered mobile layout.

### II. Testability and Type-Safety
All business-critical logic, especially for ranking, penalties, and GPS verification, MUST be implemented with clean, type-safe TypeScript code. ESLint rules are enforced to maintain code quality. While full TDD is not mandated, new complex logic should be accompanied by unit tests.

### III. Component-Based Architecture
The application MUST follow a structured, component-based architecture. Reusable UI elements are placed in `src/components/ui`, layout components in `src/components/layout`, and custom hooks in `src/hooks` to promote code reuse and maintainability.

### IV. Data-Driven and Secure
The application's state is centered around a well-defined database schema in Supabase. All database tables MUST have Row Level Security (RLS) enabled and appropriately configured. Data integrity and security are non-negotiable.

### V. Real-time and Responsive Interaction
The user experience should be highly interactive and responsive. Real-time features, like the chat system, MUST provide instant feedback. UI transitions should be smooth and intuitive to enhance the user's sense of a native application.

### VI. Design System Adherence
All UI/UX implementation and modifications MUST strictly adhere to the project's established design system. The single source of truth for design tokens, components, and patterns is `docs/design_system.md`. Any deviation or addition must be proposed and ratified within the design system document before implementation.

## Technology Stack & Architecture

The project is built on a prescribed technology stack. Adherence to this stack is mandatory to ensure consistency and maintainability.
- **Frontend/Backend Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend-as-a-Service**: Supabase (Auth, Database, Realtime, Storage)
- **Deployment**: Vercel

## Development Workflow

Development MUST follow a structured workflow to ensure quality and predictability.
1. **Schema First**: Define or update database schemas and security rules in Supabase before implementing features.
2. **Component-Driven**: Build features by composing reusable components.
3. **Server Logic**: Use Next.js Server Actions or API Routes for all backend and business logic.
4. **Automation**: Use automated jobs (e.g., Supabase Edge Functions, Cron Jobs) for periodic tasks like calculating penalties.

## Governance

This Constitution is the single source of truth for project principles and standards. All code contributions and reviews MUST verify compliance with this document. Any deviation requires a formal amendment to the constitution.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): Determine the official project ratification date. | **Last Amended**: 2026-01-14
