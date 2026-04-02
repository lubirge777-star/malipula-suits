'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView, PanInfo } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Scissors, Ruler, Truck, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
  },
];

// ============================================
// ANIMATED BACKGROUND SHAPES
// ============================================
function AnimatedBackground({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.2, 0.4, 0.2] : 0.2,
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: isActive ? [1.2, 1, 1.2] : 1,
          opacity: isActive ? [0.1, 0.25, 0.1] : 0.1,
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl"
      />
      
      {/* Floating geometric shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 right-1/4 w-32 h-32 border border-amber-500/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-amber-400/10 rotate-45"
      />
    </div>
  );
}

// ============================================
// SERVICE CARD COMPONENT
// ============================================
interface ServiceCardProps {
  service: typeof servicesData[0];
  isActive: boolean;
  index: number;
}

function ServiceCard({ service, isActive, index }: ServiceCardProps) {
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${service.gradient}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          animate={{ scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Animated Background */}
      <AnimatedBackground isActive={isActive} />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Icon Container */}
          <motion.div
            animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-xl flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-amber-400" />
            </div>
            {/* Glow effect */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-xl -z-10"
            />
          </motion.div>

          {/* Stats Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0.7, x: 0 }}
            className="text-right"
          >
            <div className="text-2xl sm:text-3xl font-bold text-amber-400">{service.stats.value}</div>
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
            className="text-amber-400 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2"
          >
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

          {/* CTA Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/booking">
              <motion.button
                whileHover={{ x: 5 }}
                className="group flex items-center gap-2 text-amber-400 font-medium text-sm sm:text-base"
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
            <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isActive ? '100%' : '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
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
// MAIN SERVICES CAROUSEL
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

  // Slide variants for animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
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
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
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

      {/* Bottom Navigation */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
        {/* Dot Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {servicesData.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all rounded-full ${
                index === currentIndex 
                  ? 'w-10 sm:w-12 h-2.5 sm:h-3 bg-gradient-to-r from-amber-500 to-amber-400' 
                  : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="md:hidden flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Swipe to explore</span>
        <ChevronRight className="w-4 h-4" />
      </motion.div>
    </div>
  );
}

// ============================================
// COMPACT SERVICES GRID (Alternative Display)
// ============================================
export function ServicesGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {servicesData.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{service.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ServicesCarousel;
