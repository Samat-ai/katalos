create or replace function public.reject_duplicate_media_entry()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(format('%s:%s:%s', new.profile_id, new.type, lower(btrim(new.title))), 0));

  if exists (
    select 1
    from public.media_entries
    where profile_id = new.profile_id
      and type = new.type
      and lower(btrim(title)) = lower(btrim(new.title))
      and id is distinct from new.id
  ) then
    raise exception using errcode = 'P0001', message = 'duplicate_media_entry';
  end if;

  return new;
end;
$$;

create trigger reject_duplicate_media_entry
before insert or update of profile_id, type, title on public.media_entries
for each row execute function public.reject_duplicate_media_entry();
