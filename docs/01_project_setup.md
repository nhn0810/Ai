# Task 01: Project Setup & Design System Foundation

**Objective**: Initialize the Next.js "GrowGreen" application and establish the design system and core layout structure.

## 1. Project Initialization
- **Framework**: Next.js App Router (Latest).
- **Styling**: Tailwind CSS.
- **Platform**: Verification focused on Mobile-First (Responsive width: 390px - 430px).

## 2. Design System Implementation
- **Color Palette (Minimalist Natural)**:
  - Base White: `#FFFFFF`
  - Primary Bright Lime: `#84CC16`
  - Secondary Dark Green: `#14532D`
- **Dark Mode**: Support using Tailwind `dark:` classes.
- **Visuals**:
  - **Online Indicator**: 8px Green Dot.
  - **Offline Indicator**: "Region Text" display.

## 3. Navigation & Layout
- **Component**: `BottomNavBar` (Sticky).
- **Interaction (Crucial)**:
  - The Bottom Nav must **hide** smoothly (Y-axis translate/transition) when navigating to:
    - Specific Chat Rooms.
    - "Create Study" entry form.
  - Ensure the transition is seamless to maximize screen real estate for these views.

## 4. Deliverables
- Fully configured `tailwind.config.ts`.
- Global Layout `layout.tsx` handling the mobile-frame constraints.
- `BottomNavBar` component with clear visibility logic based on current route.
