import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/products/[id] - Get single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      items:product_items(
        id, 
        sku, 
        color, 
        size, 
        price_modifier, 
        stock_quantity,
        fabric:fabrics(id, name, color, price_per_meter)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json({ product: data });
}

// PUT /api/products/[id] - Update product
export async function PUT(
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
  const {
    name,
    slug,
    description,
    category_id,
    product_type,
    base_price,
    is_active,
    is_featured,
    is_new,
    thumbnail,
    images,
    tags,
  } = body;
  
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (category_id !== undefined) updates.category_id = category_id || null;
  if (product_type) updates.product_type = product_type;
  if (base_price) updates.base_price = parseFloat(base_price);
  if (is_active !== undefined) updates.is_active = is_active;
  if (is_featured !== undefined) updates.is_featured = is_featured;
  if (is_new !== undefined) updates.is_new = is_new;
  if (thumbnail !== undefined) updates.thumbnail = thumbnail || null;
  if (images !== undefined) updates.images = images || null;
  if (tags !== undefined) updates.tags = tags;
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ product: data });
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
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
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
