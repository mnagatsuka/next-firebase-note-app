# Public Note Detail

## 1. Page Overview

### Description
- Simple public note reading page that displays the full plain text content of a published note with optimal readability.
- Designed with a responsive, mobile-first approach optimized for reading.
- Features touch-friendly interactions and enhanced keyboard support for desktop.
- **Server-Side Rendering (SSR)** for SEO optimization.
- Dark mode only in phase 1 - no light mode theme switching available.

### URL
- `/notes/[id]` (e.g., `/notes/550e8400-e29b-41d4-a716-446655440000`)

### Access
- Public - no authentication required.
- Available to all visitors (anonymous and authenticated users).
- SEO-optimized with proper meta tags.

## 2. Layout and Structure

This page is composed of the following components. For component details, see the **Storybook** and individual component specs.

### Primary Components
- `Header` (minimal navigation with back/home links and optional user actions)
- `NoteHeader` (note title, author, publication date)
- `NoteContent` (plain text content with proper typography)
- `NoteMeta` (creation/update dates, reading time estimate)
- `Footer` (minimal footer with site links)

### Responsive Behavior
- The layout is mobile-first with optimal reading width constraints.
- On screens 768px and wider (the `md` breakpoint), content is centered with max-width of 680px for optimal reading.
- Header provides contextual navigation back to library.

## 3. Actions and Interactions

This section describes the primary user actions. They are consistent across mobile and desktop, with differences only in input method (tap vs. click).

### Read Note Content

#### Trigger
- Page loads showing the full note content.

#### Behavior
1. Server-side renders complete note content using `GET /notes/{id}`.
2. Plain text content is displayed with proper typography formatting.
3. Reading progress is tracked client-side for UX enhancements.

#### Component Reference
- `NoteContent`
- `NoteHeader`
- [Link to relevant Storybook entry](https://localhost:6006/?path=/story/components-notecontent)


### Navigate to Author's Notes

#### Trigger
- User taps/clicks on the author name/avatar in the note header.

#### Behavior
1. Navigates to home page.
2. Uses query parameter: `/?author={authorId}`.

#### Component Reference
- `NoteHeader`


## 4. Data Requirements

This section outlines the API endpoints this page interacts with. For complete request and response schemas, refer to the **OpenAPI spec**.

### `GET /notes/{id}`

#### Description
- Fetches complete public note data including plain text content, metadata, and author information for display.
- No authentication required - publicly accessible endpoint.
- Optimized for SEO with proper caching headers.

#### API Spec Reference
- See the `getNoteById` endpoint in the [OpenAPI spec](../api/openapi.yml).


## 5. State & Visibility Rules

Describe how the page's appearance or behavior changes based on application state or data fetching.

### Authentication State
- Page content is fully accessible without authentication.
- No authentication required for any functionality on this page.

### Loading State
- During SSR, content is pre-rendered so no loading states needed for initial content.

### Empty State
- If note is not found (404), redirect to custom 404 page with suggestions.
- If author information is missing, show note without author details.

### Error State
- Content rendering errors fall back to plain text view with error boundary.
- Network errors display appropriate error messages.

### Success State
- Simple reading experience with clean typography.