alter table draft_notlar
add column if not exists classification text;

update draft_notlar
set classification = 'BK'
where classification is null;

alter table draft_notlar
alter column classification set default 'BK';

alter table draft_notlar
alter column classification set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'draft_notlar_classification_check'
  ) then
    alter table draft_notlar
    add constraint draft_notlar_classification_check
    check (classification in ('BK', 'SY', 'UBT'));
  end if;
end
$$;
