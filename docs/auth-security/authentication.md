# General-Purpose Authentication Patterns with Firebase Auth

Target: Next.js 15 (App Router, RSC) + TypeScript 5
Stack: Firebase Auth, Zustand, TanStack Query, Session Cookies

This document outlines general-purpose authentication patterns for applications with public/private content split, anonymous user support, and progressive account enhancement. The patterns are designed for Firebase Auth but principles apply to other providers.

## Core Architecture Principles

### 1. Public-First Design
- **No auth barriers**: Core functionality accessible without authentication
- **SEO optimization**: Public content is server-rendered and cacheable
- **Progressive enhancement**: Authentication adds features without blocking basic access
- **Fast initial load**: No auth checks required for primary use cases

### 2. Anonymous User Support
- **Seamless onboarding**: Users can start using private features immediately
- **Background authentication**: Anonymous sign-in happens automatically when needed
- **Data preservation**: Anonymous → regular account linking maintains all user data
- **Reduced friction**: No registration required for initial engagement

### 3. Hybrid Rendering Strategy
- **Public content**: Server-Side Rendering (SSR) for performance and SEO
- **Private content**: Client-Side Rendering (CSR) after authentication
- **Smart hydration**: Minimal JavaScript for public pages, full interactivity for private areas

## Authentication Flow Overview

```mermaid
flowchart TD
  subgraph Public_Content
    A0["User visits public pages"]
    A1["SSR: Content rendered"]
    A2["No authentication required"]
  end

  subgraph Private_Content
    B0["User accesses private features"]
    B1{"Has session?"}
    B2["Access user data"]
    B3["Auto-create anonymous user"]
    B4["Set session cookie"]
    B5["Access with anonymous identity"]
  end

  subgraph Server_Verification
    S1["Private API request"]
    S2["Verify session cookie"]
    S3{"Valid session?"}
    S4["Proceed with authenticated request"]
    S5["Return unauthorized"]
  end

  A0 --> A1 --> A2
  B0 --> B1
  B1 -- Yes --> B2 --> S1
  B1 -- No --> B3 --> B4 --> B5 --> S1
  S1 --> S2 --> S3
  S3 -- Yes --> S4
  S3 -- No --> S5
```

## Content Access Patterns

### Public Content Flow

```mermaid
flowchart TD
  subgraph Public_API
    P1["GET /api/public-resources"]
    P2["GET /api/public-resource/{id}"]
    P3["No auth headers required"]
    P4["Cacheable responses"]
  end

  P1 --> P3 --> P4
  P2 --> P3 --> P4
```

**Characteristics:**
- No authentication headers required
- Optimized for caching and CDN distribution
- Server-side rendering with static generation where possible
- Minimal JavaScript for basic interactivity

### Private Content Flow

```mermaid
flowchart TD
  subgraph Private_API
    R1["GET /api/user-resources"]
    R2["POST /api/user-resources"]
    R3{"Session exists?"}
    R4["Attach session cookie"]
    R5["Create anonymous session"]
    R6["Set session cookie"]
  end

  R1 --> R3
  R2 --> R3
  R3 -- Yes --> R4
  R3 -- No --> R5 --> R6 --> R4
```

**Characteristics:**
- Requires authentication but creates anonymous users automatically
- Client-side rendering after authentication initialization
- Session management via httpOnly cookies
- Background anonymous sign-in for seamless UX

## Authentication State Management

### Anonymous User Creation

```mermaid
flowchart TD
  subgraph AnonymousFlow
    N1["User accesses private feature"]
    N2{"Has active session?"}
    N3["Use existing session"]
    N4["signInAnonymously() background"]
    N5["Exchange token for session cookie"]
    N6["Store session, proceed with feature"]
  end

  N1 --> N2
  N2 -- Yes --> N3
  N2 -- No --> N4 --> N5 --> N6
```

**Implementation Notes:**
- Automatic and transparent to user
- No UI interruption or loading states
- Session cookie set with httpOnly, Secure, SameSite=Lax
- Anonymous flag tracked for feature gating

### Account Linking (Anonymous → Regular)

```mermaid
flowchart TD
  subgraph AccountLinking
    S1["User initiates account creation"]
    S2{"Currently anonymous?"}
    S3["Use linkWithCredential()"]
    S4["Create new regular account"]
    S5["Preserve existing user data"]
    S6["Update session with regular user"]
  end

  S1 --> S2
  S2 -- Yes --> S3 --> S5 --> S6
  S2 -- No --> S4 --> S6
```

**Key Benefits:**
- Same UID preserved during linking
- All anonymous user data remains accessible
- Seamless transition without data loss
- Feature unlock after successful linking

### Regular User Login

