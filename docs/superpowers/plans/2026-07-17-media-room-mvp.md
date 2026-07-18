# Media Room MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a mobile-friendly, shareable pixel-inspired media room for books, manga, anime, and movies, with a GPT-5.6 Taste Profiler.

**Architecture:** A Next.js App Router application renders a responsive two-zone room from a single media-entry data model. Supabase persists authenticated owner data and exposes only public entries to profile pages. A server-only route validates public entries, calls GPT-5.6, and returns a schema-checked profiler card.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Vitest, React Testing Library, Supabase Auth/Postgres, OpenAI Responses API, Vercel.

## Global Constraints

- Use one `MediaEntry` model for books, manga, anime, and movies.
- Status values are exactly `planned`, `in_progress`, `finished`, and `abandoned`.
- The room is a fixed responsive scene; themes, furniture settings, visitor comments, feeds, and follows are out of scope.
- Public pages show only `visibility = public` entries.
- Keep the OpenAI API key server-side; never include it in browser code or `NEXT_PUBLIC_*` variables.
- Profiler output is spoiler-safe, grounded in supplied public entries, and returns an archetype, profile, three signals, and first pick.
- Use curated seed data and manual add/edit first; external catalog APIs are optional after the MVP works.

---

## Planned file structure

- `app/page.tsx`: landing/demo route.
- `app/room/page.tsx`: authenticated owner room.
- `app/u/[username]/page.tsx`: public profile route.
- `app/api/taste-profile/route.ts`: server-only GPT profiler endpoint.
- `components/room/*`: scene, zones, covers, detail drawer, and profiler card.
- `components/media/*`: entry form and owner controls.
- `lib/media/types.ts`: domain types and runtime validators.
- `lib/room/placement.ts`: pure position assignment rules.
- `lib/room/placement.test.ts`: placement tests.
- `lib/taste/schema.ts`: profiler output schema.
- `lib/taste/prompt.ts`: safe GPT prompt construction.
- `lib/supabase/{client,server}.ts`: Supabase clients.
- `supabase/migrations/001_initial_schema.sql`: tables, indexes, and row-level security.
- `.env.example`: non-secret environment variable names.

### Task 1: Bootstrap the application shell

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `vitest.config.ts`, `tests/setup.ts`

**Interfaces:**
- Produces a Next.js App Router application with `npm run dev`, `npm run test`, and `npm run build` commands.

- [ ] **Step 1: Create the Next.js TypeScript project with Tailwind, then install test and UI dependencies.**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --use-npm --import-alias "@/*"`

Run: `npm install @supabase/ssr @supabase/supabase-js openai zod clsx`

Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

- [ ] **Step 2: Add a failing smoke test.**

Create `app/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import Home from './page';

it('introduces Media Room', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /media room/i })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test and confirm it fails before the page exists.**

Run: `npm run test -- app/page.test.tsx`

Expected: FAIL because the page does not render the Media Room heading.

- [ ] **Step 4: Implement the minimum landing page.**

In `app/page.tsx`, export a component containing:

```tsx
export default function Home() {
  return <main><h1>Media Room</h1><p>Your taste, made explorable.</p></main>;
}
```

- [ ] **Step 5: Run checks.**

Run: `npm run test -- app/page.test.tsx && npm run build`

Expected: PASS and a successful production build.

- [ ] **Step 6: Commit.**

Run after the repository exists: `git add . && git commit -m "chore: scaffold Media Room app"`

### Task 2: Define media types and testable placement rules

**Files:**
- Create: `lib/media/types.ts`, `lib/room/placement.ts`, `lib/room/placement.test.ts`

**Interfaces:**
- Produces `MediaType`, `MediaStatus`, `MediaEntry`, and `getRoomZone(entry): RoomZone`.
- `getRoomZone` consumes an entry's `type` and `status`; room components consume its returned zone.

- [ ] **Step 1: Write the placement test.**

