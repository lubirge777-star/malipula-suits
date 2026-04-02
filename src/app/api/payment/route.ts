import { createClient } from '@/lib/supabase/server';
import { flutterwaveService } from '@/lib/payment/flutterwave';
import { NextResponse } from 'next/server';

// POST /api/payment - Initialize payment
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      order_id, 
      payment_method, 
      phone_number,
      amount,
      customer_email,
      customer_name
    } = body;

    // Validate required fields
    if (!order_id || !payment_method || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: order_id, payment_method, amount' },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        status,
        order_items (
          id,
          quantity,
          price,
          products (name)
        )
      `)
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Check if order is already paid
    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json(
        { error: 'Order has already been paid' },
        { status: 400 }
      );
    }

    // Verify amount matches
    if (Math.abs(order.total - amount) > 1) {
      return NextResponse.json(
        { error: 'Amount does not match order total' },
        { status: 400 }
      );
    }

    // Prepare payment items
    const items = order.order_items.map((item: any) => ({
      name: item.products?.name || 'Item',
      quantity: item.quantity,
      price: item.price,
    }));

    let paymentResult;

    // Process payment based on method
    switch (payment_method) {
      case 'mpesa':
        if (!phone_number) {
          return NextResponse.json(
            { error: 'Phone number is required for M-Pesa payments' },
            { status: 400 }
          );
        }
        paymentResult = await flutterwaveService.processMpesaPayment({
          amount,
          phone: phone_number,
          email: customer_email || user.email || 'customer@malipula.co.tz',
          orderId: order_id,
        });
        break;

      case 'tigo_pesa':
        if (!phone_number) {
          return NextResponse.json(
            { error: 'Phone number is required for Tigo Pesa payments' },
            { status: 400 }
          );
        }
        paymentResult = await flutterwaveService.processTigoPesaPayment({
          amount,
          phone: phone_number,
          email: customer_email || user.email || 'customer@malipula.co.tz',
          orderId: order_id,
        });
        break;

      case 'airtel_money':
        if (!phone_number) {
          return NextResponse.json(
            { error: 'Phone number is required for Airtel Money payments' },
            { status: 400 }
          );
        }
        paymentResult = await flutterwaveService.processAirtelMoneyPayment({
          amount,
          phone: phone_number,
          email: customer_email || user.email || 'customer@malipula.co.tz',
          orderId: order_id,
        });
        break;

      case 'card':
      case 'bank_transfer':
        // Create payment link for card/bank payments
        paymentResult = await flutterwaveService.createPaymentLink({
          orderId: order_id,
          amount,
          currency: 'TZS',
          customer: {
            email: customer_email || user.email || 'customer@malipula.co.tz',
            name: customer_name || 'Customer',
            phone: phone_number,
          },
          items,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid payment method. Supported: mpesa, tigo_pesa, airtel_money, card, bank_transfer' },
          { status: 400 }
        );
    }

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment initialization failed' },
        { status: 400 }
      );
    }

    // Store payment transaction in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id,
        user_id: user.id,
        tx_ref: paymentResult.txRef,
        amount,
        currency: 'TZS',
        payment_method,
        status: 'pending',
        phone_number,
      });

    if (paymentError) {
      console.error('Failed to store payment record:', paymentError);
      // Continue anyway - payment was initiated
    }

    // Update order status to pending payment
    await supabase
      .from('orders')
      .update({ 
        status: 'pending_payment',
        payment_method,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    return NextResponse.json({
      success: true,
      message: paymentResult.message || 'Payment initiated successfully',
      tx_ref: paymentResult.txRef,
      payment_link: paymentResult.link, // For card/bank payments
    });

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
