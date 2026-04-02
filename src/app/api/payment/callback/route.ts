import { createClient } from '@/lib/supabase/server';
import { flutterwaveService } from '@/lib/payment/flutterwave';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/payment/callback - Handle redirect from Flutterwave
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const txRef = searchParams.get('tx_ref');
    const orderId = searchParams.get('order_id');

    if (!txRef) {
      return NextResponse.redirect(
        new URL('/payment/failed?error=missing_transaction_reference', request.url)
      );
    }

    const supabase = await createClient();

    // Verify payment with Flutterwave
    const verification = await flutterwaveService.verifyPaymentByRef(txRef);

    if (verification.status !== 'success' || verification.data?.status !== 'successful') {
      const errorMsg = verification.data?.status === 'pending' 
        ? 'Payment is still pending' 
        : 'Payment verification failed';

      await supabase
        .from('payments')
        .update({
          status: verification.data?.status || 'failed',
          flutterwave_ref: verification.data?.flw_ref,
          updated_at: new Date().toISOString(),
        })
        .eq('tx_ref', txRef);

      return NextResponse.redirect(
        new URL(`/payment/failed?error=${encodeURIComponent(errorMsg)}&tx_ref=${txRef}`, request.url)
      );
    }

    const paymentData = verification.data!;

    await supabase
      .from('payments')
      .update({
        status: 'successful',
        flutterwave_ref: paymentData.flw_ref,
        flutterwave_id: paymentData.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('tx_ref', txRef);

    if (orderId) {
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }

    return NextResponse.redirect(
      new URL(`/payment/success?tx_ref=${txRef}&order_id=${orderId || ''}`, request.url)
    );

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/failed?error=internal_error', request.url)
    );
  }
}

// POST /api/payment/callback - Handle Flutterwave webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const hash = request.headers.get('verif-hash');
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;

    if (process.env.NODE_ENV === 'production' && (!hash || hash !== secretHash)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = body;

    if (event !== 'charge.completed') {
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, orders!inner(id)')
      .eq('tx_ref', data.tx_ref)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found for tx_ref:', data.tx_ref);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const newStatus = data.status === 'successful' ? 'successful' : 
                      data.status === 'failed' ? 'failed' : 'pending';

    await supabase
      .from('payments')
      .update({
        status: newStatus,
        flutterwave_ref: data.flw_ref,
        flutterwave_id: data.id,
        paid_at: newStatus === 'successful' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (newStatus === 'successful') {
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.order_id);
    }

    return NextResponse.json({ received: true, processed: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
