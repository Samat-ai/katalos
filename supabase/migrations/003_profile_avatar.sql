alter table public.profiles add column if not exists avatar text not null default 'girl' check (avatar in ('girl', 'boy'));
