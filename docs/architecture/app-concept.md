# Public Note Library + Personal Notebook

A lightweight note platform where anyone can browse and read **public notes** (library), while signed-in users—including **anonymous users**—can **save, duplicate, and edit notes privately** in their **Personal Notebook**. Normal users unlock profile, syncing, and publishing options. Anonymous → normal promotion preserves the same UID and all private notes.

Why it fits

* Natural public/private split (library vs. notebook).
* Anonymous-first UX (private notebook “just works”), seamless promotion with `linkWithCredential`.
* SEO for public notes; fast client UX for private editing.
* Small, extensible surface for a solo build.

Pages / access

1. Home (Public Library, SSR): browse featured/latest notes, tags, search.
2. Public Note Detail (SSR): readable, shareable (OG tags).
3. My Notebook (Private: anon & normal, CSR): user’s drafts, saved copies, tags.
4. Account / Publishing (Private: normal only, CSR): profile, export, “publish note” toggle.
   5–6. Login / Sign Up modals (global).
5. 404 with links to Library and Notebook.

Auth behavior (FirebaseAuth)

* Public pages require no login.
* Visiting My Notebook with no session silently calls `signInAnonymously()` in the background.
* Promotion: user signs up; use `linkWithCredential` so **UID stays the same** and all notes persist.

Minimal data model

* `NotePublic`: `id, slug, title, bodyMDX, tags[], author?, createdAt, updatedAt, isPublic=true`
* `NotePrivate`: `id, userId, sourcePublicId?, title, bodyMDX, tags[], createdAt, updatedAt`
* `UserProfile` (normal): `userId, displayName, avatarUrl?, settings{locale, theme, editor}`, flags

API surface (OpenAPI-first)
Public

* `GET /notes?tag=&q=&page=` — list (cacheable, SSR-friendly)
* `GET /notes/{slug}` — detail (cacheable)

Private (cookie or bearer required)

* `GET /me/notes`
* `POST /me/notes` (new or duplicate from public via `sourcePublicId`)
* `PATCH /me/notes/{id}`
* `DELETE /me/notes/{id}`
* `GET /me` (normal only), `PATCH /me`
* Optional (normal): `POST /me/notes/{id}/publish` → creates/updates `NotePublic`

Auth bridge (server)

* `POST /auth/login` (exchange Firebase ID token → set `__session` httpOnly cookie)
* `POST /auth/logout` (clear cookie)

Rendering strategy (Next.js 15 App Router)

* Library & public note detail: **Server Components + SSR** with revalidation for SEO/TTFB.
* Notebook & account: **Client Components + CSR** after auth hydration.
* Modals: client-mounted anywhere.

Client state & data fetching

* **Zustand**: `auth.status`, `auth.user`, modal state.
* **TanStack Query**: data for public lists/details and `me/notes`.

  * Public queries can be prefetched on the server.
  * Private queries use cookie-based auth (server) or attach `Authorization: Bearer <ID token>` (client).

Security & headers (Vercel + FastAPI)

* Session cookie: `httpOnly`, `Secure`, `SameSite=Lax`; never store tokens in localStorage.
* CSP (pragmatic baseline):

  * `default-src 'self'`
  * `script-src 'self' 'strict-dynamic' 'nonce-<generated>'`
  * `style-src 'self' 'unsafe-inline'`
  * `img-src 'self' https: data:`
  * `connect-src 'self' https://your-api.example.com https://*.firebaseio.com`
* Also: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, selective `Permissions-Policy`.
* Validate all bodies with Pydantic; throttle write endpoints.

Directory sketch (frontend)

```
app/
  page.tsx                       # Library (SSR)
  notes/[slug]/page.tsx          # Public detail (SSR)
  me/page.tsx                    # Notebook (CSR)
  account/page.tsx               # Profile/Publishing (CSR)
  not-found.tsx
components/
  note/NoteCard.tsx
  note/Editor.tsx                # MD/MDX editor (client)
  auth/LoginModal.tsx
  auth/SignUpModal.tsx
lib/
  auth.ts                        # Firebase helpers (anon, linkWithCredential)
  apiClient.ts                   # fetch wrapper
  queryClient.ts
store/authStore.ts
styles/globals.css
```

Directory sketch (backend FastAPI)

```
app/
  main.py
  deps/auth.py
  routers/
    public_notes.py
    me_notes.py
    me_profile.py
    auth_bridge.py
  models/         # Pydantic schemas
  services/       # note and user services
  db/             # Postgres adapter (or DynamoDB)
```
