/**
 * Supabase Database Types
 *
 * Kept intentionally loose so inserts/updates work across lowercase
 * column schemas. Regenerate with `supabase gen types typescript`
 * when the project is linked for stricter typing.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = Record<string, any>;
