-- ==========================================================
-- PDF STORAGE SETUP (admin view / download)
-- Run this in Supabase → SQL Editor
-- Safe to re-run on an existing project
-- ==========================================================

-- 1) Store public URL of uploaded PDF on teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS pdfurl TEXT;

-- 2) Public bucket for team PDF abstracts (max 10 MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('submissions', 'submissions', true, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3) Storage policies (open — matches current anon-key app access)
DROP POLICY IF EXISTS "Allow public read submissions" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload submissions" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update submissions" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete submissions" ON storage.objects;

CREATE POLICY "Allow public read submissions"
ON storage.objects FOR SELECT
USING (bucket_id = 'submissions');

CREATE POLICY "Allow anon upload submissions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submissions');

CREATE POLICY "Allow anon update submissions"
ON storage.objects FOR UPDATE
USING (bucket_id = 'submissions')
WITH CHECK (bucket_id = 'submissions');

CREATE POLICY "Allow anon delete submissions"
ON storage.objects FOR DELETE
USING (bucket_id = 'submissions');
