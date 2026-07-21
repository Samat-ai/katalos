# Katalos Build Week Launch Plan

## Goal

Ship a complete, cozy 16-bit media-room experience for OpenAI Build Week: visitors explore a featured room, sign up, curate their own room through catalog search, and safely share it. Gemini remains the runtime Taste Profiler; Codex-assisted commits document the Build Week extension.

## Core loop

1. The landing page renders a built-in, populated featured room without Supabase setup. Visitors can inspect covers and choose **Create your room**.
2. Magic-link sign-in and handle onboarding remain intact. New owners enter a guided first-add flow rather than a blank dashboard.
3. Owners choose a media type, search its catalog, select a result to fill title, cover, and synopsis, then choose status, rating, note, and visibility before saving.
4. Owners share `/u/<username>`; public rooms expose only public entries and retain the existing Gemini Taste Profiler.

## Catalog contract

- `POST /api/catalog/search` accepts a validated `{ type, query }` and returns at most eight normalized candidates.
- `POST /api/catalog/details` accepts a validated candidate and returns `{ title, coverUrl?, synopsis }` for form prefill.
- Books use Open Library, manga and anime use Jikan, and movies use TMDB. Raw provider payloads and the TMDB token stay server-side.
- Queries are at least three characters, debounced by 350ms, cancel stale browser requests, and always leave manual entry available.
- Cache normalized provider results in Supabase for 24 hours. Lock cache and quota tables behind server/RPC access; cap each profile at 10 upstream requests per rolling minute. Use conservative provider cooldowns and treat timeout, malformed payload, and 429 responses as a manual-fallback state.
- Use native HTTPS cover images with an accessible pixel placeholder after image failure; do not proxy arbitrary user URLs through server image optimization.

## Design and credits

- Preserve a cozy 16-bit visual language: crisp pixels, limited palette, chunky shadows, pixel panels, and game-like controls. Avoid generic dashboard, glass, and gradient styling.
- Port Claude UI/UX output screen by screen while preserving server-side loading, route authorization, component data contracts, keyboard access, 44px touch targets, reduced motion, and responsive scene stacking.
- Add `/credits`, linked from the global footer and catalog results. Credit/link Open Library, Jikan (with its MyAnimeList non-affiliation disclaimer), and TMDB. Use an official unmodified TMDB logo and its required notice: “This product uses the TMDB API but is not endorsed or certified by TMDB.”

## Quality and delivery

- Add GitHub Actions checks for clean install, tests, Next build, and Cloud Run container build. Use Vercel Git previews and production deployment from the default branch after checks pass.
- Add server-only `TMDB_READ_ACCESS_TOKEN` and `OPEN_LIBRARY_CONTACT_EMAIL`; retain current Supabase and profiler secrets.
- Test provider normalization, request validation, cache/quota behavior, provider fallback, selection prefill, cover fallback, credits, and privacy regressions.
- Validate production with a new-user signup, each provider, manual fallback, public/private control entry, Gemini retry state, keyboard navigation, and phone/desktop layouts.
- Prepare the Apps for Your Life Devpost entry, README, architecture/privacy notes, narrated 2–3 minute demo, screenshots, and Codex/commit evidence.

## Time-boxed follow-up

Only after release checks and submission assets are complete, add validated profile-level `room_config` presets for wallpaper, floor, palette, and a small decor set. Keep media placement and privacy rules unchanged. Social/discovery features remain out of scope.
