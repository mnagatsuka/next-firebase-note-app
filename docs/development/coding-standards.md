# Coding Standards Documentation

This document establishes coding standards for our Next.js application with TypeScript, tailored to our specific tech stack and project structure.

## 1. General Standards

### Code Formatting and Style Rules
- Use Biome as the primary linter and formatter for consistent code style
- Configure automatic formatting on save in your editor
- Follow 2-space indentation consistently across all file types
- Maintain a maximum line length of 100 characters for readability
- Use single quotes for string literals and prefer template literals for complex strings
- Include trailing commas in multi-line objects, arrays, and function parameters
- Use semicolons consistently at the end of statements

### Naming Conventions
- **Files**: Use kebab-case for component files (`user-profile.tsx`) and camelCase for utility files (`apiClient.ts`)
- **Directories**: Use kebab-case for folder names (`user-management/`, `api-client/`)
- **Variables and Functions**: Use camelCase (`getUserData`, `isLoggedIn`)
- **Constants**: Use SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Components**: Use PascalCase (`UserProfile`, `MessageList`)
- **Types and Interfaces**: Use PascalCase with descriptive names (`UserProfile`, `ApiResponse`)

### Comment and Documentation Standards
- Write clear, concise comments that explain "why" rather than "what"
- Use JSDoc comments for all public functions and components
- Document complex business logic with inline comments
- Use TODO comments with assignee information when appropriate
- Keep comments up-to-date with code changes
- Avoid obvious comments that duplicate what the code already expresses

### Import/Export Organization
- Group imports in the following order: external libraries, internal utilities, components, types
- Use absolute imports with path aliases defined in the project configuration
- Prefer named exports for utilities and default exports for React components
- Keep imports organized alphabetically within each group
- Avoid deep relative imports; use path aliases instead

## 2. TypeScript Standards

### Type Definitions and Interfaces
- Define explicit types for all function parameters, return values, and object structures
- Create interfaces for complex data structures and API responses
- Use the `interface` keyword for object shapes and `type` for unions, primitives, and computed types
- Store shared types in the `src/types/` directory for reusability
- Use descriptive names that clearly indicate the purpose and context

### Generic Usage Patterns
- Use generics to create reusable, type-safe functions and components
- Provide meaningful constraint names and avoid single-letter generics when context helps
- Set reasonable defaults for generic parameters when appropriate
- Keep generic complexity manageable; prefer explicit types when generics don't add value

### Strict Mode Configurations
- Enable TypeScript strict mode for all projects to catch common errors early
- Use `noImplicitAny` to ensure all values have explicit types
- Enable `strictNullChecks` to handle null and undefined values safely
- Configure `noUnusedLocals` and `noUnusedParameters` to keep code clean

### Type Assertion Guidelines
- Prefer type guards and type narrowing over type assertions when possible
- Use type assertions sparingly and document the reasoning when necessary
- Avoid the `any` type; use `unknown` for truly dynamic content
- Use `as const` for literal types and immutable data structures

## 3. React & Next.js Standards

### Component Structure and Patterns
- Use functional components with React hooks as the standard approach
- Keep components focused on a single responsibility
- Limit component size to approximately 150-200 lines; split larger components
- Use composition patterns to build complex UI from simpler components
- Implement proper prop interfaces for all components

### Hook Usage and Custom Hooks
- Follow the Rules of Hooks strictly to ensure predictable behavior
- Extract reusable stateful logic into custom hooks with the `use` prefix
- Use `useCallback` and `useMemo` judiciously for performance optimization
- Prefer `useReducer` for complex state management scenarios
- Keep hook dependencies arrays accurate and complete

### Server/Client Component Guidelines
- Use Server Components as the default choice in the App Router architecture
- Mark Client Components explicitly with the `"use client"` directive
- Minimize the boundaries between server and client components
- Pass serializable data between server and client components
- Use Server Actions for form handling and server-side operations

### Performance Optimization Practices
- Implement code splitting using React.lazy and Suspense for route-based splitting
- Use the Next.js Image component for optimized image loading
- Implement proper loading states and skeleton screens for better user experience
- Monitor bundle size and implement tree shaking for unused code elimination

