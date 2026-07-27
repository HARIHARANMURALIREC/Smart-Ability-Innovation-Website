/**
 * Supabase Team Members Service
 * Handles team_members table operations (lowercase columns)
 */

import { supabase } from '@/config/supabase';
import { uid } from '@/utils';
import type { TeamMember } from '@/types';

export interface DbTeamMember {
  id: string;
  team_id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  status?: string;
  joined_at?: string | null;
}

export async function addTeamMember(input: {
  teamId: string;
  member: TeamMember;
  id?: string;
}): Promise<{ member: DbTeamMember | null; error: string | null }> {
  try {
    const row = {
      id: input.id || uid('member'),
      team_id: input.teamId,
      name: input.member.name,
      email: input.member.email.trim().toLowerCase(),
      department: input.member.department,
      year: String(input.member.year),
      status: 'accepted',
      joined_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('team_members').insert([row]).select().single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data as DbTeamMember, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add team member';
    return { member: null, error: message };
  }
}

export async function getTeamMembers(
  teamId: string
): Promise<{ members: DbTeamMember[] | null; error: string | null }> {
  try {
    let { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('createdat', { ascending: true });

    if (error && /column|schema cache|Could not find|42703/i.test(error.message)) {
      ({ data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true }));
    }

    if (error) {
      ({ data, error } = await supabase.from('team_members').select('*').eq('team_id', teamId));
    }

    if (error) {
      return { members: null, error: error.message };
    }

    return { members: (data || []) as DbTeamMember[], error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team members';
    return { members: null, error: message };
  }
}

export async function getTeamMemberById(
  memberId: string
): Promise<{ member: DbTeamMember | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data as DbTeamMember, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team member';
    return { member: null, error: message };
  }
}

export async function updateTeamMember(
  memberId: string,
  updates: Partial<DbTeamMember>
): Promise<{ member: DbTeamMember | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      return { member: null, error: error.message };
    }

    return { member: data as DbTeamMember, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update team member';
    return { member: null, error: message };
  }
}

export async function removeTeamMember(memberId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove team member';
    return { error: message };
  }
}

export async function acceptInvitation(
  memberId: string
): Promise<{ member: DbTeamMember | null; error: string | null }> {
  return updateTeamMember(memberId, {
    status: 'accepted',
    joined_at: new Date().toISOString(),
  });
}

export async function rejectInvitation(memberId: string): Promise<{ error: string | null }> {
  const { error } = await updateTeamMember(memberId, { status: 'rejected' });
  return { error };
}

export async function getMemberStats(teamId: string): Promise<{
  totalMembers: number;
  acceptedMembers: number;
  pendingMembers: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('status')
      .eq('team_id', teamId);

    if (error) {
      return { totalMembers: 0, acceptedMembers: 0, pendingMembers: 0, error: error.message };
    }

    const accepted = data?.filter((m: any) => m.status === 'accepted').length || 0;
    const total = data?.length || 0;

    return {
      totalMembers: total,
      acceptedMembers: accepted,
      pendingMembers: total - accepted,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch member stats';
    return { totalMembers: 0, acceptedMembers: 0, pendingMembers: 0, error: message };
  }
}