```ts
import { getRoomZone } from './placement';

it.each([
  ['book', 'finished', 'reading-shelf'],
  ['manga', 'abandoned', 'reading-abandoned-pile'],
  ['anime', 'in_progress', 'tv-player'],
  ['movie', 'planned', 'tv-planned-stack'],
])('%s %s is placed in %s', (type, status, expected) => {
  expect(getRoomZone({ type, status } as any)).toBe(expected);
});
```

- [ ] **Step 2: Run the test and confirm it fails.**

Run: `npm run test -- lib/room/placement.test.ts`

Expected: FAIL because `getRoomZone` is not defined.

- [ ] **Step 3: Add exact domain unions and placement mapping.**

```ts
export type MediaType = 'book' | 'manga' | 'anime' | 'movie';
export type MediaStatus = 'planned' | 'in_progress' | 'finished' | 'abandoned';
export type RoomZone = 'reading-shelf' | 'reading-nearby' | 'reading-abandoned-pile' | 'tv-cabinet' | 'tv-player' | 'tv-planned-stack' | 'tv-abandoned-pile';

export function getRoomZone(entry: Pick<MediaEntry, 'type' | 'status'>): RoomZone {
  const reading = entry.type === 'book' || entry.type === 'manga';
  if (reading && entry.status === 'finished') return 'reading-shelf';
  if (reading && entry.status === 'abandoned') return 'reading-abandoned-pile';
  if (reading) return 'reading-nearby';
  if (entry.status === 'finished') return 'tv-cabinet';
  if (entry.status === 'in_progress') return 'tv-player';
  if (entry.status === 'planned') return 'tv-planned-stack';
  return 'tv-abandoned-pile';
}
```

- [ ] **Step 4: Run tests.**

