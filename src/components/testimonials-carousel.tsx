'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
      'Malipula Suits transformed my wardrobe. The attention to detail in every stitch is remarkable. I have never felt more confident in my professional appearance.',
    rating: 5,
    highlight: 'Transformed my wardrobe',
  },
  {
    id: 2,
    name: 'Dr. Amina Hassan',
    role: 'Medical Director',
    image: '/images/malipula/review2-female.jpg',
    content:
      'The quality of fabrics and the precision of tailoring at Malipula is unmatched in Dar es Salaam. From the first consultation to the final fitting, everything was exceptional.',
    rating: 5,
    highlight: 'Unmatched quality',
  },
  {
    id: 3,
    name: 'Engineer Michael',
    role: 'Tech Entrepreneur',
    image: '/images/malipula/review3.jpg',
    content:
      'From the initial consultation to the final fitting, the experience was exceptional. My wedding suit was perfect in every way. Highly recommended!',
    rating: 5,
    highlight: 'Perfect wedding suit',
  },
  {
    id: 4,
    name: 'Advocate Sarah',
    role: 'Senior Lawyer',
    image: '/images/malipula/review2.jpg',
    content:
      'As someone who appears in court regularly, I need suits that project confidence and professionalism. Malipula delivers exactly that with outstanding attention to detail.',
    rating: 5,
    highlight: 'Professional excellence',
  },
  {
    id: 5,
    name: 'Bishop Peter',
    role: 'Religious Leader',
    image: '/images/malipula/review3.jpg',
    content:
      'For special occasions and ceremonial wear, Malipula has become my go-to tailor. Their traditional African designs combined with modern tailoring create unique pieces.',
    rating: 5,
    highlight: 'Traditional excellence',
  },
];

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
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-10%' });

  // Auto-play functionality
  useEffect(() => {
    if (!isInView || isPaused) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isInView, isPaused, autoPlayInterval]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const testimonial = testimonialsData[currentIndex];

  // Slide variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative w-full max-w-2xl mx-auto overflow-hidden px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full"
          >
            {/* Testimonial Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/10 shadow-2xl">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-amber-400" />
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>

              {/* Highlight Badge */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
                  {testimonial.highlight}
                </span>
              </div>

              {/* Content */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/50"
                  />
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-sm -z-10 scale-110" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-500/5 to-transparent rounded-br-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-tl-full pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-1 sm:px-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg z-10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all shadow-lg z-10"
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
