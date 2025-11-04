# Account Profile

## 1. Page Overview

### Description
- Simple user profile management page for regular (non-anonymous) users to manage their basic profile information.
- Designed with a responsive, mobile-first approach optimized for profile editing workflows.
- Features touch-friendly interactions and enhanced keyboard support for desktop.
- **Client-Side Rendering (CSR)** for real-time interactivity and personalized profile management.
- Dark mode only in phase 1 - no light mode theme switching available.

### URL
- `/account` (user profile management)

### Access
- Regular users only (not available to anonymous users).
- Requires user to have completed sign-up process and linked credentials.
- Anonymous users attempting to access this page are prompted to create regular account.

## 2. Layout and Structure

This page is composed of the following components. For component details, see the **Storybook** and individual component specs.

### Primary Components
- `AccountHeader` (user profile summary with upgrade prompt for anonymous users)
- `ProfileSection` (display name, avatar, email management)
- `UpgradePrompt` (for anonymous users to convert to regular accounts)

### Responsive Behavior
- The layout is mobile-first with simple single-column interface.
- On screens 768px and wider (the `md` breakpoint), layout uses centered content with comfortable spacing.
- Account header provides context and upgrade prompts.
- Profile form sections stack vertically with clear separation.

## 3. Actions and Interactions

This section describes the primary user actions. They are consistent across mobile and desktop, with differences only in input method (tap vs. click).

### View Account Profile

#### Trigger
- Page loads showing current user profile information.

#### Behavior
1. Client-side authenticates regular user (redirects anonymous users to upgrade prompt).
2. Fetches user profile via `GET /me`.
3. Displays current profile information with edit capabilities.
4. Shows account creation date and usage statistics.

#### Component Reference
- `AccountHeader`
- `ProfileSection`
- [Link to relevant Storybook entry](https://localhost:6006/?path=/story/components-profilesection)

### Update Profile Information

#### Trigger
- User edits profile fields and saves changes.

#### Behavior
1. Validates form data client-side before submission.
2. Updates profile via `PATCH /me` with changed fields only.
   - **Database Operation**: User data is updated in DB with new profile information
3. Shows loading state during update operation.
4. Provides success/error feedback with appropriate messaging.
5. Updates header display immediately on success.

#### Component Reference
- `ProfileSection`
- `FormField`


### Upgrade from Anonymous Account

#### Trigger
- Anonymous user clicks upgrade prompt or tries to access restricted features.

#### Behavior
1. Opens account creation flow while preserving existing data.
2. Uses Firebase `linkWithCredential` to maintain same UID.
3. Calls `POST /auth/promote` to handle database update.
   - **Database Operation**: User data is updated in DB (anonymous → regular)
4. Collects email and display name for regular account.
5. Preserves all existing private notes and data.
6. Redirects to account page upon successful upgrade.

#### Component Reference
- `UpgradePrompt`
- `SignUpModal`


## 4. Data Requirements

This section outlines the API endpoints this page interacts with. For complete request and response schemas, refer to the **OpenAPI spec**.

### `GET /me`

#### Description
- Fetches complete user profile information including settings and statistics.
- Requires regular user authentication (not available to anonymous users).
- Returns account status, preferences, and usage metrics.

#### API Spec Reference
- See the `getUserProfile` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `POST /auth/promote`

#### Description
- Handles anonymous-to-regular account promotion during upgrade flow.
- Called after successful Firebase `linkWithCredential()` for anonymous users.
- **Database Operation**: Updates existing anonymous user data in DB (anonymous → regular)
- Preserves all existing notes and data under same UID.

#### API Spec Reference
- See the `promoteAnonymousUser` endpoint in the [OpenAPI spec](../api/openapi.yml).

### `PATCH /me`

#### Description
- Updates user profile information including display name, email, and preferences.
- **Database Operation**: Updates existing user data in DB with new profile information
- Requires regular user authentication.
- Supports partial updates for individual setting changes.

#### API Spec Reference
- See the `updateUserProfile` endpoint in the [OpenAPI spec](../api/openapi.yml).


## 5. State & Visibility Rules

Describe how the page's appearance or behavior changes based on application state or data fetching.

### Authentication State
- Regular users see full account management interface.
  - **Database Requirement**: User data exists in DB as regular user
- Anonymous users see upgrade prompt with limited functionality preview.
  - **Database State**: User data exists in DB but marked as anonymous
- Unauthenticated users are redirected to login page.
- Failed authentication shows error with retry options.

### Loading State
- During initial load, skeleton loaders show structure of profile sections.
- Form submissions show loading states on action buttons.

### Empty State
- New accounts show welcome message and profile setup guidance.
- Empty profile fields show placeholder content with helpful hints.

### Error State
- Profile update errors show field-specific validation messages.
- Network errors show offline indicator with auto-retry capability.

### Success State
- Profile updates show brief confirmation messages with subtle animation.

### Subscription State (Future Enhancement)
- Free tier users see upgrade prompts for premium features.
- Premium users see usage statistics and billing information.
- Trial users see remaining days and upgrade options.

