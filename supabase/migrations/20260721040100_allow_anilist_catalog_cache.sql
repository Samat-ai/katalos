alter table public.catalog_search_cache
  drop constraint catalog_search_cache_provider_check,
  add constraint catalog_search_cache_provider_check check (provider in ('open_library', 'jikan', 'anilist', 'tmdb'));
