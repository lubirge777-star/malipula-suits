import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface CartItemForOrder {
  id: string;
  quantity: number;
  customization: string | null;
  product: {
    id: string;
    name: string;
    base_price: number;
    product_type: string;
  } | null;
  product_item: {
    id: string;
    sku: string;
    price_modifier: number;
  } | null;
  fabric: {
    id: string;
    name: string;
    price_per_meter: number;
  } | null;
}

// GET /api/orders - Get user's orders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');
  
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        id,
        product_name,
        product_type,
        fabric_name,
        quantity,
        unit_price,
        total_price,
        customization
      ),
      delivery_address:addresses(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status.toUpperCase());
  }
  
  if (limit) {
    query = query.limit(parseInt(limit));
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ orders: data });
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const {
    delivery_method,
    delivery_address_id,
    delivery_notes,
    payment_method,
    discount_code,
  } = body;
  
  // Get cart items to create order from
  const { data: cartData } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      customization,
      product:products(id, name, base_price, product_type),
      product_item:product_items(id, sku, price_modifier),
      fabric:fabrics(id, name, price_per_meter)
    `)
    .eq('user_id', user.id);
  
  const cartItems = cartData as unknown as CartItemForOrder[] | null;
  
  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  
  // Calculate totals
  let subtotal = 0;
  const orderItems = cartItems.map((item) => {
    const basePrice = item.product?.base_price || 0;
    const modifier = item.product_item?.price_modifier || 0;
    const fabricPrice = item.fabric?.price_per_meter || 0;
    const unitPrice = basePrice + modifier + fabricPrice;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    
    return {
      product_item_id: item.product_item?.id,
      product_name: item.product?.name || '',
      product_type: item.product?.product_type || 'SUIT',
      fabric_name: item.fabric?.name,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      customization: item.customization,
    };
  });
  
  // Apply discount if provided
  let discount = 0;
  if (discount_code) {
    const { data: promo } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', discount_code)
      .eq('is_active', true)
      .single();
    
    if (promo) {
      if (promo.discount_type === 'PERCENTAGE') {
        discount = subtotal * (promo.discount_value / 100);
        if (promo.max_discount) {
          discount = Math.min(discount, promo.max_discount);
        }
      } else {
        discount = promo.discount_value;
      }
    }
  }
  
  const shippingCost = delivery_method === 'DELIVERY' ? 15000 : 0;
  const tax = 0; // Tanzania VAT could be added here
  const total = subtotal - discount + tax + shippingCost;
  
  // Generate order number
  const orderNumber = `MSP-${Date.now()}`;
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      subtotal,
      discount,
      tax,
      shipping_cost: shippingCost,
      total,
      payment_method,
      delivery_method,
      delivery_address_id,
      delivery_notes,
    })
    .select()
    .single();
  
  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }
  
  // Create order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));
  
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }
  
  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);
  
  return NextResponse.json({ order });
}
