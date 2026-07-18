# Media Room MVP Design

## Purpose

Media Room is a shareable, cozy pixel-inspired room that turns a person's books, manga, anime, and movies into an explorable visual record of their taste. It is an "Apps for Your Life" OpenAI Build Week entry, designed to demonstrate thoughtful use of Codex and GPT-5.6.

## MVP outcome

An owner can add and track media, see it placed in a fixed two-zone room, and share a public profile URL. Visitors can inspect media entries and generate a playful, spoiler-safe Taste Profiler card from the owner's public library.

## Scope

### Included

- Books, manga, anime, and movies.
- One shared media-entry model with title, type, cover, synopsis, status, rating, note, visibility, and timestamps.
- Statuses: planned, in progress, finished, and abandoned.
- Fixed responsive pixel-inspired room scene split into a reading nook and TV nook.
- Dynamic placement rules:
  - Books and manga: finished on shelves; planned/current close to the reading avatar; abandoned in a pile near the shelves.
  - Anime and movies: current in the DVD player; planned stacked beside it; finished in the cabinet; abandoned in a pile away from the player.
- Owner dashboard to add, edit, and remove entries.
- Public, read-only profile at `/u/[username]`, displaying public entries only.
- Clickable cover detail drawer with synopsis, status, owner rating, and owner note.
- Taste Profiler generated from public entries only: an archetype name, short profile, three taste signals, and a suggested first item to borrow/watch/read.
- Loading, empty, missing-cover, and AI-unavailable fallbacks.

### Explicitly deferred

- Multiple room themes, furniture choices, avatar customization, and complex animation.
- Social feed, follows, notifications, comments by visitors, direct messages, and collaboration.
- Rich automatic catalog search/import. A curated demo catalog and manual entry are the reliable MVP path; catalog integrations are a nice-to-have.

## UX

The room is the primary interface, not a decorative dashboard. The reading nook occupies the left side and includes a simple pixel avatar in a chair. The TV nook occupies the right side and includes a simple pixel avatar watching TV from the floor. Status placement communicates the user's progress without opening a list. Tapping a cover opens the media drawer. The owner view provides an obvious Add Media action; visitor view is read-only with a Read My Taste action.

## Architecture

- Next.js, React, TypeScript, and Tailwind CSS in a single responsive web application.
- Custom 2D scene composed with responsive HTML/CSS and positioned cover elements. Placement is calculated in a pure, testable module from media type, status, and display order.
- Supabase Authentication and Postgres storage with `profiles` and `media_entries` tables. Row-level rules ensure owners manage their own entries and public pages receive public entries only.
- A Next.js server route calls GPT-5.6. The browser sends only the public-profile request; the OpenAI API key stays server-side.
- The profiler expects structured output and validates it before display. It never invents private data and is prompted to avoid plot spoilers.

## Data flow

1. Owner signs in and creates or edits a media entry.
2. The database persists the entry and the owner room re-renders according to placement rules.
3. A visitor opens `/u/[username]`; the server retrieves only public entries and renders the read-only room.
4. Visitor requests the Taste Profiler; the server submits a compact representation of public titles, types, statuses, ratings, and notes to GPT-5.6.
5. The server validates and returns the profiler card, or a graceful fallback card if generation fails.

## Error handling and privacy

- Invalid or incomplete entry fields are rejected with inline messages.
- The public page never exposes entries marked private.
- A missing cover uses a visual placeholder.
- Empty rooms explain how to add the first title; public empty rooms explain that no media is shared yet.
- AI errors, rate limits, or malformed output show a friendly retry state and may use a generic prewritten card; the room remains usable.

## Verification

- Unit tests cover placement rules for every status and each media-family zone.
- API tests validate profiler input and structured output parsing.
- Manual checklist: create/edit entries, change every status, confirm private entries never appear publicly, open detail cards, generate the profiler, test phone and desktop layouts, and verify shared URL behavior.

## Delivery schedule

- July 17: scaffold application, create room scene, seed demo data, and implement clickable details.
- July 18: owner add/edit flow, dynamic placement, and responsive polish.
- July 19: authentication, persistence, public profiles, and privacy controls.
- July 20-21: GPT-5.6 profiler, deployment, testing, screenshots, a 2-3 minute demo video, and Devpost submission.

## Success criteria

- A visitor immediately understands the owner's taste and reading/watching state from the room.
- All four media types work through the same reliable product path.
- The demo has a clear GPT-5.6 moment: an entertaining, grounded profile that turns an explorable room into a conversation starter.
- The deployed app and submission materials are ready by July 21, 5:00 PM Pacific.
