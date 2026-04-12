create table if not exists contact_items (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  telefon text,
  websitesi text,
  tur text,
  sorumlu text,
  durum text,
  yorumlar text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create or replace function public.set_contact_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_contact_items_updated_at on contact_items;

create trigger set_contact_items_updated_at
before update on contact_items
for each row
execute function public.set_contact_items_updated_at();

alter table contact_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'contact_items' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on contact_items for all using (true) with check (true)';
  end if;
end
$$;

insert into contact_items (contact, telefon, websitesi, tur, sorumlu, durum, yorumlar) values
  ('Baran Kaplan', null, null, 'Paydas', null, 'Aktif', 'Mevcut contacts blogundan tasindi.'),
  ('Sahin', null, null, 'Paydas', null, 'Aktif', 'Mevcut contacts blogundan tasindi.'),
  ('UBT', null, null, 'Kurum', null, 'Aktif', 'Mevcut contacts blogundan tasindi.');
