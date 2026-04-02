'use client';

import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const txRef = searchParams.get('tx_ref');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-red-200 text-center overflow-hidden">
          {/* Failed Animation */}
          <div className="bg-gradient-to-b from-red-500/10 to-transparent pt-12 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="mx-auto w-24 h-24 bg-red-500 rounded-full flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <XCircle className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </div>

          <CardContent className="pt-4 pb-8 px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              Payment Failed
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              {error || 'We couldn\'t process your payment. Please try again or contact support.'}
            </motion.p>

            {txRef && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-muted/50 rounded-lg p-4 mb-6 text-left"
              >
                <div className="text-sm">
                  <span className="text-muted-foreground">Transaction Reference: </span>
                  <span className="font-mono text-xs">{txRef}</span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Link href="/checkout">
                <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="outline" className="w-full border-gold/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>

              <a 
                href="https://wa.me/255654321987?text=I%20need%20help%20with%20my%20payment"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="ghost" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-4 bg-muted/50 rounded-lg text-left"
            >
              <p className="text-sm font-medium mb-2">Common issues:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Insufficient balance on mobile money</li>
                <li>• Incorrect phone number format</li>
                <li>• Network connectivity issues</li>
                <li>• Payment timeout</li>
              </ul>
            </motion.div>
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
