# Task 03: Real-time Chat System

**Objective**: Build a robust, real-time communication layer using Supabase Realtime for text and image messaging.

## 1. Data Layer & Realtime Setup
- [ ] **Database Schema**:
  - **`messages`**: `id`, `study_id`, `user_id`, `content` (text or partial JSON for system msgs), `image_url` (optional), `created_at`.
- [ ] **Storage Configuration**:
  - Create Supabase Storage bucket: `chat-images`.
  - Policy: Public read, Authenticated upload.
- [ ] **Realtime Subscriptions**:
  - Implement logic to subscribe to `INSERT` events on `messages` table filtered by `study_id`.
  - Handle optimistic UI updates for instant feedback.

## 2. Chat UI Components
- [ ] **Message List**:
  - Create `src/components/chat/MessageList.tsx`.
  - Logic: Auto-scroll to bottom on new message.
  - Render variants: "My Message" (Right aligned, Primary Color), "Other's Message" (Left aligned, Gray).
- [ ] **Input Area**:
  - Create `src/components/chat/ChatInput.tsx`.
  - Contenteditable or Textarea (auto-expanding).
  - Submit on "Enter" (Desktop) or "Send" button (Mobile).
- [ ] **Image Upload**:
  - Add "Paperclip/Image" icon.
  - Logic: Select file -> Upload to Storage -> Get Public URL -> Insert row in `messages`.

## 3. System & Usage Logic
- [ ] **System Messages**:
  - Define a standard format for system events (e.g., `{ type: 'system', event: 'join', user: ... }`).
  - **Triggers**:
    - **Join/Leave**: When a user is added/removed from `study_members`.
    - **Check-In**: When attendance is verified (from Task 04).
- [ ] **Performance Optimization**:
  - Implement infinite scroll (fetch previous 50 messages).
  - Clean up subscriptions in `useEffect` cleanup return.
