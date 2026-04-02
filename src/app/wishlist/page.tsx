'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock wishlist data - in real app, this would come from Supabase
const wishlistItems = [
  {
    id: '1',
    name: 'Royal Navy Three-Piece Suit',
    slug: 'royal-navy-three-piece-suit',
    price: 850000,
    image: '/images/malipula/service1.jpg',
    category: 'Suits',
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Egyptian Cotton Shirt',
    slug: 'premium-egyptian-cotton-shirt',
    price: 150000,
    image: '/images/malipula/team1.jpg',
    category: 'Shirts',
    inStock: true,
  },
  {
    id: '3',
    name: 'African Heritage Kaftan',
    slug: 'african-heritage-kaftan',
    price: 380000,
    image: '/images/malipula/service3.jpg',
    category: 'Kaftans',
    inStock: false,
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addToCart = (id: string) => {
    // In real app, this would add to cart via API
    console.log('Adding to cart:', id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/shop"
              className="inline-flex items-center text-white/60 hover:text-amber-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-gold-gradient">My Wishlist</span>
              </h1>
            </div>
            <p className="text-white/50 mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white/20" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Your wishlist is empty</h2>
              <p className="text-white/50 mb-8">
                Start adding items you love to your wishlist
              </p>
              <Link href="/shop">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:border-amber-500/20 transition-all overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-amber-400 font-medium uppercase tracking-wide mb-1">
                              {item.category}
                            </p>
                            <Link href={`/product/${item.slug}`}>
                              <h3 className="text-lg font-semibold text-white hover:text-amber-400 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-2xl font-bold text-amber-400 mt-2">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                              onClick={() => addToCart(item.id)}
                              disabled={!item.inStock}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => removeItem(item.id)}
                              className="border-white/20 text-white/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
