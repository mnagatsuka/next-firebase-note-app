# Home (Latest Notes)

## 1. Page Overview

### Description
- Simple landing page showcasing the latest public notes where anyone can browse recently published content without authentication.
- Designed with a responsive, mobile-first approach.
- Features touch-friendly interactions and enhanced keyboard support for desktop.
- **Server-Side Rendering (SSR)** for SEO optimization.
- Dark mode only in phase 1 - no light mode theme switching available.

### URL
- `/` (root path)

### Access
- Public - no authentication required.
- Available to all visitors (anonymous and authenticated users).

## 2. Layout and Structure

This page is composed of the following components. For component details, see the **Storybook** and individual component specs.

### Primary Components
- `Header` (top navigation with optional user actions)
- `LatestNotesSection` (chronological list of recently published notes)
- `Footer` (site information and navigation links)

### Responsive Behavior
- The layout is mobile-first and fills the screen width by default.
- On screens 768px and wider (the `md` breakpoint), the layout transitions to a centered container with max-width constraints.
- Header remains sticky at the top for easy navigation.
- Note cards arrange in responsive grid (1 column mobile, 2-3 columns tablet/desktop).

## 3. Actions and Interactions

This section describes the primary user actions. They are consistent across mobile and desktop, with differences only in input method (tap vs. click).

### Browse Latest Notes

#### Trigger
- Page loads showing the latest notes section.

#### Behavior
1. Server-side fetches recent notes using `GET /notes?sort=latest`.
2. Implements infinite scroll or pagination for additional notes.
3. Loading indicators appear during fetch operations.

#### Component Reference
- `LatestNotesSection`
- `NoteCard`


### Navigate to Note Detail

#### Trigger
- User taps/clicks on any note card or note title.

#### Behavior
1. Client-side navigation to `/notes/{id}`.
2. Preserves scroll position when user returns using browser back button.

#### Component Reference
- `NoteCard`

### Access Personal Notebook

#### Trigger
- User clicks "My Notebook" button in header (appears after anonymous auth).

#### Behavior
1. If no Firebase Auth session exists, silently calls `signInAnonymously()` in background.
2. Firebase ID token is exchanged for session cookie via `POST /auth/anonymous`.
   - **Database Operation**: Anonymous user data is stored in DB upon first authentication
3. Redirects to `/me` (My Notebook page) after authentication completes.
4. Loading state shown during authentication process.

#### Component Reference
- `Header`

## 4. Data Requirements

This section outlines the API endpoints this page interacts with. For complete request and response schemas, refer to the **OpenAPI spec**.

### `GET /notes`

#### Description
- Fetches paginated list of latest public notes in chronological order.
- No authentication required - publicly accessible endpoint.

#### Query Params
- `sort` (string, default `latest`): Sort order (latest only)
- `page` (number, default `1`): Page number for pagination
- `limit` (number, default `12`): Number of notes per page

#### API Spec Reference
- See the `getNotes` endpoint in the [OpenAPI spec](../api/openapi.yml).

## 5. State & Visibility Rules

Describe how the page's appearance or behavior changes based on application state or data fetching.

### Authentication State
- Page is fully accessible without authentication.
- "My Notebook" button in header only appears after user has been anonymously authenticated.
- All public content and interactions work immediately.

### Loading State
- During initial SSR, skeleton loaders are not needed as content is pre-rendered.
- Infinite scroll loading shows loading indicators at the bottom of note lists.

### Empty State
- When no notes are available, show "No notes published yet" message with encouragement for users to create content.

### Error State
- Network errors during note loading display toast notifications.
- Fallback to cached content when possible.
- Retry buttons provided for failed data fetching operations.
- SSR errors fall back to client-side rendering with appropriate error boundaries.