Run: `npm run test -- lib/room/placement.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit.**

Run: `git add lib && git commit -m "feat: add media placement rules"`

### Task 3: Build the interactive room and media detail drawer

**Files:**
- Create: `components/room/MediaRoom.tsx`, `components/room/MediaCover.tsx`, `components/room/MediaDetailDrawer.tsx`, `lib/media/demo-data.ts`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `components/room/MediaRoom.test.tsx`

**Interfaces:**
- `MediaRoom({ entries, readOnly }: { entries: MediaEntry[]; readOnly: boolean })` renders entries based on `getRoomZone`.
- `MediaCover` calls `onSelect(entry)`; `MediaDetailDrawer` receives `entry: MediaEntry | null`.

- [ ] **Step 1: Write a failing interaction test.**

```tsx
render(<MediaRoom entries={demoEntries} readOnly />);
await user.click(screen.getByRole('button', { name: /spirited away/i }));
expect(screen.getByText(/a beloved fantasy/i)).toBeVisible();
```

- [ ] **Step 2: Run it and confirm failure.**

Run: `npm run test -- components/room/MediaRoom.test.tsx`

Expected: FAIL because the room component is missing.

- [ ] **Step 3: Implement the scene.**

Render two semantic sections named `Reading nook` and `TV nook`, each with a pixel-styled avatar illustration made from CSS shapes and named zones. Render each cover as a keyboard-accessible button. Use the deterministic entry index within each zone to offset cover positions, preventing overlap from hiding every item. The detail drawer must show title, type, status, synopsis, rating, and note.

- [ ] **Step 4: Seed an expressive demo profile.**

Create 12 entries spanning all types and statuses, including a public `Spirited Away` movie whose synopsis contains `A beloved fantasy` so the interaction test exercises real demo data.

- [ ] **Step 5: Verify interaction and responsive build.**

Run: `npm run test -- components/room/MediaRoom.test.tsx && npm run build`

Expected: PASS.

- [ ] **Step 6: Commit.**

Run: `git add app components lib && git commit -m "feat: build explorable media room"`

### Task 4: Add the owner media-entry flow

**Files:**
- Create: `components/media/MediaEntryForm.tsx`, `components/media/MediaEntryForm.test.tsx`, `app/room/page.tsx`

**Interfaces:**
- `MediaEntryForm({ initialEntry?, onSave })` calls `onSave(entry)` only after Zod validation.
- `onSave` consumes an entry without server-generated `id` or timestamps.

- [ ] **Step 1: Write a failing validation test.**

```tsx
render(<MediaEntryForm onSave={onSave} />);
await user.click(screen.getByRole('button', { name: /save/i }));
expect(screen.getByText(/title is required/i)).toBeVisible();
expect(onSave).not.toHaveBeenCalled();
```

- [ ] **Step 2: Run it and confirm failure.**

Run: `npm run test -- components/media/MediaEntryForm.test.tsx`

Expected: FAIL because the form is missing.

- [ ] **Step 3: Implement manual add/edit with exact fields.**

The form contains title (required), type (required select), status (required select), cover URL, synopsis, integer rating 1–5, note, and visibility. Use `z.object({ title: z.string().trim().min(1, 'Title is required'), type: z.enum(['book','manga','anime','movie']), status: z.enum(['planned','in_progress','finished','abandoned']) })` as the minimum schema. Render inline errors and a cover placeholder when no cover URL is supplied.

- [ ] **Step 4: Implement a local-first owner page.**

The owner page opens the form from an `Add media` button, merges saved entries into local room state, and supports editing/deleting before persistence is connected.

- [ ] **Step 5: Run test and build.**

Run: `npm run test -- components/media/MediaEntryForm.test.tsx && npm run build`

Expected: PASS.

- [ ] **Step 6: Commit.**

Run: `git add app components lib && git commit -m "feat: add media entry form"`

### Task 5: Configure Supabase persistence, authentication, and public privacy

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `.env.example`
- Modify: `app/room/page.tsx`, `components/media/MediaEntryForm.tsx`
- Create: `app/u/[username]/page.tsx`

**Interfaces:**
- `profiles(id uuid, username text unique, display_name text)` and `media_entries(id uuid, profile_id uuid, ... visibility text)`.
- Owner queries are keyed by authenticated `auth.uid()`; public route queries `profiles.username` and `media_entries.visibility = 'public'`.

- [ ] **Step 1: Write migration policy assertions as SQL comments and a manual verification script.**

The migration must create RLS policies named `owners manage own entries` and `public reads public entries`. Include a `supabase/README.md` checklist stating: owner can create/update/delete only own records; anonymous request can select public entries only; anonymous request cannot select private entries.

- [ ] **Step 2: Write the migration.**

Use `create table public.media_entries (...)`, enable RLS, and define policies using `auth.uid() = profile_id` for owner writes and `visibility = 'public'` for anonymous selects. Include indexes on `(profile_id, created_at desc)` and `(visibility)`.

- [ ] **Step 3: Add server and browser Supabase clients.**

Both modules must throw a descriptive setup error if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is absent. `.env.example` lists only those two variables and `OPENAI_API_KEY`.

- [ ] **Step 4: Replace local-only owner mutations with Supabase calls and add the public route.**

The owner page reads/writes the signed-in user's rows. `app/u/[username]/page.tsx` queries only public entries and passes `readOnly` to `MediaRoom`. A not-found profile calls `notFound()`.

- [ ] **Step 5: Verify privacy manually and build.**

Run: `npm run build`

Expected: PASS. Then apply the migration in a Supabase project and complete every `supabase/README.md` verification item with an authenticated and anonymous browser session.

- [ ] **Step 6: Commit.**

Run: `git add app components lib supabase .env.example && git commit -m "feat: persist rooms and publish profiles"`

### Task 6: Implement GPT-5.6 Taste Profiler

**Files:**
- Create: `lib/taste/schema.ts`, `lib/taste/prompt.ts`, `app/api/taste-profile/route.ts`, `components/room/TasteProfilerCard.tsx`
- Test: `lib/taste/schema.test.ts`, `app/api/taste-profile/route.test.ts`
- Modify: `app/u/[username]/page.tsx`

**Interfaces:**
- `TasteProfile = { archetype: string; profile: string; signals: [string, string, string]; firstPick: { title: string; reason: string } }`.
- `POST /api/taste-profile` accepts `{ username: string }` and returns `{ profile: TasteProfile }`.

- [ ] **Step 1: Write a schema test.**

```ts
expect(TasteProfileSchema.parse({
  archetype: 'The Hopeful Worldbuilder',
  profile: 'You collect...',
  signals: ['You favor...', 'You return...', 'You forgive...'],
  firstPick: { title: 'Spirited Away', reason: 'It matches...' },
})).toBeDefined();
```

- [ ] **Step 2: Run it and confirm failure.**

Run: `npm run test -- lib/taste/schema.test.ts`

Expected: FAIL because `TasteProfileSchema` is not defined.

- [ ] **Step 3: Implement schema and prompt.**

Define `TasteProfileSchema` with Zod, enforcing non-empty strings and exactly three signals. Build a prompt that states: use only provided public entries, avoid plot spoilers, never infer demographics or sensitive traits, keep the tone affectionate and lightly funny, and select `firstPick.title` from supplied titles only.

- [ ] **Step 4: Implement the server route.**

Validate JSON input, load the username's public entries from Supabase, return 404 for no profile and 422 for no public entries, call GPT-5.6 from server code only, parse structured output with the schema, and return a 502 `{ error: 'The profiler is taking a tea break. Please retry.' }` on provider or parse failure.

- [ ] **Step 5: Add the visitor card flow.**

The public profile renders `Read my taste`. While fetching, disable the button and show `Reading the room…`; on success render archetype, profile, three signals, and first pick; on error show the API message and a retry button.

- [ ] **Step 6: Run tests and build.**

Run: `npm run test -- lib/taste/schema.test.ts app/api/taste-profile/route.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 7: Commit.**

