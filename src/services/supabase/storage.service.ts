/**
 * Supabase Storage — team PDF submissions
 */

import { supabase } from '@/config/supabase';

export const SUBMISSIONS_BUCKET = 'submissions';

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

export async function uploadTeamPdf(
  teamId: string,
  file: File,
): Promise<{ path: string | null; publicUrl: string | null; error: string | null }> {
  try {
    const safeName = sanitizeFileName(file.name);
    const path = `${teamId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage.from(SUBMISSIONS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf',
    });

    if (error) {
      return { path: null, publicUrl: null, error: error.message };
    }

    const { data } = supabase.storage.from(SUBMISSIONS_BUCKET).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload PDF';
    return { path: null, publicUrl: null, error: message };
  }
}

export function getTeamPdfPublicUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const { data } = supabase.storage.from(SUBMISSIONS_BUCKET).getPublicUrl(pathOrUrl);
  return data.publicUrl;
}
