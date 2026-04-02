import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/customers - Get all customers (admin only)
export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (userData?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  // Get all customers with their orders
  const { data: customers, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      name,
      phone,
      image,
      role,
      created_at,
      orders (
        id,
        total,
        status,
        created_at
      )
    `)
    .eq('role', 'CUSTOMER')
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ customers });
}
