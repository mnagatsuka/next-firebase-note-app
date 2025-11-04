# Frontend - Simple Notes App

A Next.js 15 frontend application for the Simple Notes project with Firebase authentication and schema-driven development.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- Firebase project configuration

### Installation

1. Install dependencies:
```bash
cd frontend
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

3. Generate API client (if OpenAPI spec changes):
```bash
# From project root
pnpm api:fe
```
*Note: Generated API code is committed to the repository, so this step is only needed when the OpenAPI specification changes.*

4. Start development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Authentication API routes
│   ├── me/                # Private notebook page
│   ├── account/           # Account management
│   ├── notes/[id]/        # Public note detail
│   └── layout.tsx         # Root layout
├── components/
│   ├── auth/              # Authentication components
│   ├── notes/             # Note-related components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── api/               # API integration
│   ├── auth/              # Auth utilities
│   ├── firebase/          # Firebase configuration
│   └── providers/         # React providers
├── stores/                # Zustand state stores
└── types/                 # TypeScript type definitions
```

## 🛠 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm typecheck        # TypeScript type checking

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests

# API Generation
pnpm api:fe           # Generate API client from OpenAPI spec
```

### Key Features Implemented

✅ **Authentication Flow**
- Anonymous-first authentication
- Firebase Auth integration
- Account progression (anonymous → regular)
- Session cookie management

✅ **UI Components**
- shadcn/ui component library
- Responsive design with Tailwind CSS
- Dark mode support (CSS variables)
- Accessible components

✅ **State Management**
- Zustand for client state
- TanStack Query for server state
- Persistent auth state

✅ **App Router Structure**
- SSR for public pages (SEO optimized)
- CSR for private pages (auth required)
- Proper error handling (404, etc.)

✅ **Security**
- Content Security Policy headers
- Environment variable protection
- Firebase Auth token handling

### Authentication Pattern

The app follows an **anonymous-first** approach:

1. **Public Access**: Home page, note details - no auth required
2. **Anonymous Users**: Automatic creation when accessing `/me`
3. **Account Progression**: Convert anonymous → regular via email/password
4. **Data Preservation**: Anonymous user data is preserved during upgrade

### API Integration

Currently using placeholder data. Once the OpenAPI spec is complete:

1. Run `pnpm api:fe` to generate client
2. Replace placeholder functions in components
3. Generated types will provide full type safety

### Component Examples

**Note Card Component:**
```tsx
import { NoteCard } from '@/components/notes/NoteCard'

<NoteCard
  note={note}
  showActions={true}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

**Authentication:**
```tsx
import { useAuthStore } from '@/stores/authStore'

const { user, ensureAuthenticated } = useAuthStore()

// Auto-create anonymous user for private access
useEffect(() => {
  if (!user) {
    ensureAuthenticated()
  }
}, [user, ensureAuthenticated])
```

## 🧪 Testing

### Unit Testing
- Vitest for unit/integration tests
- Testing Library for component testing
- MSW for API mocking

### E2E Testing
- Playwright for end-to-end testing
- Authentication flow testing
- Cross-browser support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Environment Variables for Production
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-production-project
APP_ENV=production
```

## 📚 Documentation

- [Frontend Development Workflow](../docs/development/frontend-developing-workflow.md)
- [Authentication Implementation](../docs/auth-security/note-library-auth-implementation.md)
- [UI Navigation](../docs/ui/navigation.md)
- [Coding Standards](../docs/development/coding-standards.md)

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication with Email/Password
3. Add your domain to authorized domains
4. Copy config to `.env.local`

### Development Tools
- **Biome**: Linting and formatting
- **TypeScript**: Strict mode enabled
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible UI components

## 🎯 Next Steps

1. **Backend Integration**: Connect to actual API once available
2. **API Generation**: Run `pnpm api:fe` when OpenAPI spec is ready
3. **Firebase Setup**: Configure production Firebase project
4. **Testing**: Add comprehensive test coverage
5. **Performance**: Optimize bundle size and loading

## 🤝 Contributing

1. Follow the coding standards in `../docs/development/coding-standards.md`
2. Run `pnpm lint` and `pnpm typecheck` before committing
3. Write tests for new components and features
4. Update documentation as needed

---

Built with ❤️ using Next.js 15, TypeScript, and Firebase