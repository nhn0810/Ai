**Role:** Senior Full-stack Developer
**Task:** Build a Mobile-First Web App "GrowGreen" for Study Recruitment with GPS Verification and Ranking.

**Design System (Minimalist Natural):**
- Colors: White(#FFFFFF), Bright Lime(#84CC16), Dark Green(#14532D).
- Dark Mode: Implement using Tailwind's `dark:` classes.
- Indicators: 8px Green Dot for "Online", "Region Text" for "Offline".
- Navigation: A sticky bottom Nav Bar. 
  **Crucial Interaction:** Hide the bottom Nav using a smooth transition (Y-axis translate) when the user enters a specific Chat Room or the "Create Study" form.

**Feature Logic & Modules:**

1. **User Reputation:**
   - Profile shows "Manner Score" and "Participation Score".
   - Start with Manner Score: 36.5.

2. **Dual Ranking System:**
   - **User Rank Tab:** Calculate via `(Attendance * 10) + (Manner * 2) - (No-show * 20)`.
   - **Study Rank Tab:** Calculate via `(Completed Meetings * 50) + (Avg Attendance * 100)`.

3. **GPS Attendance & Penalty:**
   - Geofencing: Check-in available only within 100m of the destination.
   - Time Window: Button active only during ±30 minutes of the scheduled time.
   - **Leader Override:** Leaders can manually mark members as "Attended".
   - **No-show Penalty:** Auto-deduct 5 Manner points and 10 Participation points if check-in is not done by the end of the time window.

4. **Study Management:**
   - Enrollment: Choice between "Approval-based" and "Open".
   - Study Closure: Only the Leader can "End Study". Once ended, the Leader gains the "Delete Chat Room" authority (Permanent data wipe).

5. **Real-time Chat:**
   - Supabase Realtime for 1:1 and Group chats.
   - Image upload support to Storage.
   - System auto-messages for join/leave/check-in events.

**Development Instructions:**
- Prioritize Mobile-First responsiveness (390px - 430px width).
- Ensure high performance and SEO-friendly routing using Next.js App Router.
- Write clean, type-safe code for all ranking and penalty logic.