create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  kim_ekledi text not null check (kim_ekledi in ('Şahin', 'UBT', 'Baran', 'Diğer')),
  kim_ekledi_custom text,
  aciklama text not null,
  link text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create or replace function public.set_links_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_links_updated_at on links;

create trigger set_links_updated_at
before update on links
for each row
execute function public.set_links_updated_at();

alter table links enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'links' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on links for all using (true) with check (true)';
  end if;
end
$$;
