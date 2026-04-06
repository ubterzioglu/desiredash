create table if not exists dosya_linkler (
  id uuid default gen_random_uuid() primary key,
  baslik text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

alter table dosya_linkler enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'dosya_linkler' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on dosya_linkler for all using (true) with check (true)';
  end if;
end
$$;
