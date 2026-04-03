import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

// DELETE /api/wishlist/[id] - Remove a specific item from wishlist
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  if (!id) {
    return NextResponse.json({ error: 'Wishlist item ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing wishlist item:', error.message);
    return NextResponse.json({ error: 'Failed to remove item from wishlist' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Item removed from wishlist' });
}
