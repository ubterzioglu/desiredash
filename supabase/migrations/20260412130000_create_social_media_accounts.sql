create table if not exists social_media_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  hesap_adi text not null,
  link text not null unique,
  takipci_sayisi bigint,
  son_kontrol_at timestamp with time zone,
  durum text not null default 'Hazir',
  yorumlar text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint social_media_accounts_platform_check
    check (platform in ('instagram', 'tiktok', 'youtube', 'x', 'other')),
  constraint social_media_accounts_durum_check
    check (durum in ('Hazir', 'Guncel', 'Desteklenmiyor', 'Engellendi', 'Hata'))
);

create or replace function public.set_social_media_accounts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_social_media_accounts_updated_at on social_media_accounts;

create trigger set_social_media_accounts_updated_at
before update on social_media_accounts
for each row
execute function public.set_social_media_accounts_updated_at();

alter table social_media_accounts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'social_media_accounts'
      and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on social_media_accounts for all using (true) with check (true)';
  end if;
end
$$;
