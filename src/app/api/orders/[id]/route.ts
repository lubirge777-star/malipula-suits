import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/orders/[id] - Get single order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  
  const query = supabase
    .from('orders')
    .select(`
      *,
      order_items(
        id,
        product_name,
        product_type,
        fabric_name,
        quantity,
        unit_price,
        total_price,
        customization,
        special_requests,
        production_notes
      ),
      delivery_address:addresses(*),
      user:users(id, name, email, phone)
    `)
    .eq('id', id);
  
  // Non-admins can only see their own orders
  if (!isAdmin) {
    query.eq('user_id', user.id);
  }
  
  const { data, error } = await query.single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json({ order: data });
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const { status, delivery_status, production_status, notes } = body;
  
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  
  if (status) updates.status = status.toUpperCase();
  if (delivery_status) updates.delivery_status = delivery_status.toUpperCase();
  if (production_status) updates.production_status = production_status.toUpperCase();
  if (notes) updates.notes = notes;
  
  // Set timestamps based on status
  if (status === 'delivered') {
    updates.delivered_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ order: data });
}
