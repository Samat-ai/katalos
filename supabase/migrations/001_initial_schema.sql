create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,32}$'),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.media_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  type text not null check (type in ('book', 'manga', 'anime', 'movie')),
  status text not null check (status in ('planned', 'in_progress', 'finished', 'abandoned')),
  cover_url text,
  synopsis text not null default '',
  rating integer check (rating between 1 and 5),
  note text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_entries_profile_created_idx on public.media_entries (profile_id, created_at desc);
create index media_entries_visibility_idx on public.media_entries (visibility);

alter table public.profiles enable row level security;
alter table public.media_entries enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "owners manage own profiles" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
-- Owners may create/update/delete only records associated with auth.uid().
create policy "owners manage own entries" on public.media_entries for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
-- Anonymous users may select public rows only; private rows remain invisible.
create policy "public reads public entries" on public.media_entries for select using (visibility = 'public');
