import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/fabrics - Get all fabrics
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quality = searchParams.get('quality');
  const premium = searchParams.get('premium');
  
  const supabase = await createClient();
  
  let query = supabase
    .from('fabrics')
    .select('*')
    .eq('is_active', true)
    .order('price_per_meter', { ascending: true });
  
  if (quality) {
    query = query.eq('quality', quality.toUpperCase());
  }
  
  if (premium === 'true') {
    query = query.eq('is_premium', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ fabrics: data });
}
