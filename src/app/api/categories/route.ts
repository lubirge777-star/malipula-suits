import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/categories - Get all categories
export async function GET() {
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
