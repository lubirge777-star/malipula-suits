'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, ShoppingBag, Crown, Star } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  headline?: {
    line1: string;
    line2: string;
    script?: string;
  };
  subheadline?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  productImage?: string;
  stats?: {
    label: string;
    value: string;
  }[];
  brandLogos?: string[];
}

export function HeroSection({
  headline = {
    line1: 'REDEFINING',
    line2: 'STYLE',
    script: 'Experience',
  },
  subheadline = 'IMMERSE YOURSELF IN ELEGANCE LIKE NEVER BEFORE',
  description,
  primaryCta = {
    text: 'Shop Collection',
    href: '/shop',
  },
  secondaryCta = {
    text: 'Watch Our Story',
    href: '#video',
  },
  backgroundImage,
  productImage,
  stats,
  brandLogos,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-navy via-charcoal to-black" />
        )}
        
        {/* Animated line pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: i * 0.1 }}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent"
              style={{ left: `${5 * i}%` }}
            />
          ))}
        </div>
        
        {/* Decorative blur elements */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[80px]"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main hero content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="text-center lg:text-left"
              >
                {/* Award badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-6"
                >
                  <Crown className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">
                    Award-Winning Tailor - EAGMA 2025
                  </span>
                </motion.div>
                
                {/* Main headline - Mixed typography */}
                <div className="mb-6">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight"
                  >
                    {headline.line1}
                  </motion.h1>
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight mt-2"
                  >
                    <span className="text-gold-gradient">{headline.line2}</span>
                  </motion.h1>
                  {headline.script && (
                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="font-script text-4xl sm:text-5xl text-gold mt-4"
                    >
                      {headline.script}
                    </motion.p>
                  )}
                </div>
                
                {/* Subheadline */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className="text-white/70 text-sm sm:text-base uppercase tracking-[0.3em] mb-6"
                >
                  {subheadline}
                </motion.p>
                
                {/* Description */}
                {description && (
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-gray-300 text-lg mb-8 max-w-lg mx-auto lg:mx-0"
                  >
                    {description}
                  </motion.p>
                )}
                
                {/* CTA Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href={primaryCta.href}>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 30px rgba(201, 169, 98, 0.5)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-8 py-4 bg-gold text-charcoal font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gold-dark transition-all"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {primaryCta.text}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  
                  <Link href={secondaryCta.href}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                      <Play className="w-5 h-5" />
                      {secondaryCta.text}
                    </motion.button>
                  </Link>
                </motion.div>
                
                {/* Stats */}
                {stats && stats.length > 0 && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/20"
                  >
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center lg:text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-gold-gradient">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Right - Product showcase */}
              {productImage && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden lg:block relative"
                >
                  {/* Circular platform glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-gold/40 via-gold/20 to-transparent blur-xl"
                  />
                  
                  {/* Secondary ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10" />
                  
                  {/* Floating product */}
                  <motion.img
                    src={productImage}
                    alt="Featured Product"
                    className="relative z-10 max-w-sm mx-auto"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-0 right-0 w-20 h-20"
                  >
                    <Star className="w-6 h-6 text-gold/30 absolute top-0 right-0" />
                    <Star className="w-4 h-4 text-gold/20 absolute top-8 right-8" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Brand logos */}
        {brandLogos && brandLogos.length > 0 && (
          <div className="py-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {brandLogos.map((logo, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-white text-sm font-medium uppercase tracking-wider"
                  >
                    {logo}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
