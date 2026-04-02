'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const orderId = searchParams.get('order_id');
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txRef) {
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/payment/verify?tx_ref=${txRef}`);
        const data = await response.json();
        
        if (response.ok) {
          setPaymentData(data.payment);
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [txRef]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-gold/20 text-center overflow-hidden">
          {/* Success Animation */}
          <div className="bg-gradient-to-b from-green-500/10 to-transparent pt-12 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </div>

          <CardContent className="pt-4 pb-8 px-6">
            {verifying ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gold mb-4" />
                <p className="text-muted-foreground">Verifying payment...</p>
              </div>
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Payment Successful!
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  Thank you for your order. We've sent a confirmation to your email.
                </motion.p>

                {paymentData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-muted/50 rounded-lg p-4 mb-6 text-left"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction Ref</span>
                        <span className="font-mono text-xs">{txRef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-bold text-gold">TZS {formatPrice(paymentData.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="capitalize">{paymentData.payment_method?.replace('_', ' ')}</span>
                      </div>
                      {orderId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order ID</span>
                          <span>#{orderId.slice(0, 8).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Link href={`/orders${orderId ? `/${orderId}` : ''}`}>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View Order Details
                    </Button>
                  </Link>
                  
                  <Link href="/shop">
                    <Button variant="outline" className="w-full border-gold/20">
                      Continue Shopping
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-muted-foreground mt-6"
                >
                  Questions? Contact us on{' '}
                  <a href="https://wa.me/255654321987" className="text-gold hover:underline">
                    WhatsApp
                  </a>
                </motion.p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/images/malipula/m.png" alt="Malipula" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold text-gold-gradient">MALIPULA</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Royal. Rooted. Refined.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
