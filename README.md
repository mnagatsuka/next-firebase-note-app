# next-firebase-note-app

## Directory Structure

```
.
├── docs/
│   ├── api/
│   │   ├── openapi.yml # OpenAPI specification
│   │   ├── openapi.bundled.yml
│   │   ├── paths/
│   │   ├── components/
│   │   │   ├── examples/
│   │   │   ├── parameters/
│   │   │   ├── responses/
│   │   │   └── schemas/
│   │   └── README.md
│   ├── ui/
│   │   ├── design-system.md
│   │   └── pages/
│   ├── auth/
│   │   ├── firebase-setup.md # Firebase configuration guide
│   │   └── authentication.md # Auth flow documentation
│   ├── deployment/
│   │   ├── vercel.md # Vercel deployment guide
│   │   └── environment.md # Environment variables setup
│   ├── development/
│   │   ├── getting-started.md # Local development setup
│   │   ├── coding-standards.md # Code style and conventions
│   │   └── developing-workflow.md # Development workflow based on OpenAPI and UI specifications
│   ├── architecture/
│   │   └── overview.md # System architecture
│   └── README.md # Main documentation index
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── generated/ # OpenAPI generated files
│   │   │   └── customFetch.ts # Custom fetch client fo Server and Client components
│   │   ├── auth/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── constants/
│   │   ├── design/
│   │   │   └── tokens.ts
│   │   ├── errors/
│   │   ├── firebase/
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   └── client.ts
│   │   ├── providers/
│   │   ├── stores/
│   │   └── utiless/
│   ├── stores/
│   ├── types/
│   ├── mocks/
│   │   ├── handlers.ts
│   │   ├── browser.ts
│   │   └── server.ts
│   └── middleware.ts
├── tests/
│   └── e2e/
├── public/
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── pakage.json
└── README.md # Project overview
```

## Tech Stack

For detailed technology stack information, see:
- **Frontend**: [frontend/README.md](frontend/README.md)
- **Backend**: [backend/README.md](backend/README.md)
- **Infrastructure**: [infrastructure/README.md](infrastructure/README.md)