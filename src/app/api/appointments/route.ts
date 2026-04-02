import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/appointments - Get appointments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const upcoming = searchParams.get('upcoming');
  
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
  
  const isAdmin = userData?.role === 'ADMIN';
  
  let query = supabase
    .from('appointments')
    .select(`
      *,
      address:addresses(*),
      user:users(id, name, email, phone)
    `)
    .order('scheduled_at', { ascending: true });
  
  // Non-admins can only see their own appointments
  if (!isAdmin) {
    query = query.eq('user_id', user.id);
  }
  
  if (status) {
    query = query.eq('status', status.toUpperCase());
  }
  
  if (upcoming === 'true') {
    query = query.gte('scheduled_at', new Date().toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ appointments: data });
}

// POST /api/appointments - Create new appointment
export async function POST(request: Request) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const {
    type,
    scheduled_at,
    duration = 60,
    location,
    address_id,
    is_virtual,
    notes,
  } = body;
  
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      user_id: user.id,
      type,
      scheduled_at,
      duration,
      location,
      address_id,
      is_virtual,
      notes,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ appointment: data });
}

// PATCH /api/appointments - Update appointment status (admin only)
export async function PATCH(request: Request) {
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
  
  const body = await request.json();
  const { id, status, notes } = body;
  
  if (!id) {
    return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
  }
  
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  
  if (status) updates.status = status.toUpperCase();
  if (notes !== undefined) updates.notes = notes;
  
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ appointment: data });
}
