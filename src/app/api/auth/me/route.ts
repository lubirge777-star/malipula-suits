import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/auth/me - Get current user
export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ user: null, profile: null });
  }
  
  // Get user profile from public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return NextResponse.json({ 
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || profile?.name,
      image: user.user_metadata?.avatar_url || profile?.image,
    },
    profile,
  });
}
