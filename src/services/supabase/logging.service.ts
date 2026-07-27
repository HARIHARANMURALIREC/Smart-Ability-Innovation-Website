/**
 * Supabase Activity Logging Service
 */
import { supabase } from '@/config/supabase';
import { uid } from '@/utils';

export interface ActivityLog {
  id?: string;
  action: string;
  description?: string;
  metadata?: Record<string, any>;
  userEmail?: string;
}

export async function logActivity(log: ActivityLog): Promise<{ error: string | null }> {
  try {
    const row = {
      id: log.id || uid('log'),
      action: log.action,
      description: log.description || '',
      metadata: {
        ...(log.metadata || {}),
        ...(log.userEmail ? { userEmail: log.userEmail } : {}),
      },
    };

    const { error } = await supabase.from('activity_logs').insert(row);
    if (error) {
      console.error('❌ Failed to log activity:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to log activity';
    return { error: message };
  }
}

export async function getActivityLogs(limit = 100) {
  try {
    let { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('createdat', { ascending: false })
      .limit(limit);

    if (error) {
      ({ data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(limit));
    }
    if (error) {
      ({ data, error } = await supabase.from('activity_logs').select('*').limit(limit));
    }

    if (error) return { logs: null, error: error.message };
    return { logs: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity logs';
    return { logs: null, error: message };
  }
}

export async function getActivityLogsByAction(action: string, limit = 50) {
  try {
    let { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('createdat', { ascending: false })
      .limit(limit);

    if (error) {
      ({ data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', action)
        .limit(limit));
    }

    if (error) return { logs: null, error: error.message };
    return { logs: data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity logs';
    return { logs: null, error: message };
  }
}

export async function getActivityLogsByUser(userEmail: string, limit = 50) {
  try {
    const { logs, error } = await getActivityLogs(Math.max(limit * 3, 100));
    if (error || !logs) return { logs: null, error };

    const needle = userEmail.trim().toLowerCase();
    const filtered = logs
      .filter((row: any) => {
        const hay = `${JSON.stringify(row.metadata || {})} ${row.description || ''}`.toLowerCase();
        return hay.includes(needle);
      })
      .slice(0, limit);

    return { logs: filtered, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity logs';
    return { logs: null, error: message };
  }
}

export async function clearActivityLogs() {
  try {
    const { error } = await supabase.from('activity_logs').delete().neq('id', '');
    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clear activity logs';
    return { error: message };
  }
}

export async function getActivityStats() {
  try {
    const { data, error } = await supabase.from('activity_logs').select('action');

    if (error) {
      return { totalRegistrations: 0, totalErrors: 0, totalUploads: 0, error: error.message };
    }

    return {
      totalRegistrations: data?.filter((x: any) => x.action === 'team_registered').length ?? 0,
      totalErrors: data?.filter((x: any) => String(x.action).includes('error')).length ?? 0,
      totalUploads: data?.filter((x: any) => x.action === 'pdf_uploaded').length ?? 0,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity stats';
    return { totalRegistrations: 0, totalErrors: 0, totalUploads: 0, error: message };
  }
}
