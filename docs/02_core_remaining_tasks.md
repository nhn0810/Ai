# Remaining Tasks for User & Study Management

## Auth & Profile
- [x] **Auth Components**:
  - Create `src/components/auth/LoginForm.tsx` (Use `lucide-react` for icons if needed).
  - Create `src/components/auth/SignupForm.tsx`.
- [x] **User Context**:
  - Implement `useUser` hook (likely wrapping Supabase auth listener).

## Study Logic
- [x] **Enrollment Logic**:
  - Implement "Join" action for open studies.
  - Implement "Request" action for approval-based studies.
- [x] **Study Detail View**:
  - Implement `src/app/study/[id]/page.tsx` showing details, members, and actions.
- [x] **End Study Action**:
  - Implement server action to update study status.
