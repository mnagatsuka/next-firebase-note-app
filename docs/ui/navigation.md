# Navigation Flow Diagram

This document outlines the primary user flows and screen transitions within the Simple Note Application.

```mermaid
graph TD
    subgraph "Public Pages (SSR - No Auth Required)"
        A["/\nHome (Latest Notes)\n📚 Browse latest notes"] 
        B["/notes/{id}\nPublic Note Detail\n📄 Read note content"]
    end
    
    subgraph "Private Pages (CSR - Auth Required)"
        C["/me\nMy Notebook\n📝 Private notes"]
        D["/account\nAccount Profile\n⚙️ Basic profile"]
    end
    
    subgraph "Global Modals"
        E["Login Modal\n🔑 Email/password only"]
        F["SignUp Modal\n✨ Create account"]
    end
    
    subgraph "Error Pages"
        G["/404 - Not Found\n❌ Go to Home"]
    end
    
    subgraph "Authentication States"
        H[Unauthenticated\n👤 No session]
        I[Anonymous User\n👻 Firebase anonymous]
        J[Regular User\n👨‍💻 Full account]
    end

    %% Simple Public Navigation
    A -->|Click note card| B
    B -->|Browser back| A
    
    %% Public to Private Transitions
    A -->|"My Notebook" button| C
    
    %% Private Navigation
    C -->|Edit note| C
    C -->|Create note| C
    C -->|"Account" (regular users only)| D
    D -->|"My Notebook"| C
    
    %% Authentication Flows
    H -->|Visit /me| I
    I -->|"Sign Up" prompt| F
    I -->|"Log In" link| E
    E -->|Successful login| J
    F -->|Successful signup| J
    E -->|"Need account?" link| F
    F -->|"Have account?" link| E
    
    %% Error Handling
    A -->|Invalid URL| G
    B -->|Note not found| G
    C -->|Auth failure| G
    D -->|Access denied| G
    G -->|"Go to Home"| A
    
    %% State-based Access Control
    H -.->|Can access| A
    H -.->|Can access| B
    H -.->|Cannot access| C
    H -.->|Cannot access| D
    
    I -.->|Can access| A
    I -.->|Can access| B  
    I -.->|Can access| C
    I -.->|Cannot access| D
    
    J -.->|Can access| A
    J -.->|Can access| B
    J -.->|Can access| C
    J -.->|Can access| D
    
    %% Anonymous Auth Triggers
    A -.->|"My Notebook" click<br/>triggers signInAnonymously()| I

    %% Styling
    classDef publicPage fill:#e1f5fe
    classDef privatePage fill:#fff3e0  
    classDef modal fill:#f3e5f5
    classDef error fill:#ffebee
    classDef authState fill:#e8f5e8
    
    class A,B publicPage
    class C,D privatePage
    class E,F modal
    class G error
    class H,I,J authState
```

## Navigation Patterns

### 1. Anonymous-First Authentication
- **Trigger**: User attempts to access My Notebook
- **Behavior**: Silently calls `signInAnonymously()` in background
- **Result**: User gains immediate access to private note management without registration barriers

### 2. Public to Private Discovery
- **Home to Notebook**: "My Notebook" button in header
- **Seamless UX**: No login prompts, authentication happens transparently

### 3. Account Progression
- **Anonymous → Regular**: Upgrade prompts in Account page
- **Data Preservation**: Uses `linkWithCredential` to maintain same UID and all private notes
- **Benefit Unlocks**: Profile management only

## Key User Flows

### First-Time Visitor Flow
```
Home (/) → Browse latest notes → Click "My Notebook" → 
Anonymous auth (automatic) → My Notebook (/me) → 
Upgrade prompts → Sign Up → Regular account
```

### Returning User Flow  
```
Home (/) → "My Notebook" → 
Check session → Direct access (/me) OR
Anonymous auth (automatic) → My Notebook
```

### Content Discovery Flow
```
Home (/) → Note detail (/notes/{id}) → 
Browser back → Home (/)
```

## Error Recovery

### 404 Not Found
- **Triggers**: Invalid URLs, deleted notes, access to private resources
- **Recovery Options**: 
  - "Go to Home" → Home (/)
- **Simple Recovery**: Single button to return to main application

### Authentication Failures
- **Anonymous Auth Failure**: Retry with user feedback
- **Regular Auth Failure**: Fallback to anonymous mode or re-authentication
- **Access Denied**: Clear messaging with upgrade path to regular account

## State Management Integration

### Global State (Zustand)
- `auth.status`: 'unauthenticated' | 'anonymous' | 'regular'  
- `auth.user`: User profile data and permissions
- `modal.loginOpen`: Controls login modal visibility
- `modal.signupOpen`: Controls signup modal visibility

### Route Protection
- **Public Routes** (`/`, `/notes/{id}`): Always accessible
- **Private Routes** (`/me`): Require authentication (anonymous or regular)
- **Restricted Routes** (`/account`): Require regular user account

### Navigation Guards
- **Anonymous Auth Trigger**: Automatic for private route access
- **Regular Auth Required**: Prompts for account creation/login
- **Graceful Degradation**: Always provide path forward, never dead ends

## API Integration Points

### Navigation-Triggered API Calls
- **Home Page Load**: `GET /notes` (latest only)
- **Note Detail**: `GET /notes/{id}`
- **My Notebook**: `GET /me/notes` (requires auth)
- **Account Access**: `GET /me` (regular users only)

### Authentication API Bridge
- **Anonymous Login**: Firebase `signInAnonymously()` → `POST /auth/login`
- **Regular Signup**: Firebase `createUserWithEmailAndPassword()` → `POST /auth/signup`
- **Account Linking**: Firebase `linkWithCredential()` → `PATCH /me`