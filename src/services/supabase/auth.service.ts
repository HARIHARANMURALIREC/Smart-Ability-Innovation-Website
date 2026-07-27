/**
 * Supabase Authentication Service
 *
 * NOTE: The app currently authenticates via AuthContext (teams table +
 * hardcoded admin). These helpers are available if you migrate to
 * Supabase Auth later — they are not used by login/register pages yet.
 *
 * @module services/supabase/auth.service
 */

import { supabase } from '@/config/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role?: 'student' | 'admin';
}

export interface SignInInput {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(input: SignUpInput): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          role: input.role || 'student',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign up failed';
    return { user: null, error: message };
  }
}

/**
 * Sign in user
 */
export async function signIn(input: SignInInput): Promise<{ session: Session | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return { session: null, error: error.message };
    }

    return { session: data.session, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign in failed';
    return { session: null, error: message };
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign out failed';
    return { error: message };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Password reset failed';
    return { error: message };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Password update failed';
    return { error: message };
  }
}

/**
 * Subscribe to auth changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
