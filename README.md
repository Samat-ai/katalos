# Katalos Media Room

Katalos turns books, manga, anime, and movies into a small, shareable media room. Covers are grouped by status in a reading nook or TV nook; visitors can explore public entries and request a spoiler-safe Taste Profiler.

## Requirements

- Node.js 20 or newer
- A Supabase project for accounts and persistence
- An OpenAI API key for the Taste Profiler

## Environment

Copy `.env.example` to `.env.local`, then set these variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-server-only-openai-key
```

`OPENAI_API_KEY` is used only by the server route at `/api/taste-profile`; never expose it with a `NEXT_PUBLIC_` prefix or commit it to source control.

## Supabase setup

1. Create a Supabase project and configure the authentication providers you intend to use.
2. In the Supabase SQL editor, run `supabase/migrations/001_initial_schema.sql`.
3. Follow `supabase/README.md` to verify the row-level security policies with an authenticated owner session and an anonymous session.
4. Create a profile for the signed-in user's ID with a unique lowercase username. Public rooms are served at `/u/<username>`.

The migration permits owners to manage only their own entries, while public pages and the profiler query only entries whose visibility is `public`.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the demo room, `http://localhost:3000/room` for the owner room, and `http://localhost:3000/u/<username>` for a public profile. The owner room keeps demo data in memory until Supabase is configured and the user is signed in.

## Tests and production build

```bash
npm run test
npm run build
```

For the accessibility regression alone:

```bash
npm run test -- components/room/MediaRoom.test.tsx
```

## Deploy to Vercel

1. Push this repository to a Git provider and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `OPENAI_API_KEY` in the Vercel project environment variables for Production (and Preview if desired).
3. Deploy with Vercel's default Next.js build settings (`npm run build`).
4. In Supabase Authentication, add the deployed Vercel URL to the allowed redirect URLs for your chosen sign-in flow.
5. Verify `/room` as a signed-in owner and `/u/<username>` in an anonymous browser session. Confirm private entries are absent from the public room and that the Taste Profiler can only use public entries.

See `docs/demo-checklist.md` for the recording flow.
