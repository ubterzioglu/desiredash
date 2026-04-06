alter table gorevler
add column if not exists assigned_to text;

alter table gorevler
alter column assigned_to set default 'UBT';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gorevler_assigned_to_check'
  ) then
    alter table gorevler
    add constraint gorevler_assigned_to_check
    check (assigned_to in ('Sahin', 'Baran', 'UBT'));
  end if;
end
$$;
