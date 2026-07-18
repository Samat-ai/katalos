# Supabase verification

1. Apply `migrations/001_initial_schema.sql` in the Supabase SQL editor.
2. As an authenticated owner, create, update, and delete only rows whose `profile_id` matches the signed-in user.
3. In an anonymous browser session, confirm a public entry can be selected.
4. In the same anonymous session, confirm a private entry cannot be selected.
