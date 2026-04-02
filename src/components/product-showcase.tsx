'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface ProductShowcaseProps {
  product: {
    id: string | number;
    name: string;
    tagline: string;
    description: string;
    image: string;
    price?: number;
    originalPrice?: number;
    ctaText?: string;
    ctaLink?: string;
    isNew?: boolean;
    isFeatured?: boolean;
  };
  variant?: 'default' | 'hero' | 'minimal';
}

export function ProductShowcase({
  product,
  variant = 'default',
}: ProductShowcaseProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Outer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/30 via-gold-light/20 to-ivory rounded-3xl -z-10" />
        
        {/* Main card */}
        <div className="bg-charcoal rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden">
          {/* Header with mixed typography */}
          <div className="p-8 text-center border-b border-white/10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-script text-4xl text-gold mb-2"
            >
              {product.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-sans text-sm text-white/80 uppercase tracking-[0.2em]"
            >
              {product.tagline}
            </motion.p>
          </div>
          
          {/* Product Image on Circular Platform */}
          <div className="relative h-80 flex items-center justify-center overflow-hidden">
            {/* Animated circular platform */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-72 h-72 rounded-full bg-gradient-to-b from-gold/40 via-gold/20 to-transparent blur-xl"
            />
            
            {/* Secondary glow */}
            <div className="absolute w-96 h-96 rounded-full bg-gradient-to-t from-navy/50 to-transparent" />
            
            {/* Product image */}
            <motion.img
              src={product.image}
              alt={product.name}
              className="relative z-10 max-h-64 object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          
          {/* Description */}
          <div className="px-8 py-4 text-center">
            <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">
              {product.description}
            </p>
          </div>
          
          {/* Price and CTA */}
          <div className="p-8 flex flex-col items-center gap-4">
            {product.price && (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gold">
                  TZS {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-white/50 line-through">
                    TZS {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201, 169, 98, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-gold text-charcoal font-bold rounded-full uppercase tracking-wider hover:bg-gold-dark transition-all"
            >
              {product.ctaText || 'Shop Now'}
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-gold/10 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-gold text-charcoal text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="px-3 py-1 bg-navy text-white text-xs font-bold rounded-full">
                FEATURED
              </span>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Product name with script + sans combo */}
          <h3 className="font-script text-2xl text-foreground mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {product.tagline}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-gold fill-gold" />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(5.0)</span>
          </div>
          
          {/* Price */}
          {product.price && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-gold">
                TZS {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  TZS {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          )}
          
          {/* CTA */}
          <Link href={product.ctaLink || `/product/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-charcoal text-gold font-semibold rounded-full hover:bg-navy transition-colors flex items-center justify-center gap-2"
            >
              {product.ctaText || 'View Details'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Multiple product showcase grid
interface ProductShowcaseGridProps {
  products: ProductShowcaseProps['product'][];
  title?: string;
  subtitle?: string;
}

export function ProductShowcaseGrid({
  products,
  title,
  subtitle,
}: ProductShowcaseGridProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="font-script text-2xl text-gold mb-2"
              >
                {subtitle}
              </motion.p>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-foreground"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductShowcase product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
