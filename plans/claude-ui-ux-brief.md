# Katalos UI/UX Design Brief for Claude

## Product in one sentence

Katalos is a shareable, cozy pixel-art media room where someone turns the books, manga, anime, and movies that matter to them into an explorable personal space—then shares it without exposing private entries.

## What the product must make people feel

The room should feel like a tiny, lived-in 16-bit world rather than a media-tracking dashboard. A visitor should immediately understand a person’s taste and current reading/watching life. A new curator should feel that making their own room is inviting, quick, and personal.

Avoid generic SaaS cards, glassmorphism, gradients, and a productivity-app visual language.

## Non-negotiable visual direction

- Cozy 16-bit pixel-art bedroom/living-room atmosphere.
- Crisp edges, a deliberately limited warm palette, chunky pixel shadows, pixel-panel borders, and game-like controls.
- The room is the hero interface; media should look like physical objects placed in a scene, not a grid of generic cards.
- The reading nook and TV nook should feel related but distinct.
- Keep the interface legible and calm even with many titles, long names, empty zones, or missing cover images.
- Mobile must stack scenes cleanly with no horizontal scrolling.

## Required screens and flows

### 1. Featured demo landing page (`/`)

This is the first experience. It shows a populated demo room before sign-in.

- Hero: Katalos name, short promise, and a clear invitation to create a room.
- Featured room: interactive public demo content across books, manga, anime, and movies.
- A visitor can click any cover to open a detail drawer.
- Magic-link sign-in remains available as the main conversion action.
- Include a subtle link to Credits.

### 2. Magic-link sign-in

- One email field, a clear send-link action, loading state, and success/error message.
- Keep it visually connected to the featured room rather than feeling like a separate admin screen.

### 3. Onboarding (`/onboarding`)

- Collect display name and lowercase public username.
- Explain that the username becomes the shareable public room URL.
- Make completion feel like naming/opening a new room.

### 4. New owner / first-add flow (`/room` with no entries)

- New owners land directly in Add Media; do not leave them at a dead-end empty dashboard.
- The form should visibly guide the sequence: choose media type → search catalog or enter manually → set status and privacy → save.
- Keep a small empty-room message that makes the first saved item feel meaningful.

### 5. Add/edit media form

Fields already exist and must remain: title, type, status, cover URL, synopsis, rating (1–5), note, and visibility.

- Type choices: book, manga, anime, movie.
- Statuses: planned, in progress, finished, abandoned.
- Catalog lookup is type-specific: Open Library for books, Jikan for manga/anime, TMDB for movies.
- Search results must look like compact, selectable finds—not permanent media cards.
- Selecting a result prefills title, cover, and synopsis. The user retains control over status, rating, note, and visibility.
- Manual entry must remain obvious when search returns no result, throttles, or fails.

### 6. Owner room

- The owner can see all entries, including private ones.
- Strong Add Media and Copy Public Link actions.
- Editing/deleting can remain in a management area below or adjacent to the room; do not clutter the scene itself.
- Media placement is meaningful and fixed:
  - Books/manga: finished on shelf; planned/in-progress near the reader; abandoned in a reading pile.
  - Anime/movies: finished in cabinet; in-progress in/near player; planned in a watch-next stack; abandoned in a separate pile.

### 7. Public room (`/u/[username]`)

- Read-only version of a person’s room.
- Show public entries only; private entries must never be implied, hinted at, or counted.
- Include the Gemini-powered Taste Profiler card: idle, loading, success, retry/error states.
- Maintain the same cozy room language while making the owner identity and shared URL clear.

### 8. Media detail drawer

- Opens from a cover without navigating away.
- Shows title, type, status, synopsis, rating, and note when present.
- Must be keyboard-accessible, easy to close, and comfortable on mobile.

### 9. Credits (`/credits`)

- A simple readable credits page linked globally.
- Credit Open Library, Jikan, and TMDB.
- Preserve the TMDB notice: “This product uses the TMDB API but is not endorsed or certified by TMDB.”
- Preserve: “Jikan is not affiliated with MyAnimeList.net.”

## Required component states

Design all of these rather than only the happy path:

- Loading: sending magic link, catalog searching, catalog details loading, saving media, copying link, Taste Profiler generation.
- Empty: a new room, a public room with no shared media, no catalog results.
- Error/fallback: invalid form fields, failed sign-in link, unavailable catalog, rate-limited catalog, missing image, failed save, unavailable Taste Profiler.
- Success: magic-link sent, profile created, media saved, public link copied.
- Long content: long title, long synopsis, missing rating/note, missing cover.

## Accessibility and responsive requirements

- All cover art remains a keyboard-focusable button with a meaningful label.
- Visible focus style; do not rely on hover alone.
- Minimum 44px target sizes for interactive controls.
- Respect `prefers-reduced-motion`.
- Use semantic headings, labeled regions for Reading nook and TV nook, clear form labels, and non-color-only status cues.
- Phone-first layouts must not overflow horizontally; desktop may place the two nooks side-by-side.

## Technical boundaries: preserve these

- This is a Next.js App Router app using React and TypeScript.
- Existing routes, server-side auth checks, Supabase access, and API contracts must remain intact.
- Reusable UI components must not call Supabase, TMDB, Jikan, Open Library, or Gemini directly. Browser components call existing route APIs only.
- Do not put secrets, tokens, provider calls, or private-entry data in browser code.
- Public rooms and the Taste Profiler operate on `visibility = 'public'` entries only.
- Keep the existing `MediaRoom`, media-entry form, and Taste Profiler behavior even if their markup/layout is redesigned.

## What to hand back

Provide a practical implementation handoff, not only a mood board:

1. Desktop and phone mockups for every required screen/state above.
2. A concise token system: palette, typography, pixel borders/shadows, spacing, radii, interaction states.
3. Component inventory with variants and responsive rules.
4. A short mapping showing which existing components can be reskinned versus which need replacement.
5. Pixel-art asset guidance that works with CSS/HTML and remote cover art; do not require a canvas game engine.
6. Notes on handling long titles, empty zones, missing covers, and form/catalog error states.

## Evaluation checklist

The handoff is successful if a developer can implement it without deciding the visual direction, screen hierarchy, interaction priority, or error/empty behavior themselves.
