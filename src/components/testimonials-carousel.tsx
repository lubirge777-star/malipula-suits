'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';

// ============================================
// TESTIMONIALS DATA
// ============================================
export const testimonialsData = [
  {
    id: 1,
    name: 'Mwalimu Josephat',
    role: 'Business Executive',
    image: '/images/malipula/review1.jpg',
    content:
      'Malipula Suits transformed my wardrobe. The attention to detail in every stitch is remarkable. I have never felt more confident in my professional appearance. The team truly understands what it means to create a perfect fit.',
    rating: 5,
    highlight: 'Transformed my wardrobe',
  },
  {
    id: 2,
    name: 'Dr. Amina Hassan',
    role: 'Medical Director',
    image: '/images/malipula/review2-female.jpg',
    content:
      'The quality of fabrics and the precision of tailoring at Malipula is unmatched in Dar es Salaam. Their team truly understands the art of bespoke tailoring. From the first consultation to the final fitting, everything was exceptional.',
    rating: 5,
    highlight: 'Unmatched quality',
  },
  {
    id: 3,
    name: 'Engineer Michael',
    role: 'Tech Entrepreneur',
    image: '/images/malipula/review3.jpg',
    content:
      'From the initial consultation to the final fitting, the experience was exceptional. My wedding suit was perfect in every way. Thank you, Malipula! I highly recommend them to anyone looking for premium tailoring.',
    rating: 5,
    highlight: 'Perfect wedding suit',
  },
  {
    id: 4,
    name: 'Advocate Sarah',
    role: 'Senior Lawyer',
    image: '/images/malipula/review2.jpg',
    content:
      'As someone who appears in court regularly, I need suits that project confidence and professionalism. Malipula delivers exactly that. Their attention to detail and understanding of what professionals need is outstanding.',
    rating: 5,
    highlight: 'Professional excellence',
  },
  {
    id: 5,
    name: 'Bishop Peter',
    role: 'Religious Leader',
    image: '/images/malipula/review3.jpg',
    content:
      'For special occasions and ceremonial wear, Malipula has become my go-to tailor. Their traditional African designs combined with modern tailoring techniques create truly unique pieces that stand out.',
    rating: 5,
    highlight: 'Traditional excellence',
  },
];

// ============================================
// TESTIMONIAL CARD COMPONENT
// ============================================
interface TestimonialCardProps {
  testimonial: typeof testimonialsData[0];
  isActive: boolean;
  position: 'left' | 'center' | 'right';
}

function TestimonialCard({ testimonial, isActive, position }: TestimonialCardProps) {
  const scale = position === 'center' ? 1 : 0.85;
  const opacity = position === 'center' ? 1 : 0.5;
  const zIndex = position === 'center' ? 20 : 10;
  const translateX = position === 'left' ? '-60%' : position === 'right' ? '60%' : '0%';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity, 
        scale,
        x: translateX,
        zIndex,
      }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className={`absolute inset-0 flex items-center justify-center ${isActive ? '' : 'pointer-events-none'}`}
    >
      <div 
        className={`relative w-full max-w-lg mx-4 rounded-3xl overflow-hidden transition-all duration-500 ${
          isActive ? 'shadow-2xl shadow-amber-500/20' : 'shadow-lg'
        }`}
      >
        {/* Card Background */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 border border-amber-500/10">
          {/* Quote Icon */}
          <motion.div
            animate={{ rotate: isActive ? [0, 5, -5, 0] : 0 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 right-4 opacity-10"
          >
            <Quote className="w-16 h-16 text-amber-400" />
          </motion.div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
          </div>

          {/* Highlight Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
              {testimonial.highlight}
            </span>
          </motion.div>

          {/* Content */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 relative z-10"
          >
            "{testimonial.content}"
          </motion.p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-500/30 blur-sm -z-10"
              />
            </motion.div>
            <div>
              <h4 className="text-white font-semibold">{testimonial.name}</h4>
              <p className="text-gray-400 text-sm">{testimonial.role}</p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-500/5 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-tl-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN TESTIMONIALS CAROUSEL
// ============================================
interface TestimonialsCarouselProps {
  autoPlayInterval?: number;
  className?: string;
}

export function TestimonialsCarousel({
  autoPlayInterval = 6000,
  className = '',
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-10%' });

  // Auto-play functionality
  useEffect(() => {
    if (!isInView || isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isInView, isPaused, autoPlayInterval]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Get positions for visible cards
  const getPosition = (index: number): 'left' | 'center' | 'right' => {
    const prevIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    const nextIndex = (currentIndex + 1) % testimonialsData.length;
    
    if (index === currentIndex) return 'center';
    if (index === prevIndex) return 'left';
    if (index === nextIndex) return 'right';
    return 'left'; // Hidden cards
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative h-[400px] sm:h-[350px] md:h-[320px] overflow-visible">
        <AnimatePresence mode="popLayout">
          {testimonialsData.map((testimonial, index) => {
            const position = getPosition(index);
            const isVisible = position === 'center' || position === 'left' || position === 'right';
            
            if (!isVisible) return null;
            
            return (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={position === 'center'}
                position={position}
              />
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {testimonialsData.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2 bg-amber-400 rounded-full'
                : 'w-2 h-2 bg-white/20 hover:bg-white/40 rounded-full'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={isPaused ? { scale: 1 } : { scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Play className="w-3 h-3 text-amber-400" />
        </motion.div>
        <span>{isPaused ? 'Paused' : 'Auto-playing'}</span>
      </motion.div>
    </div>
  );
}

// ============================================
// COMPACT TESTIMONIALS GRID
// ============================================
export function TestimonialsGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`grid md:grid-cols-3 gap-6 ${className}`}>
      {testimonialsData.slice(0, 3).map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
        >
          <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
          <p className="text-gray-300 text-sm mb-4 line-clamp-4">{testimonial.content}</p>
          <div className="flex items-center gap-3">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover border border-amber-500/50"
            />
            <div>
              <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
              <p className="text-gray-500 text-xs">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// TESTIMONIAL MARQUEE
// ============================================
export function TestimonialsMarquee({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-6"
      >
        {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-amber-500/10"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{testimonial.content}</p>
            <div className="flex items-center gap-3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
                <p className="text-gray-500 text-xs">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default TestimonialsCarousel;
