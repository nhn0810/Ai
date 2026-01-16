# Remaining Tasks for Chat System

## Chat UI Components
- [x] **Image Upload**:
  - Implement image picker and upload logic in `ChatRoom.tsx` (or extracted component).
  - Use `supbase.storage` to upload to `chat-images`.

## System & Usage Logic
- [x] **System Messages**:
  - Standardize system message format (e.g., JSON in content or specific prefix).
  - Implement triggers for Join/Leave (Attendance trigger was handled in Task 02 actions, but need to verify standardized format).
- [x] **Refactoring**:
  - Extract `MessageList` and `ChatInput` from `ChatRoom.tsx` for better maintainability as per original plan.
