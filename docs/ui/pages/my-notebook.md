# My Notebook

## 1. Page Overview

### Description
- Simple private workspace where authenticated users (anonymous and regular) can create and manage their personal collection of plain text notes.
- Designed with a responsive, mobile-first approach optimized for basic note taking.
- Features touch-friendly interactions and enhanced keyboard support for desktop.
- **Client-Side Rendering (CSR)** for real-time interactivity and personalized experience.
- Dark mode only in phase 1 - no light mode theme switching available.

### URL
- `/me` (personal notebook dashboard)

### Access
- Authenticated users only (anonymous and regular).
- Anonymous user authentication via Firebase Auth happens automatically on first visit.
- Visiting this page without session triggers `signInAnonymously()` silently in background.
- **Database Operation**: Anonymous user data is automatically stored in DB upon first authentication.

## 2. Layout and Structure

This page is composed of the following components. For component details, see the **Storybook** and individual component specs.

### Primary Components
- `DashboardHeader` (user status and create new note button)
- `NotesGrid` (responsive grid of user's private notes)
- `NoteCard` (individual note preview with edit/delete actions)
- `EmptyState` (shown when no notes exist)
- `FloatingActionButton` (quick create note button on mobile)
- `NoteEditor` (simple text editor for creating/editing notes)

### Responsive Behavior
- The layout is mobile-first and fills the screen width by default.
- On screens 768px and wider (the `md` breakpoint), layout uses simple main content structure.
- Dashboard header remains sticky for easy access to create function.
- Notes arrange in responsive grid (1 column mobile, 2-3 columns tablet, 3-4 desktop).
- Floating action button appears on mobile for quick note creation.

## 3. Actions and Interactions

This section describes the primary user actions. They are consistent across mobile and desktop, with differences only in input method (tap vs. click).

### View Personal Notes

#### Trigger
- Page loads showing user's private notes collection.

#### Behavior
1. Client-side authenticates user (anonymous if no session exists).
   - **Database Operation**: Anonymous user data is stored in DB if this is their first visit
2. Fetches user's notes using `GET /me/notes`.
3. Renders notes in grid layout with preview cards.
4. Supports infinite scroll or pagination for large collections.

#### Component Reference
- `NotesGrid`
- `NoteCard`
- [Link to relevant Storybook entry](https://localhost:6006/?path=/story/components-notesgrid)

### Create New Note

#### Trigger
- User taps/clicks "New Note" button in header or floating action button.

#### Behavior
1. Opens simple text editor in modal (mobile) or inline (desktop) mode.
2. Creates draft note via `POST /me/notes` with minimal initial data.
   - **Database Requirement**: User must already be stored in DB (automatic for anonymous users)
3. Editor provides plain text editing only.
4. Manual save updates note via `PATCH /me/notes/{id}` when user clicks save.

#### Component Reference
- `DashboardHeader`
- `FloatingActionButton`
- `NoteEditor`
- [Link to relevant Storybook entry](https://localhost:6006/?path=/story/components-noteeditor)

### Edit Existing Note

#### Trigger
- User taps/clicks on note card or edit button.

#### Behavior
1. Opens note in simple text editor with existing content loaded.
2. Supports basic note editing with plain text only.
3. Manual save updates note via `PATCH /me/notes/{id}` when user clicks save.

#### Component Reference
- `NoteCard`
- `NoteEditor`

### Delete Note

#### Trigger
- User taps/clicks delete button on note card or in editor.

#### Behavior
1. Shows confirmation dialog to prevent accidental deletion.
2. Permanently removes note via `DELETE /me/notes/{id}`.
3. Updates UI immediately with optimistic update.
4. Shows undo option for brief period after deletion.

#### Component Reference
- `NoteCard`
- `ConfirmationDialog`


## 4. Data Requirements

This section outlines the API endpoints this page interacts with. For complete request and response schemas, refer to the **OpenAPI spec**.

### `POST /auth/anonymous`

#### Description
- Exchanges Firebase anonymous ID token for secure session cookie after anonymous authentication.
- Called automatically after successful `signInAnonymously()` on first visit.
- **Database Operation**: Inserts anonymous user data in DB if this is their first authentication.
- Establishes httpOnly session cookie for subsequent private API calls.

#### API Spec Reference
- See the `authenticateAnonymous` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `GET /me/notes`

#### Description
- Fetches user's private note collection including drafts and personal creations.
- Requires anonymous user authentication via Firebase Auth.
- **Database Requirement**: User data must exist in DB (automatically created for anonymous users)
- Supports basic pagination for large collections.

#### Query Params
- `page` (number, default `1`): Page number for pagination
- `limit` (number, default `20`): Number of notes per page

#### API Spec Reference
- See the `getMyNotes` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `POST /me/notes`

#### Description
- Creates a new private note draft with plain text content.
- Requires anonymous user authentication via Firebase Auth.
- **Database Requirement**: User data must exist in DB (automatically created for anonymous users)

#### API Spec Reference
- See the `createMyNote` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `PATCH /me/notes/{id}`

#### Description
- Updates existing private note content with plain text.
- Requires anonymous user authentication via Firebase Auth.
- Supports manual save operations.

#### API Spec Reference
- See the `updateMyNote` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `DELETE /me/notes/{id}`

#### Description
- Permanently deletes a private note from user's collection.
- Requires anonymous user authentication via Firebase Auth.
- Cannot be undone once confirmed.

#### API Spec Reference
- See the `deleteMyNote` endpoint in the [OpenAPI spec](../api/openapi.yml).

## 5. State & Visibility Rules

Describe how the page's appearance or behavior changes based on application state or data fetching.

### Authentication State
- Anonymous user authentication happens automatically on first visit.
  - **Database Operation**: Anonymous user data is stored in DB during first authentication
- All features are available immediately after anonymous auth and database storage completes.
- Page redirects to login if authentication fails (rare edge case).
- User indicator shows "Anonymous User" status in header.

### Loading State
- During initial auth and data fetch, skeleton loaders mimic the notes grid layout.
- Create/edit actions show loading spinners during API operations.
- Manual save shows loading indicator on save button.

### Empty State
- When user has no notes, shows welcome message with "Create your first note" call-to-action.

### Error State
- Authentication failures show error message with retry option.
- API errors during CRUD operations display toast notifications.
- Network connectivity issues show offline indicator with retry capabilities.
- Manual save failures show error message with retry option.

### Success State
- Successfully created notes appear at top of collection with highlight animation.
- Manual save shows brief "Saved" confirmation message.
- Successful deletion shows "Note deleted" with undo option.

### Collaboration State (Future Enhancement)
- Real-time indicators for notes being edited by other devices.
- Conflict resolution UI for simultaneous edits from multiple sessions.
- Sync status indicators for offline/online editing capabilities.