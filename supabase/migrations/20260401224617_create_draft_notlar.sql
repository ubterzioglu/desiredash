create table if not exists draft_notlar (
  id uuid default gen_random_uuid() primary key,
  icerik text not null,
  created_at timestamp with time zone default now()
);

alter table draft_notlar enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'draft_notlar' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on draft_notlar for all using (true) with check (true)';
  end if;
end
$$;
