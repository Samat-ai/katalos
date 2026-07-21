# Katalos

Katalos makes your media taste tangible and shareable—without sharing what you keep private. Owners sign in with an email magic link, curate books, manga, anime, and movies, then share a public media room. Visitors can generate a spoiler-safe Taste Profile from public entries only.

## Architecture

```text
Browser → Vercel Next.js → Supabase Auth + Postgres
                         → Cloud Run Taste Profiler → Gemini via ADC
```

The Next.js server queries the room owner's public rows, sends only bounded public fields to Cloud Run, and authenticates that call with a server-only bearer token. Cloud Run uses its attached service account's Application Default Credentials (ADC) for Gemini. No browser receives the shared token, Google credentials, or a Supabase privileged key.

## Local setup

Requirements: Node.js 20+ and a Supabase project.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set these server/runtime variables in `.env.local` and in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
TASTE_PROFILER_URL=https://YOUR-CLOUD-RUN-URL
TASTE_PROFILER_SHARED_TOKEN=a-long-random-shared-secret
TMDB_READ_ACCESS_TOKEN=your-tmdb-read-access-token
OPEN_LIBRARY_CONTACT_EMAIL=you@example.com
```

## Supabase

1. Run `supabase/migrations/001_initial_schema.sql` through `004_harden_catalog_rpcs.sql` in the Supabase SQL editor, in order.
2. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` and `https://YOUR-VERCEL-DOMAIN/auth/callback` to redirect URLs.
3. Enable Email authentication and configure your production email sender as needed.
4. Follow [supabase/README.md](supabase/README.md) to verify row-level security with owner and anonymous sessions.

The app redirects unauthenticated `/room` requests to sign-in, redirects first-time owners to `/onboarding`, and serves public rooms at `/u/<username>`.

## Cloud Run Taste Profiler

Deploy the separate service from `cloud-run-taste-profiler/`. Build it with Cloud Build or a container registry, attach a service account that can call Vertex AI, and set `TASTE_PROFILER_SHARED_TOKEN` to the same secret used by Vercel.

```bash
gcloud run deploy katalos-taste-profiler \
  --source cloud-run-taste-profiler \
  --region us-central1 \
  --service-account KATALOS_PROFILER_SERVICE_ACCOUNT \
  --set-secrets TASTE_PROFILER_SHARED_TOKEN=katalos-profiler-token:latest \
  --set-env-vars GOOGLE_CLOUD_LOCATION=us-central1,GEMINI_MODEL=gemini-2.5-flash
```

Grant the attached service account the minimum Vertex AI role needed to generate content. The service validates its bearer token and request body, asks Gemini for JSON, validates the returned schema, and rejects a `firstPick` that is not in the supplied entries.

## Verification

```bash
npm run test
npm run build
```

Hosted checks: sign in as a new user, create a profile and avatar, add public and private entries, open `/u/<username>` anonymously, confirm the private control entry is absent, copy the room link, generate a Taste Profile, and verify its retry state if Cloud Run is unavailable.

## Catalog credits and delivery

Catalog search is available to signed-in owners: Open Library powers books, Jikan powers manga and anime, and TMDB powers movies. Add the TMDB token and Open Library contact address only to Vercel/server environments. See [/credits](/credits) for provider attribution and disclaimers.

GitHub Actions runs tests, a production build, and a Cloud Run container build on pull requests and `master`. Connect the repository to Vercel for preview deployments and production deployment from `master`.

See [docs/demo-checklist.md](docs/demo-checklist.md) for the recording flow.
