'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView, PanInfo, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Scissors, Ruler, Truck, Shield, Sparkles, ChevronLeft, ChevronRight, Star } from 'lucide-react';

// ============================================
// SERVICE DATA
// ============================================
export const servicesData = [
  {
    id: 'tailoring',
    icon: Scissors,
    title: 'Expert Tailoring',
    subtitle: 'Master Craftsmanship',
    description: 'Every stitch tells a story of dedication and precision, crafted by master tailors with decades of experience.',
    image: '/images/malipula/service1.jpg',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    accentColor: 'amber',
    stats: { value: '15+', label: 'Years Experience' },
    features: ['Hand-stitched details', 'Premium materials', 'Custom designs'],
  },
  {
    id: 'perfect-fit',
    icon: Ruler,
    title: 'Perfect Fit',
    subtitle: 'Made for You',
    description: 'Your measurements, your style, your preferences. Each garment is uniquely tailored to your body.',
    image: '/images/malipula/service2.jpg',
    gradient: 'from-slate-800 via-slate-900 to-slate-800',
    accentColor: 'amber',
    stats: { value: '15,000+', label: 'Custom Fits' },
    features: ['Precision measuring', 'Multiple fittings', 'Adjustment guarantee'],
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Free Delivery',
    subtitle: 'Premium Service',
    description: 'Complimentary delivery within Dar es Salaam for orders above TZS 300,000.',
    image: '/images/malipula/service3.jpg',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    accentColor: 'amber',
    stats: { value: '5,000+', label: 'Happy Customers' },
    features: ['Fast delivery', 'Safe packaging', 'Tracking available'],
  },
  {
    id: 'quality',
    icon: Shield,
    title: 'Quality Guaranteed',
    subtitle: 'Our Promise',
    description: '100% satisfaction guarantee on all our tailored pieces. Your happiness is our priority.',
    image: '/images/malipula/service4.jpg',
    gradient: 'from-slate-800 via-slate-900 to-slate-800',
    accentColor: 'amber',
    stats: { value: '100%', label: 'Satisfaction' },
    features: ['Quality fabrics', 'Durability assured', 'Lifetime support'],
  },
];

