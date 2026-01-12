# Task 05: Ranking & Scoring Algorithms

**Objective**: Implement the "Dual Ranking System" to gamify user participation.

## 1. Ranking Logic
Write type-safe, accurate calculation logic for:

### A. User Rank
Formula: `(Attendance Count * 10) + (Manner Score * 2) - (No-show Count * 20)`

### B. Study Rank
Formula: `(Completed Meetings * 50) + (Avg Attendance Rate * 100)`

## 2. UI Presentation
- **Dual Tabs**: Switcher between "User Rank" and "Study Rank".
- Display logic to show sorted lists based on the calculated scores.

## 3. Deliverables
- Calculation utility functions (tested).
- Ranking Screen with Tabs.
- Database queries to fetch and aggregate these metrics efficiently.
