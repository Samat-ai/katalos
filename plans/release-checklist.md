# Katalos Build Week Release Checklist

## Configure

- [ ] Apply Supabase migrations `001_initial_schema.sql` and `002_catalog_search_safeguards.sql` in order.
- [ ] Set Vercel runtime variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TASTE_PROFILER_URL`, `TASTE_PROFILER_SHARED_TOKEN`, `TMDB_READ_ACCESS_TOKEN`, and `OPEN_LIBRARY_CONTACT_EMAIL`.
- [ ] Keep `TMDB_READ_ACCESS_TOKEN` and profiler secrets server-only; never use `NEXT_PUBLIC_` names for them.
- [ ] Confirm Cloud Run has its existing Gemini ADC and shared-token configuration.

## Verify production

- [ ] Complete a first-time magic-link sign-in, onboarding, and guided first add.
- [ ] Search and select one book, manga, anime, and movie; verify title/cover/synopsis prefill and manual fallback.
- [ ] Search a duplicate query and confirm a cached response; verify the quota fallback after the configured limit.
- [ ] Add one private control entry, then inspect the public URL anonymously to confirm it is absent.
- [ ] Open a public cover detail drawer, generate the Taste Profile, and verify its retry state with the profiler unavailable.
- [ ] Check the featured landing room, owner room, public room, credits page, and all key states at desktop and phone widths.
- [ ] Navigate cover buttons and drawer controls by keyboard; confirm focus visibility and reduced-motion behavior.

## Submission package

- [ ] Push the feature branch and confirm GitHub Actions test/build/container checks pass.
- [ ] Create a Vercel preview and promote the approved build to production.
- [ ] Record a narrated 2–3 minute demo: featured room → sign-up → catalog add → private/public proof → Taste Profiler → credits.
- [ ] Prepare Devpost title, one-sentence pitch, problem, solution, OpenAI/Codex usage, architecture/privacy summary, screenshots, and repository link.
- [ ] Preserve commit history and the Build Week plan as Codex-assisted implementation evidence.
