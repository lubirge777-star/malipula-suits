import { createClient } from '@/lib/supabase/server';
import { flutterwaveService } from '@/lib/payment/flutterwave';
import { NextResponse } from 'next/server';

// GET /api/payment/verify?tx_ref=xxx - Verify payment status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get('tx_ref');

    if (!txRef) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          id,
          total,
          status,
          order_items (
            id,
            quantity,
            price,
            products (name)
          )
        )
      `)
      .eq('tx_ref', txRef)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'pending') {
      const verification = await flutterwaveService.verifyPaymentByRef(txRef);

      if (verification.status === 'success' && verification.data) {
        const newStatus = verification.data.status === 'successful' ? 'successful' :
                          verification.data.status === 'failed' ? 'failed' : 'pending';

        if (newStatus !== 'pending') {
          await supabase
            .from('payments')
            .update({
              status: newStatus,
              flutterwave_ref: verification.data.flw_ref,
              flutterwave_id: verification.data.id,
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

          payment.status = newStatus;
        }
      }
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        tx_ref: payment.tx_ref,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        payment_method: payment.payment_method,
        created_at: payment.created_at,
        paid_at: payment.paid_at,
        order: payment.orders,
      },
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
