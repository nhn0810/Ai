# Task 02: User & Study Management Logic

**Objective**: Implement the data models and business logic for Users and Study groups.

## 1. User Logic
- **Profile Data**:
  - Display "Manner Score" and "Participation Score".
- **Initialization**:
  - New Users start with a **Manner Score of 36.5**.

## 2. Study Management Features
- **Creation Options**:
  - Enrollment Method: "Approval-based" (Leader accepts) vs "Open" (Auto-join).
- **Study Lifecycle**:
  - **End Study**: Only the designated Leader can trigger this.
  - **Post-End Authority**: Once a study is marked "Ended", the Leader gains the authority to "Delete Chat Room" (Data wipe).

## 3. Database Schema (Proposed)
Below is a suggested schema structure (e.g., for Supabase/PostgreSQL).

### Table: `users` (or `profiles`)
| Column Name | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Linked to Supabase Auth ID |
| `email` | Text | Unique | User email |
| `nickname` | Text | | Display name |
| `avatar_url` | Text | | Profile image path |
| `manner_score` | Float | Default: 36.5 | User reputation score |
| `participation_score` | Integer | Default: 0 | User activity score |
| `is_online` | Boolean | Default: false | Online status indicator |
| `created_at` | Timestamp | | Account creation time |

### Table: `studies`
| Column Name | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique Study ID |
| `leader_id` | UUID | FK | Reference to `users.id` |
| `title` | Text | | Study Name |
| `description` | Text | | Study goal/details |
| `enrollment_type` | Text/Enum | 'OPEN', 'APPROVAL' | Join method |
| `status` | Text/Enum | 'ACTIVE', 'ENDED' | Current state |
| `created_at` | Timestamp | | Creation time |

## 4. Deliverables
- Database Schema implementation (SQL migration or Prisma Schema).
- UI Screens: User Profile, Study Detail View, Create Study Form.
- Logic hooks/actions for Creating Study and Ending Study.
