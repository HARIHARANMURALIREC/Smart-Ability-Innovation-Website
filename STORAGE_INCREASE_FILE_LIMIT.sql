-- Increase submissions bucket max file size to 10 MB
-- Run in Supabase → SQL Editor (required after raising app upload limit)
-- Safe to re-run

UPDATE storage.buckets
SET file_size_limit = 10485760
WHERE id = 'submissions';

-- If the bucket does not exist yet, create it with the new limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('submissions', 'submissions', true, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  public = EXCLUDED.public;
