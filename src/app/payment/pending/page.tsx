'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Smartphone, CheckCircle, XCircle, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txRef = searchParams.get('tx_ref');
  const orderId = searchParams.get('order_id');
  
  const [status, setStatus] = useState<'pending' | 'successful' | 'failed'>('pending');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!txRef) return;

    // Poll for payment status
    const checkStatus = async () => {
      setChecking(true);
      try {
        const response = await fetch(`/api/payment/verify?tx_ref=${txRef}`);
        const data = await response.json();
        
        if (response.ok && data.payment) {
          if (data.payment.status === 'successful') {
            setStatus('successful');
            setTimeout(() => {
              router.push(`/payment/success?tx_ref=${txRef}&order_id=${orderId}`);
            }, 2000);
          } else if (data.payment.status === 'failed') {
            setStatus('failed');
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      } finally {
        setChecking(false);
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [txRef, orderId, router]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending') return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          {/* Header */}
          <div className="bg-gradient-to-b from-gold/10 to-transparent pt-12 pb-8">
            <motion.div
              animate={{ 
                scale: status === 'pending' ? [1, 1.05, 1] : 1,
              }}
              transition={{ 
                duration: 2, 
                repeat: status === 'pending' ? Infinity : 0 
              }}
              className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                status === 'successful' ? 'bg-green-500' :
                status === 'failed' ? 'bg-red-500' :
                'bg-gold'
              }`}
            >
              {status === 'successful' ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : status === 'failed' ? (
                <XCircle className="w-12 h-12 text-white" />
              ) : (
                <Smartphone className="w-12 h-12 text-charcoal" />
              )}
            </motion.div>
          </div>

          <CardContent className="pt-4 pb-8 px-6">
            {status === 'pending' && (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Check Your Phone
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mb-6"
                >
                  A payment prompt has been sent to your phone. Enter your PIN to complete the payment.
                </motion.p>

                {/* Countdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-muted/50 rounded-lg p-6 mb-6"
                >
                  <p className="text-sm text-muted-foreground mb-2">Time remaining</p>
                  <p className="text-3xl font-bold text-gold font-mono">
                    {formatTime(countdown)}
                  </p>
                  {checking && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Checking payment status...
                    </p>
                  )}
                </motion.div>

                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-left bg-muted/30 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm font-medium mb-2">Instructions:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Look for the payment prompt on your phone</li>
                    <li>Enter your mobile money PIN</li>
                    <li>Confirm the payment</li>
                    <li>Wait for the confirmation message</li>
                  </ol>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-muted-foreground">
                    Transaction Reference: <span className="font-mono">{txRef}</span>
                  </p>
                  
                  <a 
                    href="https://wa.me/255654321987?text=I%20need%20help%20with%20my%20payment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full border-gold/20">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Need Help? Contact Support
                    </Button>
                  </a>
                </motion.div>
              </>
            )}

            {status === 'successful' && (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Payment Successful!
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mb-6"
                >
                  Redirecting to confirmation page...
                </motion.p>

                <div className="flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Payment Failed
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mb-6"
                >
                  The payment was not completed. Please try again.
                </motion.p>

                <Link href="/checkout">
                  <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                    Try Again
                  </Button>
                </Link>
              </>
            )}

            {status === 'pending' && countdown === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">
                  The payment session has expired. Please try again.
                </p>
                <Link href="/checkout">
                  <Button variant="destructive" className="w-full mt-3">
                    Start Over
                  </Button>
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}
