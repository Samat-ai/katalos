export type SupabaseEnvironment = Record<string, string | undefined>;

export function getSupabaseConfig(environment: SupabaseEnvironment = process.env) {
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL.');
  if (!anonKey) throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  return { url, anonKey };
}