```mermaid
flowchart TD
  subgraph RegularLogin
    L1["User initiates login"]
    L2["Firebase authentication"]
    L3["Obtain ID token"]
    L4["Exchange for session cookie"]
    L5["Access all features"]
  end

  L1 --> L2 --> L3 --> L4 --> L5
```

**Features:**
- Email/password and OAuth providers supported
- Session restoration across devices
- Full feature access including premium features
- Cross-device synchronization

### Logout Flow

```mermaid
flowchart TD
  subgraph LogoutFlow
    O1["User initiates logout"]
    O2["Clear session cookie"]
    O3["Clear client auth state"]
    O4["Return to public view"]
    O5["Future private access = new anonymous"]
  end

  O1 --> O2 --> O3 --> O4 --> O5
```

## Feature Access Tiers

### Tier 1: Public Features (No Auth)
- Browse and read public content
- Search and filtering
- Basic social features (views, likes)
- Landing pages and marketing content

### Tier 2: Private Features (Anonymous OK)
- Personal data creation and storage
- Save/bookmark public content
- Basic personalization and preferences
- Private workspace functionality

### Tier 3: Account Features (Regular Users Only)
- Profile management and settings
- Content publishing and sharing
- Advanced features and integrations
- Cross-device synchronization
- Premium/paid features

## API Design Patterns

### Public API Design
```typescript
// No authentication required
GET /api/public-content
GET /api/public-content/{id}
GET /api/search?q={query}

// Response includes caching headers
Cache-Control: public, max-age=3600
```

### Private API Design
```typescript
// Session-based authentication
GET /api/user/content      // List user's private content
POST /api/user/content     // Create new private content
PUT /api/user/content/{id} // Update existing content
DELETE /api/user/content/{id} // Delete content

// Headers: Cookie: __session=<encrypted-session>
```

### Account-Only API Design
```typescript
// Requires regular (non-anonymous) user
GET /api/user/profile      // Get user profile
PUT /api/user/profile      // Update profile
POST /api/user/publish     // Publish content publicly
GET /api/user/analytics    // Access advanced features
```

## Session Management

### Cookie Configuration
```typescript
const sessionCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 14 * 24 * 60 * 60, // 14 days
  path: '/'
}
```

### Session Verification
```typescript
// Server-side session verification
async function verifySession(request: Request) {
  const sessionCookie = request.cookies['__session']
  if (!sessionCookie) return null
  
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie)
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      isAnonymous: decodedClaims.firebase?.sign_in_provider === 'anonymous'
    }
  } catch (error) {
    return null
  }
}
```

## Client State Management

### Auth Store (Zustand Example)
```typescript
interface AuthState {
  user: User | null
  isAnonymous: boolean
  authInitialized: boolean
  initializeAuth: () => Promise<void>
  signUp: (credentials: SignUpData) => Promise<void>
  signIn: (credentials: SignInData) => Promise<void>
  signOut: () => Promise<void>
}
```

### Progressive Enhancement
- Start with anonymous user for immediate functionality
- Prompt for account creation when accessing restricted features
- Show upgrade benefits without blocking current workflow
- Preserve all work when upgrading to regular account

## Security Considerations

### Content Security Policy
```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'strict-dynamic' 'nonce-{generated}';
  connect-src 'self' https://*.firebaseapp.com https://identitytoolkit.googleapis.com;
  frame-src https://vercel.live;
```

### Data Privacy
- Anonymous user data is private by default
- Clear consent flow for any public data sharing
- Graceful account deletion with data cleanup
- GDPR-compliant data export and deletion

### Authentication Bridge Endpoints
```typescript
POST /api/auth/login    // Exchange Firebase token for session cookie
POST /api/auth/logout   // Clear session cookie
GET /api/auth/session   // Verify and return session info
```

## Implementation Checklist

### Public Content
- [ ] Public pages render without authentication
- [ ] Content is server-rendered for SEO
- [ ] Caching headers configured appropriately
- [ ] Search and filtering work without login

### Anonymous User Flow
- [ ] Private areas auto-create anonymous sessions
- [ ] User data persists across browser sessions
- [ ] No blocking authentication prompts
- [ ] All core features work for anonymous users

### Account Linking
- [ ] Anonymous users can create accounts seamlessly
- [ ] `linkWithCredential` preserves existing data
- [ ] Regular users can login and access their data
- [ ] Feature unlocking works correctly after linking

### Security Implementation
- [ ] Session cookies are httpOnly and secure
- [ ] Private API endpoints verify authentication
- [ ] CSRF protection implemented
- [ ] Rate limiting on authentication endpoints

## Technology Integration

### Firebase Auth Setup
```typescript
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Development emulator support
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
}
```

### Next.js App Router Integration
- Use Server Components for public content
- Use Client Components for authenticated features
- Implement route handlers for API endpoints
- Configure middleware for security headers only

This pattern provides a flexible foundation for applications requiring seamless user onboarding with progressive authentication enhancement.