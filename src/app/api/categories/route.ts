import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/categories - Get all categories
export async function GET() {
  const mockCategories = [
    { id: 'c1', name: 'Suits', slug: 'suits', icon: 'Scissors' },
    { id: 'c2', name: 'Shirts', slug: 'shirts', icon: 'Shirt' },
    { id: 'c3', name: 'Traditional Wear', slug: 'traditional-wear', icon: 'Star' },
    { id: 'c4', name: 'Kaftans', slug: 'kaftans', icon: 'Dresser' }
  ];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return NextResponse.json({ categories: mockCategories });
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ categories: data });
}
