CREATE TABLE IF NOT EXISTS logo_fikirler (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  kimsin      TEXT        NOT NULL CHECK (kimsin IN ('UBT', 'Baran', 'Sahin')),
  logo_link   TEXT        NOT NULL,
  puan_ubt    SMALLINT    CHECK (puan_ubt BETWEEN 1 AND 10),
  puan_baran  SMALLINT    CHECK (puan_baran BETWEEN 1 AND 10),
  puan_sahin  SMALLINT    CHECK (puan_sahin BETWEEN 1 AND 10),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE logo_fikirler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON logo_fikirler
  FOR ALL
  USING (true)
  WITH CHECK (true);
