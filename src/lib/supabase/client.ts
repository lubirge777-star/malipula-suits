import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  // Return client with placeholders during build/dev if env vars are not available
  return createBrowserClient(supabaseUrl, supabaseAnonKey);

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
