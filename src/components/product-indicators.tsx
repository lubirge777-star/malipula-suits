'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

// Interactive product indicator - Tower style
interface IndicatorPoint {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  details?: string[];
}

interface ProductIndicatorsProps {
  image: string;
  imageAlt: string;
  indicators: IndicatorPoint[];
  className?: string;
}

export function ProductIndicators({
  image,
  imageAlt,
  indicators,
  className = '',
}: ProductIndicatorsProps) {
  const [activeIndicator, setActiveIndicator] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndicator(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Get current indicator data
  const currentIndicator = indicators.find(i => i.id === activeIndicator);

  // Calculate popup position for desktop
  const getPopupStyle = (indicator: IndicatorPoint) => {
    if (isMobile) return {};
    
    return {
      left: indicator.x > 60 ? 'auto' : '50%',
      right: indicator.x > 60 ? '50%' : 'auto',
      marginLeft: indicator.x > 60 ? 0 : 24,
      marginRight: indicator.x > 60 ? 24 : 0,
      top: '50%',
      transform: 'translateY(-50%)',
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Product image */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-auto md:h-[600px] object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-charcoal/10" />

        {/* Indicator points */}
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className="absolute z-20"
            style={{
              left: `${indicator.x}%`,
              top: `${indicator.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Indicator button - responsive sizing */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveIndicator(
                activeIndicator === indicator.id ? null : indicator.id
              )}
              className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white transition-all duration-300 ${
                activeIndicator === indicator.id 
                  ? 'bg-gold border-gold scale-110' 
                  : 'bg-charcoal/50 backdrop-blur-sm hover:bg-gold/80'
              }`}
            >
              {/* Plus icon inside */}
              <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-light">
                {activeIndicator === indicator.id ? '−' : '+'}
              </span>
              
              {/* Pulse effect */}
              {activeIndicator === indicator.id && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-gold"
                />
              )}
            </motion.button>

            {/* Desktop popup content */}
            <AnimatePresence>
              {activeIndicator === indicator.id && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-30 w-72 bg-white rounded-2xl shadow-2xl p-5"
                  style={getPopupStyle(indicator) as React.CSSProperties}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndicator(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h4 className="font-bold text-charcoal text-lg mb-1 pr-8">
                    {indicator.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {indicator.description}
                  </p>

                  {indicator.details && (
                    <ul className="space-y-2">
                      {indicator.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-charcoal/70"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Info prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-charcoal/60 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm"
        >
          <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Tap <span className="font-semibold text-gold">+</span> to explore</span>
        </motion.div>
      </div>

      {/* Mobile Modal Popup */}
      <AnimatePresence>
        {activeIndicator && isMobile && currentIndicator && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIndicator(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              
              {/* Close button */}
              <button
                onClick={() => setActiveIndicator(null)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <h4 className="font-bold text-charcoal text-xl mb-2 pr-8">
                {currentIndicator.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {currentIndicator.description}
              </p>

              {currentIndicator.details && (
                <ul className="space-y-3">
                  {currentIndicator.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-charcoal/70"
                    >
                      <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Feature callout component
interface FeatureCalloutProps {
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  layout?: 'grid' | 'carousel';
}

export function FeatureCallout({ features, layout = 'grid' }: FeatureCalloutProps) {
  if (layout === 'carousel') {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-72 p-6 bg-card rounded-2xl border border-gold/10 hover:border-gold/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="p-4 sm:p-6 bg-card rounded-2xl border border-gold/10 hover:border-gold/30 transition-all hover:shadow-lg hover:shadow-gold/5"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-3 sm:mb-4">
            {feature.icon}
          </div>
          <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 sm:mb-2">{feature.title}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Animated comparison slider
interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: {
    before: string;
    after: string;
  };
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  label = { before: 'Before', after: 'After' },
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={(e) => {
        if (isDragging) {
          handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
        }
      }}
      onTouchMove={(e) => {
        handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
      }}
    >
      {/* After image (bottom layer) */}
      <img
        src={afterImage}
        alt={label.after}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before image (top layer with clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={label.before}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-charcoal rounded-full" />
            <div className="w-0.5 h-4 bg-charcoal rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm">
        {label.before}
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm">
        {label.after}
      </div>
    </div>
  );
}
