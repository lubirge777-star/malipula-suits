import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/products - Get all products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const isNew = searchParams.get('new');
  const limit = searchParams.get('limit');
  
  // MOCK DATA for local testing without Supabase
  const mockProducts = [
    {
      id: 'p1',
      name: 'Royal Navy Three-Piece Suit',
      slug: 'royal-navy-three-piece-suit',
      base_price: 850000,
      thumbnail: '/images/malipula/service1.jpg',
      is_new: true,
      is_featured: true,
      product_type: 'SUIT',
      category: { name: 'Suits', slug: 'suits' }
    },
    {
      id: 'p2',
      name: 'Classic Charcoal Blazer',
      slug: 'classic-charcoal-blazer',
      base_price: 420000,
      thumbnail: '/images/malipula/service2.jpg',
      is_new: false,
      is_featured: true,
      product_type: 'SUIT',
      category: { name: 'Suits', slug: 'suits' }
    },
    {
      id: 'p3',
      name: 'Premium Egyptian Cotton Shirt',
      slug: 'premium-egyptian-cotton-shirt',
      base_price: 150000,
      thumbnail: '/images/malipula/team1.jpg',
      is_new: true,
      is_featured: false,
      product_type: 'SHIRT',
      category: { name: 'Shirts', slug: 'shirts' }
    }
  ];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    console.warn('Using mock products (Supabase keys missing)');
    return NextResponse.json({ products: mockProducts });
  }

  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      items:product_items(id, sku, color, size, price_modifier, stock_quantity)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }
  
  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }
  
  if (isNew === 'true') {
    query = query.eq('is_new', true);
  }
  
  if (limit) {
    query = query.limit(parseInt(limit));
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ products: data });
}

// POST /api/products - Create new product
export async function POST(request: Request) {
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
    is_active = true,
    is_featured = false,
    is_new = false,
    thumbnail,
    images,
    tags,
  } = body;
  
  if (!name || !base_price || !product_type) {
    return NextResponse.json(
      { error: 'Missing required fields: name, base_price, product_type' },
      { status: 400 }
    );
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      category_id: category_id || null,
      product_type,
      base_price: parseFloat(base_price),
      is_active,
      is_featured,
      is_new,
      thumbnail: thumbnail || null,
      images: images || null,
      tags,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ product: data });
}
