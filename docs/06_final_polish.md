# Task 06: Final Polish & Real Data Integration

**Objective**: Replace remaining mock data with real Supabase data and prepare the project for deployment.

## 1. Real Data Integration
- [x] **Study List Page (`src/app/study/page.tsx`)**:
  - Replace `studies` mock data with `supabase.from('studies').select(...)`.
  - Implement "All", "Recruiting" (status='active'), and "My Studies" (joined studies) filters.
  - Fix type errors between mock types and database types.

## 2. Deployment Preparation
- [x] **Documentation**:
  - Create `README_DEPLOY.md` with instructions for:
    - Database Migrations (`supabase db push`).
    - Edge Functions (`supabase functions deploy`).
    - Environment Variables (`.env.local`).
- [x] **Cleanup**:
  - Review and remove unused mock data or files.
