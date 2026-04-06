import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface CartItem {
  id: string;
  quantity: number;
  customization: string | null;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    thumbnail: string | null;
    product_type: string;
  } | null;
  product_item: {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    price_modifier: number;
  } | null;
  fabric: {
    id: string;
    name: string;
    color: string | null;
    price_per_meter: number;
  } | null;
}

// GET /api/cart - Get user's cart
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return NextResponse.json({ cart: [], count: 0, total: 0 });
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ cart: [], total: 0 });
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      customization,
      created_at,
      product:products(
        id,
        name,
        slug,
        base_price,
        thumbnail,
        product_type
      ),
      product_item:product_items(
        id,
        sku,
        color,
        size,
        price_modifier
      ),
      fabric:fabrics(
        id,
        name,
        color,
        price_per_meter
      )
    `)
    .eq('user_id', user.id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Calculate total
  const items = data as unknown as CartItem[];
  const total = items?.reduce((sum, item) => {
    const basePrice = item.product?.base_price || 0;
    const modifier = item.product_item?.price_modifier || 0;
    const fabricPrice = item.fabric?.price_per_meter || 0;
    return sum + (basePrice + modifier + fabricPrice) * item.quantity;
  }, 0) || 0;
  
  return NextResponse.json({ cart: data, total });
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  const body = await request.json();
  const { product_id, product_item_id, fabric_id, quantity = 1, customization } = body;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return NextResponse.json({ 
      item: { 
        id: 'mock-cart-item-' + Date.now(), 
        product_id, 
        product_item_id, 
        fabric_id, 
        quantity, 
        customization,
        created_at: new Date().toISOString()
      } 
    });
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      product_id,
      product_item_id,
      fabric_id,
      quantity,
      customization,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ item: data });
}

// DELETE /api/cart - Clear cart
export async function DELETE() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
