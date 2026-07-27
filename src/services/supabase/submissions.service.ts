/**
 * Supabase Submissions Service
 */

import { supabase } from '@/config/supabase';
import { uid } from '@/utils';

export async function createSubmission(input: {
  teamId: string;
  projectId?: string | null;
  pdfName?: string | null;
  fileUrl?: string | null;
  status?: string;
  id?: string;
}): Promise<{ submission: any | null; error: string | null }> {
  try {
    const lower = {
      id: input.id || uid('sub'),
      team_id: input.teamId,
      project_id: input.projectId ?? null,
      pdfname: input.pdfName ?? null,
      fileurl: input.fileUrl ?? null,
      status: input.status || 'submitted',
      submittedat: new Date().toISOString(),
    };

    let { data, error } = await supabase.from('submissions').insert([lower]).select().single();

    if (error && /column|schema cache|Could not find|42703/i.test(error.message)) {
      ({ data, error } = await supabase
        .from('submissions')
        .insert([
          {
            id: lower.id,
            team_id: lower.team_id,
            project_id: lower.project_id,
            pdfName: lower.pdfname,
            fileUrl: lower.fileurl,
            status: lower.status,
            submittedAt: lower.submittedat,
          },
        ])
        .select()
        .single());
    }

    // Project FK may reject frontend abstract IDs (ps_001) — retry without project_id
    if (error && /foreign key|project/i.test(error.message)) {
      const { project_id: _p, ...withoutProject } = lower;
      ({ data, error } = await supabase
        .from('submissions')
        .insert([{ ...withoutProject, project_id: null }])
        .select()
        .single());
    }

    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create submission';
    return { submission: null, error: message };
  }
}

export async function getSubmissionsByTeam(teamId: string): Promise<{
  submissions: any[] | null;
  error: string | null;
}> {
  try {
    let { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .order('createdat', { ascending: false });

    if (error) {
      ({ data, error } = await supabase.from('submissions').select('*').eq('team_id', teamId));
    }

    if (error) return { submissions: null, error: error.message };
    return { submissions: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submissions';
    return { submissions: null, error: message };
  }
}

export async function getAllSubmissions(): Promise<{
  submissions: any[] | null;
  error: string | null;
}> {
  try {
    let { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      ({ data, error } = await supabase.from('submissions').select('*'));
    }

    if (error) return { submissions: null, error: error.message };
    return { submissions: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submissions';
    return { submissions: null, error: message };
  }
}

export async function getSubmissionById(submissionId: string): Promise<{
  submission: any | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submission';
    return { submission: null, error: message };
  }
}

export async function updateSubmission(
  submissionId: string,
  updates: Record<string, unknown>
): Promise<{ submission: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', submissionId)
      .select()
      .single();
    if (error) return { submission: null, error: error.message };
    return { submission: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update submission';
    return { submission: null, error: message };
  }
}

export async function submitSubmission(submissionId: string): Promise<{
  submission: any | null;
  error: string | null;
}> {
  return updateSubmission(submissionId, {
    status: 'submitted',
    submittedat: new Date().toISOString(),
  });
}

export async function evaluateSubmission(
  submissionId: string,
  score: number,
  feedback: string
): Promise<{ submission: any | null; error: string | null }> {
  return updateSubmission(submissionId, {
    status: 'evaluated',
    score,
    feedback,
    evaluatedat: new Date().toISOString(),
  });
}

export async function getSubmissionStats(): Promise<{
  totalSubmissions: number;
  draftSubmissions: number;
  submittedSubmissions: number;
  evaluatedSubmissions: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.from('submissions').select('status');

    if (error) {
      return {
        totalSubmissions: 0,
        draftSubmissions: 0,
        submittedSubmissions: 0,
        evaluatedSubmissions: 0,
        error: error.message,
      };
    }

    return {
      totalSubmissions: data?.length || 0,
      draftSubmissions: data?.filter((s: any) => s.status === 'draft').length || 0,
      submittedSubmissions: data?.filter((s: any) => s.status === 'submitted').length || 0,
      evaluatedSubmissions: data?.filter((s: any) => s.status === 'evaluated').length || 0,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submission stats';
    return {
      totalSubmissions: 0,
      draftSubmissions: 0,
      submittedSubmissions: 0,
      evaluatedSubmissions: 0,
      error: message,
    };
  }
}
