# Task 04: GPS Attendance & Verification Logic

**Objective**: Implement the location-based attendance verification and automatic penalty system.

## 1. Check-in Logic
- **Geofencing**: Check-in button is enabled ONLY when User GPS is within **100m** of the Study destination.
- **Time Window**: Check-in allowed only during **±30 minutes** of the scheduled meeting time.

## 2. Exceptions & Penalties
- **Leader Override**: Provide a manual option for Leaders to mark a member as "Attended" (handling GPS errors).
- **Automated Penalty**:
  - Trigger: If a member fails to check in by the end of the time window (+30m).
  - Action: **Deduct 5 Manner Points** AND **Deduct 10 Participation Points**.

## 3. Deliverables
- Geolocation utility (frontend).
- Logic for Time Window validation.
- Backend Routine/Edge Function for processing "No-show" penalties.
