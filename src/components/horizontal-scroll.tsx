'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Simple auto-playing feature cards carousel with scroll trigger
interface FeatureCardsProps {
  sections: {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    icon?: React.ReactNode;
    gradient?: string;
  }[];
  className?: string;
  autoPlayInterval?: number;
}

export function FeatureCards({ 
  sections, 
  className = '',
  autoPlayInterval = 5000 
}: FeatureCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const totalSlides = sections.length + 1; // +1 for CTA card
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Intersection Observer to detect when section is in view
  const isInView = useInView(containerRef, { 
    once: false, 
    margin: '-20%' // Start when 20% of the section is visible
  });

  // Auto-play effect - starts when section is in view
  useEffect(() => {
    if (!isInView) return;
    
    // Start the carousel when section comes into view
    setHasStarted(true);
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, totalSlides, isInView]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex"
        >
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex-shrink-0 w-full min-h-[500px] md:min-h-[600px] rounded-3xl overflow-hidden relative ${section.gradient || 'bg-navy'}`}
            >
              {/* Background image with overlay */}
              {section.image && (
                <div className="absolute inset-0">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
              )}

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
                {/* Icon */}
                {section.icon && (
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                    {section.icon}
                  </div>
                )}

                {/* Subtitle */}
                {section.subtitle && (
                  <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">
                    {section.subtitle}
                  </p>
                )}

                {/* Title */}
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-lg max-w-xl">
                  {section.description}
                </p>

                {/* Progress indicator */}
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-gold font-bold text-2xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex gap-2">
                    {sections.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`w-8 h-1 rounded-full transition-colors ${
                          i === index ? 'bg-gold' : 'bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Final CTA card */}
          <div className="flex-shrink-0 w-full min-h-[500px] md:min-h-[600px] rounded-3xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center p-8">
            <div className="text-center max-w-xl">
              <h3 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Ready to Begin?
              </h3>
              <p className="text-charcoal/70 text-lg mb-8">
                Experience the Malipula difference with our bespoke tailoring services.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-charcoal text-white font-semibold rounded-full"
              >
                Book Appointment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-3 mt-8">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentIndex 
                ? 'w-10 h-3 bg-gold' 
                : 'w-3 h-3 bg-gold/30 hover:bg-gold/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Horizontal scroll section - simplified version
interface HorizontalScrollSectionProps {
  sections: {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    icon?: React.ReactNode;
    gradient?: string;
  }[];
  className?: string;
}

export function HorizontalScrollSection({ 
  sections, 
  className = '' 
}: HorizontalScrollSectionProps) {
  // Just use the auto-playing carousel instead
  return <FeatureCards sections={sections} className={className} />;
}

// Simple horizontal carousel (no scroll-jacking)
interface HorizontalCarouselProps {
  items: {
    title: string;
    description?: string;
    image?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
}

export function HorizontalCarousel({ 
  items, 
  autoPlay = true, 
  interval = 4000 
}: HorizontalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold">{item.title}</h3>
              {item.description && (
                <p className="text-muted-foreground mt-2">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-gold' 
                : 'bg-gold/30 hover:bg-gold/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
