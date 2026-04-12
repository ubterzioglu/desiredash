create table if not exists todo_items (
  id uuid primary key default gen_random_uuid(),
  konu text not null,
  kim text not null default 'Atanmadi',
  ne_zaman date,
  ayrinti text,
  durum text not null default 'Baslanmadi',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint todo_items_kim_check
    check (kim in ('Atanmadi', 'UBT', 'Baran', 'Sahin')),
  constraint todo_items_durum_check
    check (durum in ('Baslanmadi', 'Beklemede', 'Devam ediyor', 'Tamamlandi'))
);

create or replace function public.set_todo_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_todo_items_updated_at on todo_items;

create trigger set_todo_items_updated_at
before update on todo_items
for each row
execute function public.set_todo_items_updated_at();

alter table todo_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'todo_items' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on todo_items for all using (true) with check (true)';
  end if;
end
$$;

insert into todo_items (konu, kim, ne_zaman, ayrinti, durum) values
  ('DB Design', 'Atanmadi', null, 'Teknik yapilacaklar blogundan tasindi.', 'Baslanmadi'),
  ('Security / Backend Mimarisi', 'Atanmadi', null, 'Teknik yapilacaklar blogundan tasindi.', 'Baslanmadi'),
  ('JS / TS kurslarini bitir', 'Atanmadi', null, 'Egitim blogundan tasindi.', 'Baslanmadi'),
  ('Rezervasyon', 'Atanmadi', null, 'Operasyonel basliklardan tasindi.', 'Baslanmadi'),
  ('Admin paneli', 'Atanmadi', null, 'Operasyonel basliklardan tasindi.', 'Baslanmadi'),
  ('Nested UI (isletmelerden veri cekme)', 'Atanmadi', null, 'Operasyonel basliklardan tasindi.', 'Baslanmadi'),
  ('Yasal surecler', 'Atanmadi', null, 'Operasyonel basliklardan tasindi.', 'Baslanmadi');
