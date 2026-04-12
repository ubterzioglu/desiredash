CREATE TABLE IF NOT EXISTS son_guncellemeler (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  metin      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE son_guncellemeler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON son_guncellemeler
  FOR ALL
  USING (true)
  WITH CHECK (true);
