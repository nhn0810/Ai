# Task 01: Project Setup & Design System Foundation

**Objective**: Initialize the Next.js "GrowGreen" application, verify the tech stack, and establish the responsive design system foundation.

## 1. Project Initialization & Configuration
- [ ] **Initialize Next.js App**:
  - Run `npx create-next-app@latest .`
  - Select: TypeScript, ESLint, Tailwind CSS, `src/` directory, App Router, no default import alias customization (use `@/*`).
- [ ] **Clean & Structure**:
  - Remove default Next.js boilerplate in `page.tsx` and `globals.css`.
  - Create directory structure:
    - `src/components/ui` (Basic atoms)
    - `src/components/layout` (Layout-specific components)
    - `src/lib` (Utilities, Supabase client)
    - `src/hooks` (Custom hooks)
    - `src/types` (Global TS definitions)

## 2. Design System Implementation
- [ ] **Tailwind Configuration (`tailwind.config.ts`)**:
  - Define custom colors:
    - `primary`: `#84CC16` (Lime-500 equivalent)
    - `secondary`: `#14532D` (Green-900 equivalent)
    - `background`: `#FFFFFF` (Light) / `#121212` (Dark)
  - Configure `fontFamily` (e.g., Inter or Pretendard).
- [ ] **Global Styles (`globals.css`)**:
  - Define CSS variables for theming (`:root` and `.dark`).
  - Set base responsive styles (e.g., default text size, antialiasing).
- [ ] **Component Primitives**:
  - Create a reusable `Button` component (variants: primary, outline, ghost).
  - Create a `Card` component for consistent content containers.

## 3. Mobile-First Layout Architecture
- [ ] **Root Layout (`layout.tsx`)**:
  - Implement a centered container with `max-w-[430px]` to simulate a mobile app view on desktop.
  - Set a neutral background color outside the main container (e.g., `bg-gray-100`).
- [ ] **Bottom Navigation**:
  - Create `src/components/layout/BottomNavBar.tsx`.
  - Define navigation items: Home, Search/Study, Chat, Profile.
  - **Logic**: Use `usePathname()` to conditionally render `null` on hidden routes (e.g., `/chat/[id]`, `/study/create`).
  - Add smooth transition styles (transform translate-y) for showing/hiding.

## 4. Assets & Icons
- [ ] **Icon Set Integration**:
  - Install `lucide-react` or `react-icons`.
- [ ] **Visual Indicators**:
  - Create utility classes or components for:
    - "Online" status (Green dot `#22c55e`).
    - "Offline" status (Gray/Text).
