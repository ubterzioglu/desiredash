CREATE TABLE IF NOT EXISTS mvp_item_tags (
  item_id   TEXT        PRIMARY KEY,
  tag       TEXT        NOT NULL CHECK (tag IN ('MVP1', 'MVP2', 'MVP3')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
