/**
 * Supabase Configuration
 * Initializes Supabase client with environment variables
 * 
 * @module config/supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// CRITICAL: Remove /rest/v1 from URL if present - Supabase client adds it automatically
if (supabaseUrl.includes('/rest/v1')) {
  console.warn('⚠️ [Supabase Config] URL contains /rest/v1 suffix. Removing it...');
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?/g, '');
  console.log('✅ [Supabase Config] Corrected URL:', supabaseUrl);
}

// Normalize trailing slash
supabaseUrl = supabaseUrl.replace(/\/+$/, '');

console.log('🔧 [Supabase Config] Initializing with URL:', supabaseUrl);

/**
 * Supabase client instance
 * Used for all database operations
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storageKey: 'hackathon-portal-auth',
      storage: localStorage,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Export Supabase types for use throughout the application
 */
export type { Database } from '@/types/supabase';
export type { Session, User } from '@supabase/supabase-js';
