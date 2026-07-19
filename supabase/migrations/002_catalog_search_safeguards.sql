create table public.catalog_search_cache (
  provider text not null check (provider in ('open_library', 'jikan', 'tmdb')),
  cache_key text not null check (char_length(cache_key) between 3 and 160),
  results jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (provider, cache_key)
);

create table public.catalog_search_limits (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0)
);

alter table public.catalog_search_cache enable row level security;
alter table public.catalog_search_limits enable row level security;

create or replace function public.catalog_get_cached_results(p_provider text, p_cache_key text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select results from public.catalog_search_cache
  where provider = p_provider and cache_key = p_cache_key and expires_at > now()
$$;

create or replace function public.catalog_put_cached_results(p_provider text, p_cache_key text, p_results jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.catalog_search_cache (provider, cache_key, results, expires_at)
  values (p_provider, p_cache_key, p_results, now() + interval '24 hours')
  on conflict (provider, cache_key) do update set results = excluded.results, expires_at = excluded.expires_at, created_at = now()
$$;

create or replace function public.catalog_consume_quota()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_limit public.catalog_search_limits%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into current_limit from public.catalog_search_limits where profile_id = auth.uid() for update;
  if not found then
    insert into public.catalog_search_limits (profile_id, request_count) values (auth.uid(), 1);
    return true;
  end if;
  if current_limit.window_started_at <= now() - interval '1 minute' then
    update public.catalog_search_limits set window_started_at = now(), request_count = 1 where profile_id = auth.uid();
    return true;
  end if;
  if current_limit.request_count >= 10 then return false; end if;
  update public.catalog_search_limits set request_count = request_count + 1 where profile_id = auth.uid();
  return true;
end;
$$;

grant execute on function public.catalog_get_cached_results(text, text) to authenticated;
grant execute on function public.catalog_put_cached_results(text, text, jsonb) to authenticated;
grant execute on function public.catalog_consume_quota() to authenticated;
