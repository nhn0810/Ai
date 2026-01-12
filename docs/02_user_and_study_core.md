# Task 02: User & Study Management Logic

**Objective**: Implement the data models, authentication flow, and core business logic for Users and Study groups.

## 1. Database Schema & Migration (Supabase)
- [ ] **Define Tables (`src/lib/database.types.ts` or SQL)**:
  - **`profiles` (Users)**:
    - `id` (references auth.users), `email`, `nickname`, `avatar_url`, `manner_score` (default 36.5), `participation_score`, `is_online`.
  - **`studies`**:
    - `id`, `leader_id`, `title`, `description`, `enrollment_type` (open/approval), `status` (active/ended), timestamps.
  - **`study_members`**:
    - `study_id`, `user_id`, `role` (leader/member), `joined_at`.
- [ ] **Data Security (RLS)**:
  - Enable Row Level Security on all tables.
  - Create policies: "Public read profiles", "Users update own profile", "Members read study details".

## 2. User Authentication & Profile Logic
- [ ] **Auth Integration**:
  - Configure Supabase Auth (Email/Password or OAuth).
  - Create `src/components/auth/LoginForm.tsx` and `SignupForm.tsx`.
- [ ] **Profile Management**:
  - Implement **User Context** (`useUser` hook) to globally access current user state.
  - Create `src/app/profile/page.tsx` to display Manner Score, Participation Score, and basic info.
  - **Trigger**: Ensure new user creation automatically creates a `profiles` row with `manner_score = 36.5`.

## 3. Study Management Features (CRUD)
- [ ] **Study Creation Flow**:
  - Create `src/app/study/create/page.tsx`.
  - Implement form with Zod validation (Title min length, etc.).
  - **Action**: `createStudy` server action or API route.
- [ ] **Study Discovery (List View)**:
  - Create `src/app/study/page.tsx` (Grid/List content).
  - Implement filters: "All", "Recruiting", "My Studies".
- [ ] **Enrollment Logic**:
  - **Open Study**: Click "Join" -> Immediately add to `study_members`.
  - **Approval Study**: Click "Request" -> Create pending request (requires new table or status in `study_members`).

## 4. Study Lifecycle Control
- [ ] **Study Detail View**:
  - Show Leader controls only if `current_user.id === study.leader_id`.
  - Display member list.
- [ ] **End Study Action**:
  - **Button**: "End Study" (Leader only).
  - **Logic**: Update `studies.status` to 'ENDED'.
  - **Post-End**: Enable "Delete Chat Room" button for Leader.
