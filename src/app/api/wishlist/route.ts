import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    thumbnail: string | null;
    product_type: string;
    is_active: boolean;
  } | null;
}

// Helper: safely get Supabase client, returning null if unavailable
async function getSupabase() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    return await createClient();
  } catch {
    return null;
  }
}

// GET /api/wishlist - Get user's wishlist items
export async function GET() {
  const supabase = await getSupabase();

  if (!supabase) {
    // Supabase not configured — return empty wishlist with helpful hint
    return NextResponse.json({
      wishlist: [],
      total: 0,
      _meta: { source: 'mock', message: 'Supabase is not configured. Returning empty wishlist.' },
    });
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ wishlist: [], total: 0 });
  }

  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      id,
      user_id,
      product_id,
      created_at,
      product:products(
        id,
        name,
        slug,
        base_price,
        thumbnail,
        product_type,
        is_active
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist:', error.message);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }

  const items = (data ?? []) as unknown as WishlistItem[];
  const total = items.length;

  return NextResponse.json({ wishlist: items, total });
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: Request) {
  const supabase = await getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Wishlist service unavailable. Supabase is not configured.' },
      { status: 503 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { product_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { product_id } = body;

  if (!product_id) {
    return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
  }

  // Check if already in wishlist to avoid duplicates
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { message: 'Item already in wishlist', item: existing },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from('wishlists')
    .insert({
      user_id: user.id,
      product_id,
    })
    .select(`
      id,
      user_id,
      product_id,
      created_at,
      product:products(
        id,
        name,
        slug,
        base_price,
        thumbnail,
        product_type,
        is_active
      )
    `)
    .single();

  if (error) {
    console.error('Error adding to wishlist:', error.message);
    return NextResponse.json({ error: 'Failed to add item to wishlist' }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}

// DELETE /api/wishlist - Clear entire wishlist for the authenticated user
export async function DELETE() {
  const supabase = await getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Wishlist service unavailable. Supabase is not configured.' },
      { status: 503 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error clearing wishlist:', error.message);
    return NextResponse.json({ error: 'Failed to clear wishlist' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Wishlist cleared' });
}
