# Task 05: Ranking & Scoring Algorithms

**Objective**: Implement the "Dual Ranking System" to gamify user participation using efficient queries and dynamic UI.

## 1. Calculation Engine (Backend/Database)
- [ ] **Scoring Logic (SQL Functions or Edge Functions)**:
  - **User Rank**: `(Attendance Count * 10) + (Manner Score * 2) - (No-show Count * 20)`
  - **Study Rank**: `(Completed Meetings * 50) + (Avg Attendance Rate * 100)`
- [ ] **Data Aggregation**:
  - Create Database View or Materialized View for `user_scores` and `study_scores` to avoid recalculating on every read.
  - Query: Join `attendance_logs`, `profiles`, and `studies`.

## 2. Ranking API
- [ ] **Endpoint (`/api/rankings`)**:
  - Parameters: `type` ('user' | 'study'), `limit` (default 50).
  - Return: List of objects `{ id, name, score, rank_change }`.
- [ ] **Optimization**:
  - Implement caching (e.g., Revalidate every 1 hour or on specific triggers).

## 3. UI Implementation
- [ ] **Ranking Screen**:
  - **Tabs**: "Top Users" vs "Top Studies".
  - **List Item Component**:
    - Display Rank # (1, 2, 3 icons).
    - Avatar/Title.
    - Score Value.
    - Status Indicator (e.g., Up/Down arrow compared to last week - *Optional*).
- [ ] **My Rank**:
  - Sticky footer or separate section showing *Current User's* specific rank if not in top list.
