import { NextResponse } from 'next/server';
import { getCatalogDetails } from '@/lib/catalog/provider';
import { CatalogDetailsRequestSchema } from '@/lib/catalog/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const parsed = CatalogDetailsRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid catalog item.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to use catalog details.' }, { status: 401 });
  try {
    const { type, ...candidate } = parsed.data;
    const prefill = await getCatalogDetails(candidate, type, { openLibraryContact: process.env.OPEN_LIBRARY_CONTACT_EMAIL ?? 'contact@example.com', tmdbToken: process.env.TMDB_READ_ACCESS_TOKEN });
    return NextResponse.json({ prefill });
  } catch {
    return NextResponse.json({ error: 'Details are unavailable. You can add this item manually.', manualFallback: true }, { status: 503 });
  }
}
