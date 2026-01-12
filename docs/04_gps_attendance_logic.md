# Task 04: GPS Attendance & Verification Logic

**Objective**: Implement the location-based attendance verification and automatic penalty system using Geolocation API and server-side validation.

## 1. Frontend Location Services
- [ ] **GPS Utility (`useGeolocation` hook)**:
  - Implement `navigator.geolocation.getCurrentPosition`.
  - Handle permissions (Prompt, Denied, Granted).
  - Calculate distance using Haversine formula (Distance between User Coords & Study Coords).
- [ ] **Check-In UI**:
  - Show "Check In" button in Chat/Detail view.
  - **State**: Disabled if distance `> 100m` OR Time is outside `±30min` window.
  - **Action**: Call API endpoint `/api/attendance/check-in`.

## 2. Backend Logic & Verification
- [ ] **API Endpoint (`/api/attendance/check-in`)**:
  - **Input**: `study_id`, `user_location` {lat, lng}.
  - **Logic**:
    - Re-verify time window (Server time).
    - Re-verify distance (Double check on server to prevent spoofing if possible, though trusting client coords is often necessary without app-attest).
    - Insert record into `attendance_logs`.
    - Trigger "System Message" into chat: "User X has checked in!".
- [ ] **Leader Override**:
  - UI: "Members List" -> Option to "Mark Attended".
  - API: Security check (Caller must be Leader). Log as "Manual Override".

## 3. Automated Penalty System (Edge Functions / Cron)
- [ ] **No-Show Detection Job**:
  - **Schedule**: Run every hour (or suitable interval).
  - **Logic**:
    - Find studies where `meeting_time + 30min` < `now`.
    - Find members with NO `attendance_logs` for this meeting.
  - **Action**:
    - Deduct 5 from `manner_score`.
    - Deduct 10 from `participation_score`.
    - Log penalty execution.
- [ ] **Database Helpers**:
  - Create functions/RPC to safely decrement scores (atomic updates).