// ============================================
// 3D TILT HOOK
// ============================================
function use3DTilt(strength: number = 10) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// ============================================
// ANIMATED BACKGROUND SHAPES - Enhanced
// ============================================
function AnimatedBackground({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.3, 1] : 1,
          opacity: isActive ? [0.15, 0.35, 0.15] : 0.15,
          x: isActive ? [0, 20, 0] : 0,
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: isActive ? [1.3, 1, 1.3] : 1,
          opacity: isActive ? [0.1, 0.3, 0.1] : 0.1,
          y: isActive ? [0, -30, 0] : 0,
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl"
      />
      
      {/* Floating geometric shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 right-1/4 w-40 h-40 border border-amber-500/8 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-amber-400/8 rotate-45"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/3 w-24 h-24 border border-amber-300/5 rounded-full"
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-amber-400/40' : 'bg-amber-300/30'}`} />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// SERVICE CARD COMPONENT - Enhanced with 3D
// ============================================
interface ServiceCardProps {
  service: typeof servicesData[0];
  isActive: boolean;
  index: number;
}

function ServiceCard({ service, isActive, index }: ServiceCardProps) {
  const Icon = service.icon;
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(5);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${service.gradient} cursor-grab active:cursor-grabbing`}
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ transform: 'translateZ(20px)' }}
      >
        <motion.img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          animate={{ scale: isActive ? 1.08 : 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        {/* Color overlay based on service */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
      </motion.div>

      {/* Animated Background */}
      <AnimatedBackground isActive={isActive} />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/50" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12" style={{ transform: 'translateZ(30px)' }}>
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Icon Container with Glow */}
          <motion.div
            animate={{ scale: isActive ? [1, 1.08, 1] : 1 }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="relative"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-400" />
            </div>
            {/* Glow effect */}
            <motion.div
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-amber-500/40 blur-xl -z-10"
            />
            {/* Animated ring */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-2xl border border-amber-500/10"
            />
          </motion.div>

          {/* Stats Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0.7, x: 0 }}
            className="text-right"
          >
            <motion.div 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400"
              animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {service.stats.value}
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-400">{service.stats.label}</div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-amber-400 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 flex items-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.span>
            {service.subtitle}
          </motion.p>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight"
          >
            {service.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-md mb-4 sm:mb-6 leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-4 sm:mb-6"
          >
            {service.features.map((feature, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-300"
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/booking">
              <motion.button
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-400 font-medium text-sm sm:text-base px-4 py-2 rounded-full border border-amber-500/20 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 sm:mt-8 flex items-center gap-4"
          >
            <span className="text-amber-400 font-bold text-lg sm:text-xl">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isActive ? '100%' : '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
              />
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </div>
            <span className="text-gray-500 text-sm">
              {String(servicesData.length).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN SERVICES CAROUSEL - Enhanced
// ============================================
interface ServicesCarouselProps {
  autoPlayInterval?: number;
  className?: string;
}

export function ServicesCarousel({ 
  autoPlayInterval = 5000,
  className = '' 
}: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-10%' });

  // Auto-play functionality
  useEffect(() => {
    if (!isInView || isPaused) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % servicesData.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isInView, isPaused, autoPlayInterval]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % servicesData.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + servicesData.length) % servicesData.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Touch/Swipe handlers
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) {
      goToNext();
    } else if (info.offset.x > 50) {
      goToPrev();
    }
  };

  // Slide variants for animations - cube effect
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction < 0 ? 15 : -15,
      scale: 0.9,
    }),
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <ServiceCard 
              service={servicesData[currentIndex]} 
              isActive={true}
              index={currentIndex}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 right-4 justify-between pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.15, x: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrev}
            className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-xl shadow-black/20 group"
          >
            <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-xl shadow-black/20 group"
          >
            <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* Mobile Touch Areas */}
        <button 
          onClick={goToPrev}
          className="md:hidden absolute left-0 top-0 bottom-0 w-1/4 z-10"
          aria-label="Previous slide"
        />
        <button 
          onClick={goToNext}
          className="md:hidden absolute right-0 top-0 bottom-0 w-1/4 z-10"
          aria-label="Next slide"
        />
      </div>

      {/* Bottom Navigation - Enhanced */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        {/* Service Preview Dots */}
        <div className="flex items-center gap-3 sm:gap-4">
          {servicesData.map((service, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-28 sm:w-32' 
                  : 'w-12 sm:w-14 hover:w-20 sm:hover:w-24'
              }`}
              aria-label={`Go to ${service.title}`}
            >
              {/* Progress indicator */}
              <div className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                  : 'bg-white/20 group-hover:bg-white/40'
              }`}>
                {index === currentIndex && (
                  <motion.div
                    className="h-full bg-white/50 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </div>
              {/* Service name on active */}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: index === currentIndex ? 1 : 0 }}
                className="absolute -bottom-5 left-0 right-0 text-[10px] sm:text-xs text-amber-400 text-center truncate"
              >
                {service.title}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="md:hidden flex items-center justify-center gap-2 mt-6 text-gray-400 text-xs"
      >
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Swipe to explore</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================
// COMPACT SERVICES GRID (Alternative Display) - Enhanced
// ============================================
export function ServicesGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {servicesData.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02, rotateX: 5 }}
            className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-500 overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Background glow on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Animated corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative" style={{ transform: 'translateZ(20px)' }}>
              <motion.div 
                className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Icon className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{service.description}</p>
              <div className="flex items-center gap-1 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{service.stats.value}</span>
                <span className="text-gray-500">{service.stats.label}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================
// SERVICES SHOWCASE - 3D Cards Layout
// ============================================
export function ServicesShowcase({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main Services */}
      <div className="grid md:grid-cols-2 gap-6">
        {servicesData.slice(0, 2).map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="relative group rounded-3xl overflow-hidden h-80"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 backdrop-blur-xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 max-w-xs">{service.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-400 font-bold text-xl">{service.stats.value}</span>
                    <span className="text-gray-400 text-sm">{service.stats.label}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Secondary Services */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {servicesData.slice(2).map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="relative group rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/10"
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{service.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ServicesCarousel;
