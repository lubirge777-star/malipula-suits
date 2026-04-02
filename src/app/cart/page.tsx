'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Trash2,
  Plus,
  Minus,
  Crown,
  Truck,
  Tag,
  ArrowRight,
  ChevronRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/api/hooks';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const { user } = useAuth();
  const { 
    cart, 
    total, 
    loading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(id, { quantity: newQuantity });
    if (!result.success) {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (id: string) => {
    const result = await removeFromCart(id);
    if (result.success) {
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'malipula10') {
      setPromoApplied(true);
      toast({
        title: 'Promo applied!',
        description: '10% discount has been applied to your order.',
      });
    } else {
      toast({
        title: 'Invalid code',
        description: 'The promo code you entered is not valid.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to checkout.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCheckingOut(true);
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  const subtotal = total;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 300000 ? 0 : 25000;
  const orderTotal = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Your Cart</h1>
            <p className="text-muted-foreground">{cart.length} items in your cart</p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Failed to load cart</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && cart.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
              <Link href="/shop">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  Continue Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Cart Items */}
          {!loading && !error && cart.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-gold/10 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            {/* Image */}
                            <div className="w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={item.product?.thumbnail || '/images/malipula/service1.jpg'} 
                                alt={item.product?.name || 'Product'} 
                                className="w-full h-full object-cover" 
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <Link href={`/product/${item.product?.id}`}>
                                    <h3 className="font-semibold text-foreground line-clamp-1 hover:text-gold transition-colors">
                                      {item.product?.name || 'Product'}
                                    </h3>
                                  </Link>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.product_item?.color || 'Default'} / {item.product_item?.size || 'One Size'}
                                  </p>
                                  {item.fabric && (
                                    <p className="text-xs text-muted-foreground">{item.fabric.name}</p>
                                  )}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                {/* Quantity */}
                                <div className="flex items-center border border-gold/20 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-muted transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-muted transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gold">
                                    TZS {formatPrice((item.product?.base_price || 0) * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
                <Link href="/shop">
                  <Button variant="outline" className="border-gold/20 text-foreground hover:border-gold hover:text-gold">
                    <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="sticky top-28">
                  <Card className="border-gold/10">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

                      {/* Promo Code */}
                      <div className="mb-6">
                        <label className="text-sm font-medium text-foreground mb-2 block">Promo Code</label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="border-gold/20 focus:border-gold"
                            disabled={promoApplied}
                          />
                          <Button
                            onClick={handleApplyPromo}
                            disabled={promoApplied || !promoCode}
                            className={`${promoApplied ? 'bg-green-500' : 'bg-gold hover:bg-gold-dark'} text-charcoal`}
                          >
                            {promoApplied ? 'Applied' : 'Apply'}
                          </Button>
                        </div>
                        {promoApplied && (
                          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            MALIPULA10 - 10% discount applied!
                          </motion.p>
                        )}
                      </div>

                      <Separator className="bg-gold/20 mb-6" />

                      {/* Summary Lines */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>TZS {formatPrice(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount (10%)</span>
                            <span>-TZS {formatPrice(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `TZS ${formatPrice(shipping)}`}</span>
                        </div>
                      </div>

                      <Separator className="bg-gold/20 mb-6" />

                      {/* Total */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-gold">TZS {formatPrice(orderTotal)}</span>
                      </div>

                      {/* Checkout Button */}
                      <Button 
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold text-lg py-6"
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>

                      {/* Security Note */}
                      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Secure checkout powered by SSL encryption</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Info */}
                  <Card className="border-gold/10 mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm">Free Delivery</h4>
                          <p className="text-xs text-muted-foreground">On orders above TZS 300,000</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                    {['M-Pesa', 'Tigo Pesa', 'Airtel', 'Visa', 'Mastercard'].map((method) => (
                      <div key={method} className="px-3 py-1.5 bg-muted rounded text-xs font-medium text-muted-foreground">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
