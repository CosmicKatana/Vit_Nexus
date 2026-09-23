import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fqfzygubyjqkimsphmdn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZnp5Z3VieWpxa2ltc3BobWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzQwMDYsImV4cCI6MjEwNTQ1MDAwNn0.k0T2HEH8cJlrQvxHWU4lcImLgtcXKGTAaowKyNDg1gI';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return client;
  } catch (error) {
    console.warn('Could not initialize Supabase client:', error);
    return null;
  }
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
