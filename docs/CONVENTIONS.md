# Katalos conventions

These rules keep Katalos safe to share: a public room must never reveal private entries, and a browser must never receive privileged credentials.

## Structure and boundaries

| Responsibility | Location |
| --- | --- |
| Routes, route handlers, and route-level composition | `app/` |
| Reusable presentational UI | `components/` |
| Domain types, Zod schemas, mapping, Supabase clients, and service clients | `lib/` |
| Database schema and RLS | `supabase/migrations/` |
| ADC-authenticated Gemini service | `cloud-run-taste-profiler/` |

- Keep route handlers thin: validate → authorize/query → call a focused helper or service → serialize. This makes authorization and response behavior auditable.
- Components render state and call route-level APIs; they do not make Supabase persistence or AI-provider calls directly. This keeps server credentials and policy decisions out of reusable UI.
- Keep database/API translations in typed mapping functions such as `lib/media/serialization.ts`. Database column names should not leak through the UI.
- Add pure domain logic, schemas, and server-to-server clients in `lib/`, with a focused Vitest file beside each new pure module. The most security-sensitive rules should remain easy to test without a browser or database.

## Validation, auth, and privacy

- Validate every browser and service boundary with Zod. Validate before touching Supabase or Gemini, and return a stable error shape for invalid input.
- Use the authenticated Supabase user ID for all owner mutations. Never trust a profile ID submitted by a browser.
- Public routes and the Taste Profile route must explicitly request `visibility = 'public'`, even though RLS also enforces it. Defense in depth prevents an accidental private-data regression.
- The Taste Profile service receives only bounded, sanitized public fields. Do not send private notes, IDs, owner data, cookies, or Supabase credentials to Cloud Run.
- Keep all secrets server-only. `TASTE_PROFILER_SHARED_TOKEN` belongs only in Vercel and Cloud Run; Google credentials come from Cloud Run's attached service account via ADC, never from a downloaded key.
- Profile language is spoiler-safe and must not infer sensitive traits. `firstPick.title` must be one of the supplied public titles.

## Testing and delivery

- Write the failing test before adding a pure behavior or regression fix, then make the smallest change that passes it.
- Run `npm run test` and `npm run build` before handing work off. Test the deployed public URL in an anonymous session whenever auth or privacy changes.
- Use conventional commits and preserve unrelated worktree changes. Never commit `.env.local`, copied service-account keys, or generated build output.