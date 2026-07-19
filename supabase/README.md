# Supabase verification

1. Apply `migrations/001_initial_schema.sql`, then `migrations/002_catalog_search_safeguards.sql`, in the Supabase SQL editor.
2. As an authenticated owner, create, update, and delete only rows whose `profile_id` matches the signed-in user.
3. In an anonymous browser session, confirm a public entry can be selected.
4. In the same anonymous session, confirm a private entry cannot be selected.
5. As an authenticated owner, search the catalog twice for the same title and confirm the second request returns `cached: true` without contacting the provider.
6. Make eleven distinct catalog requests within one minute and confirm the eleventh receives a `429` response with a manual-entry fallback.
7. Confirm anonymous users cannot read or write `catalog_search_cache` or `catalog_search_limits` directly.