Run: `git add app components lib && git commit -m "feat: add GPT taste profiler"`

### Task 7: Accessibility, mobile polish, and deployment

**Files:**
- Modify: `app/globals.css`, `components/room/*`, `README.md`
- Create: `docs/demo-checklist.md`

**Interfaces:**
- Produces a deployable app with documented setup and a repeatable demonstration flow.

- [ ] **Step 1: Write an accessibility regression test.**

```tsx
render(<MediaRoom entries={demoEntries} readOnly />);
expect(screen.getByRole('region', { name: /reading nook/i })).toBeVisible();
expect(screen.getByRole('region', { name: /tv nook/i })).toBeVisible();
expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
```

- [ ] **Step 2: Run it and confirm the intended semantics are present.**

Run: `npm run test -- components/room/MediaRoom.test.tsx`

Expected: PASS after adding labeled regions and button labels for every cover.

- [ ] **Step 3: Complete responsive styles.**

At widths below 768px, stack room zones vertically while retaining exact status groupings; prevent horizontal page scroll; use touch targets at least 44px; respect `prefers-reduced-motion` for any hover/entry animation.

- [ ] **Step 4: Write deployment and demo instructions.**

`README.md` documents environment variables, Supabase migration, local development, tests, and Vercel deployment. `docs/demo-checklist.md` gives a 2–3 minute recording sequence: land in room, inspect finished/current/abandoned items, add an item, open public URL, inspect a detail drawer, generate Taste Profiler, close with the shared room value proposition.

- [ ] **Step 5: Execute final verification.**

Run: `npm run test && npm run build`

Expected: all tests PASS and production build succeeds. Then test owner/public URLs on a phone-size browser viewport and a desktop viewport.

- [ ] **Step 6: Commit.**

Run: `git add . && git commit -m "docs: prepare Media Room hackathon demo"`

## Spec coverage review

- Four media types and four statuses: Tasks 2–4.
- Fixed split room, avatars, placements, clickable covers, and details: Task 3.
- Owner add/edit/delete: Task 4, persisted in Task 5.
- Auth, sharing, and privacy: Task 5.
- GPT-5.6 spoiler-safe playful profile and fallbacks: Task 6.
- Error, empty, responsive, accessibility, test, deployment, and demo requirements: Tasks 3–7.

## Plan self-review

- No placeholder tasks remain; each required MVP behavior is assigned.
- Type names and status values are consistent across all tasks.
- No external catalog integration is required to submit a working project.
