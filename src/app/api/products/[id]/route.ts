import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/products/[id] - Get single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // MOCK DATA for local testing
  const mockProducts: Record<string, any> = {
    'p1': {
      id: 'p1',
      name: 'Royal Navy Three-Piece Suit',
      slug: 'royal-navy-three-piece-suit',
      description: 'A masterpiece of sartorial elegance. Hand-crafted from premium wool, this navy suit features a tailored fit, peaked lapels, and a matching double-breasted waistcoat. Perfect for weddings, galas, and high-stakes business meetings.',
      base_price: 850000,
      thumbnail: '/images/malipula/service1.jpg',
      images: ['/images/malipula/service1.jpg', '/images/malipula/service2.jpg'],
      product_type: 'SUIT',
      category: { id: 'c1', name: 'Suits', slug: 'suits' },
      items: [
        { id: 'i1', sku: 'MS-RN-3P-48', color: 'Navy', size: '48', price_modifier: 0, stock_quantity: 5 },
        { id: 'i2', sku: 'MS-RN-3P-50', color: 'Navy', size: '50', price_modifier: 0, stock_quantity: 3 }
      ]
    },
    'p2': {
      id: 'p2',
      name: 'Classic Charcoal Blazer',
      slug: 'classic-charcoal-blazer',
      description: 'The ultimate versatile piece for your wardrobe. This charcoal blazer transition seamlessly from office to evening events.',
      base_price: 420000,
      thumbnail: '/images/malipula/service2.jpg',
      images: ['/images/malipula/service2.jpg'],
      product_type: 'SUIT',
      category: { id: 'c1', name: 'Suits', slug: 'suits' },
      items: [{ id: 'i3', sku: 'MS-CC-BL-48', color: 'Charcoal', size: '48', price_modifier: 0, stock_quantity: 10 }]
    },
    'p3': {
      id: 'p3',
      name: 'Premium Egyptian Cotton Shirt',
      slug: 'premium-egyptian-cotton-shirt',
      description: 'Experience the breathability and softness of authentic Egyptian cotton. Our signature white shirt is a staple for the modern gentleman.',
      base_price: 150000,
      thumbnail: '/images/malipula/team1.jpg',
      images: ['/images/malipula/team1.jpg'],
      product_type: 'SHIRT',
      category: { id: 'c1', name: 'Shirts', slug: 'shirts' },
      items: [{ id: 'i4', sku: 'MS-EC-SH-M', color: 'White', size: 'M', price_modifier: 0, stock_quantity: 20 }]
    }
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    const product = mockProducts[id] || mockProducts['p1'];
    return NextResponse.json({ product });
  }

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
