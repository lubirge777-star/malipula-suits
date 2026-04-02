import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a mock client during build/prerender if env vars are not available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set. Using mock client.');
    return null as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton pattern for client-side
let client: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
