-- Add durum_dm and durum_customer columns to contact_items
-- Original 'durum' column is preserved for data safety but excluded from UI

ALTER TABLE contact_items
  ADD COLUMN IF NOT EXISTS durum_dm TEXT,
  ADD COLUMN IF NOT EXISTS durum_customer TEXT;
