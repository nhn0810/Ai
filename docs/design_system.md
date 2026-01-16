# GrowGreen Design System - "Dark & Modern"

This document outlines the design system for the GrowGreen application, based on the "Dark & Modern" concept. Its purpose is to ensure a consistent, intuitive, and high-quality user experience across the entire platform.

## 1. Design Philosophy

- **Dark First:** The primary interface is designed for a dark environment, reducing eye strain and creating a sleek, modern aesthetic.
- **High Contrast & Accessibility:** A vibrant primary color (`primary`) is used for key actions and highlights, ensuring clear calls-to-action against the dark background.
- **Mobile-First:** The layout is optimized for mobile devices with a maximum width of 430px, providing a focused, app-like experience on all screen sizes.
- **Clarity & Focus:** Clean lines, generous spacing, and a clear visual hierarchy guide the user's attention to the most important content and actions.

---

## 2. Core Elements

### 2.1. Color Palette

The color system is designed for a dark theme. Colors are named semantically to describe their function.

| Token              | Hex Code  | Usage                                                              |
| ------------------ | --------- | ------------------------------------------------------------------ |
| `primary`          | `#84CC16` | Main call-to-actions, active states, highlights, key scores.       |
| `background`       | `#121212` | The primary background color for all pages.                        |
| `surface`          | `#1E1E1E` | Background for components that sit on top of the background (e.g., Cards). |
| `onPrimary`        | `#1E1E1E` | Text or icons placed on top of `primary` elements.                 |
| `onSurface`        | `#E0E0E0` | The main text color used on `background` and `surface`.            |
| `onSurfaceVariant` | `#A0A0A0` | Secondary text color for descriptions, metadata, and disabled states. |
| `destructive`      | `#FF453A` | Used for destructive actions like deleting data or leaving a study. |

### 2.2. Typography

- **Font Family:** `Inter` is used for all text to ensure readability and a modern feel.
- **Type Scale:**
  - **H1 / Page Title:** `text-2xl font-bold` (e.g., "GrowGreen", "스터디 정보")
  - **H2 / Section Title:** `text-lg font-semibold` (e.g., "진행중인 스터디")
  - **Body (Default):** `text-base`
  - **Body (Small):** `text-sm` (e.g., component text, descriptions)
  - **Caption:** `text-xs` (e.g., navigation labels, timestamps)

### 2.3. Layout & Spacing

- **Main Container:** The application content is constrained to a `max-w-[430px]` and centered horizontally.
- **Padding:** The standard padding for page content is `p-4`.
- **Spacing:** A consistent spacing scale based on multiples of 4px is used for margins and gaps.

### 2.4. Iconography

- **Library:** `lucide-react` is the designated icon library.
- **Style:** Icons should be used in their default stroke-based style with a `stroke-width` of 2.
- **Size:**
  - `24px` for navigation and primary actions.
  - `16px` or `14px` for inline metadata icons.

---

## 3. Core Components

This section defines the reusable UI components that form the building blocks of the application.

### 3.1. Button

- **Usage:** For all interactive actions.
- **Default Style:** `bg-primary text-onPrimary rounded-lg text-sm font-bold`.
- **Variants:**
  - `default`: Primary action (e.g., "Check In").
  - `outline`: Secondary action (e.g., "스터디 종료").
  - `ghost`: Low-emphasis action, often for icons (e.g., back arrow).
  - `destructive`: For actions that delete data.

**Example:**
```tsx
import { Button } from "@/components/ui/Button";

<Button>Check In</Button>
<Button variant="outline">Edit Profile</Button>
```

### 3.2. Card

- **Usage:** To group related content and separate it from the background.
- **Style:** `bg-surface rounded-lg`. Content within a card should have its own padding (e.g., `p-4`).

**Example:**
```tsx
import { Card, CardContent } from "@/components/ui/Card";

<Card>
    <CardContent className="p-4">
        ...
    </CardContent>
</Card>
```

### 3.3. Badge

- **Usage:** To display status or short, important metadata.
- **Style:** `rounded-full px-2.5 py-0.5 text-xs font-semibold`.
- **Variants:**
  - `default`: `bg-primary text-onPrimary` (e.g., "모집중").
  - `secondary`: `bg-onSurfaceVariant/20 text-onSurfaceVariant` (e.g., "모집완료").

**Example:**
```tsx
import { Badge } from "@/components/ui/Badge";

<Badge>모집중</Badge>
<Badge variant="secondary">모집완료</Badge>
```

### 3.4. Input & Form Elements

- **Style:** `bg-surface border border-white/10 rounded-md`.
- **Focus State:** On focus, all form elements must show a `ring-2` outline in the `primary` color to ensure accessibility.
- **Labels:** Use the `Label` component for accessibility.

---

## 4. Navigation

### Bottom Navigation Bar

- **Appearance:** A translucent bar (`bg-surface/70 backdrop-blur-lg`) fixed to the bottom of the viewport.
- **Active State:** The active navigation item is indicated by `text-primary` color and a `drop-shadow` effect on the icon.
- **Behavior (Crucial Interaction):** The entire navigation bar is hidden on specific pages where focus is required, such as a chat room (`/chat/[id]`) or the create study form (`/study/create`). This is handled via `usePathname`.

**Example:**
```tsx
// In BottomNavBar.tsx
const pathname = usePathname();
const isHidden = pathname.includes('/chat/') || pathname === '/study/create';
if (isHidden) return null;
```
