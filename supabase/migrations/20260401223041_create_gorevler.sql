create table if not exists gorevler (
  id uuid default gen_random_uuid() primary key,
  gorev text,
  durum text default 'Başlanmadı',
  atanan text,
  baslangic date,
  bitis date,
  aciklama text,
  link text,
  created_at timestamp with time zone default now()
);

alter table gorevler enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'gorevler' and policyname = 'Allow all'
  ) then
    execute 'create policy "Allow all" on gorevler for all using (true) with check (true)';
  end if;
end
$$;

insert into gorevler (gorev, durum, atanan, baslangic, bitis, aciklama, link) values
  ('Dij. Paz. Planı',                                             'Başlanmadı', null, null, null, null, 'https://www.notion.so/Dij-Paz-Plan-33297e96537280169ae2c4635cbabda9'),
  ('Lansman Planı',                                               'Başlanmadı', null, null, null, null, 'https://www.notion.so/Lansman-Plan-33297e96537280bcbaccfd8a0941960b'),
  ('Gelir Modelleri Projeksiyonları',                             'Başlanmadı', null, null, null, null, 'https://www.notion.so/Gelir-Modelleri-Projeksiyonlar-33297e96537280d29b45cc2910c0ef25'),
  ('Bütçe Projeksiyon',                                           'Başlanmadı', null, null, null, null, 'https://www.notion.so/B-t-e-Projeksiyon-33297e965372801d8e3cf5e6d6984eaf'),
  ('17 Marta kadar MVP v2.0 dökümanları karşılıklı gönderilecek', 'Bekliyor',   null, null, '2025-03-17', null, 'https://www.notion.so/17-Marta-kadar-mvp-v2-0-d-k-manlanlar-kar-l-kl-g-nderilecek-32d97e965372806a8842da0d41c5367e'),
  ('Cap Table Çalışması',                                         'Başlanmadı', null, null, null, null, 'https://www.notion.so/Cap-Table-al-mas-33297e96537280249223d0cb987b6c4c'),
  ('Ambassador Çalışma Mantığı + Lovable Mock',                   'Başlanmadı', null, null, null, null, 'https://www.notion.so/Ambassador-al-ma-Mant-Lovable-Mock-33297e96537280ddb636d6274ddc5492'),
  ('Proje Yönetimi Dosyası',                                      'Başlanmadı', null, null, null, null, 'https://www.notion.so/Proje-Y-netimi-Dosyas-33297e965372807ab63ed3a1f440d167'),
  ('Ekip Datası',                                                 'Başlanmadı', null, null, null, null, 'https://www.notion.so/Ekip-Datas-33297e96537280aead54d39c1bcac713');
