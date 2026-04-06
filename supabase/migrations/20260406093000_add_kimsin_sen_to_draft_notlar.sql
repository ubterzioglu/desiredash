alter table draft_notlar
add column if not exists kimsin_sen text;

update draft_notlar
set kimsin_sen = 'BA'
where kimsin_sen is null;

alter table draft_notlar
alter column kimsin_sen set default 'BA';

alter table draft_notlar
alter column kimsin_sen set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'draft_notlar_kimsin_sen_check'
  ) then
    alter table draft_notlar
    add constraint draft_notlar_kimsin_sen_check
    check (kimsin_sen in ('BA', 'UBT'));
  end if;
end
$$;