## 4. Project Structure Standards

### File and Folder Organization
- Follow the established directory structure with `src/app/`, `src/components/`, `src/lib/`, etc.
- Group related files together in feature-based folders when appropriate
- Use the `src/lib/` directory for shared utilities, configurations, and business logic
- Store reusable UI components in `src/components/` with clear categorization
- Keep page-specific components close to their respective routes in the App Router

### Module Organization Patterns
- Create one primary export per file for better tree shaking and debugging
- Use barrel exports (`index.ts`) to simplify imports for related modules
- Separate concerns clearly: UI components, business logic, data access, and types
- Co-locate test files with their corresponding source files when practical

### Asset and Resource Management
- Store static assets in the `public/` directory with organized subdirectories
- Use SVG format for icons and simple graphics for better scalability
- Optimize images before adding them to the project
- Implement lazy loading for non-critical assets

### Configuration File Standards
- Use environment variables for configuration that changes between environments
- Store environment variables in `.env.local` for development
- Document all required environment variables in `.env.example`
- Keep sensitive configuration out of the codebase

## 5. Quality Standards

### Code Review Requirements
- All code changes must go through pull request review before merging
- Require at least one approval from a team member familiar with the affected code
- Address all review comments and discussions before merging
- Use descriptive pull request titles and descriptions

### Error Handling Patterns
- Implement comprehensive error boundaries for React component error handling
- Use proper try-catch blocks for asynchronous operations and external API calls
- Provide meaningful error messages that help users understand what went wrong
- Log errors with sufficient context for debugging and monitoring

### Linting and Formatting Rules
- Configure Biome with project-specific rules and run it on every file change
- Set up pre-commit hooks to ensure code quality standards are met
- Address all linting errors and warnings before committing code
- Maintain consistent formatting across the entire codebase

### Performance and Accessibility Guidelines
- Target Lighthouse scores of 90+ for Performance and 95+ for Accessibility
- Test with real devices and network conditions, not just developer machines
- Implement proper semantic HTML and ARIA attributes for screen reader support
- Ensure all interactive elements are keyboard accessible

## 6. Accessibility (A11y) Standards

### Focus Management
- Provide skip links to main content for keyboard users
- Maintain logical DOM order: Header → Banner → Main Content → Call-to-Action
- Avoid using `tabIndex` values greater than 0 as they disrupt natural tab order
- Implement proper focus indicators for all interactive elements

### ARIA Roles and Labels
- Use semantic HTML elements as the foundation for accessibility
- Add explicit ARIA roles when semantic HTML is insufficient: `role="banner"`, `role="main"`
- Provide descriptive `aria-label` attributes for icon-only buttons and complex UI elements
- Use `aria-describedby` and `aria-labelledby` to create relationships between elements

### Keyboard Navigation
- Use native interactive elements (`button`, `a`, `input`) which provide keyboard support automatically
- Ensure all functionality is available through keyboard navigation
- Implement custom keyboard handlers only when using non-standard interactive elements
- Test keyboard navigation flow to ensure it follows a logical sequence

## 7. Library-Specific Standards

### State Management (Zustand)
- Keep state stores focused on specific domains or features
- Use shallow comparison for state updates to optimize re-renders
- Implement proper TypeScript typing for all store actions and state

### Data Fetching (TanStack Query)
- Use consistent query key patterns for cache management
- Implement proper error handling and loading states for all queries
- Configure appropriate stale times and cache invalidation strategies

### Styling (Tailwind CSS)
- Follow the utility-first approach and avoid writing custom CSS when possible
- Use the design system tokens defined in `src/lib/design/tokens.ts`
- Group related utility classes and use component extraction for repeated patterns

### Form Handling (Zod)
- Define validation schemas close to their usage for better maintainability
- Use TypeScript inference from Zod schemas to ensure type safety
- Provide clear, user-friendly validation error messages

### Testing (Vitest, Testing Library, Playwright)
- Write tests that focus on user behavior rather than implementation details
- Use MSW for API mocking in both development and testing environments
- Implement proper test data setup and cleanup for reliable test execution