'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete?: () => void;
  duration?: number;
}

// Pre-generate deterministic "random" values for SSR consistency
const generateSeededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Pre-computed particle positions (deterministic for SSR)
const precomputedParticles = [...Array(30)].map((_, i) => ({
  id: i,
  left: generateSeededRandom(i * 3) * 100,
  duration: generateSeededRandom(i * 3 + 1) * 4 + 3,
  delay: generateSeededRandom(i * 3 + 2) * 3,
  scale: generateSeededRandom(i * 3 + 3) * 0.5 + 0.5,
}));

// Define phases outside component to prevent recreation
const phases = [
  {
    text: "In the heart of Dar es Salaam...",
    subtext: "",
    showVisual: false,
    duration: 2500,
  },
  {
    text: "Where tradition meets elegance...",
    subtext: "",
    showVisual: true,
    duration: 3000,
  },
  {
    text: "Every stitch tells a story...",
    subtext: "",
    showVisual: true,
    duration: 3000,
  },
  {
    text: "Royal. Rooted. Refined.",
    subtext: "MALIPULA SUITS",
    showVisual: true,
    duration: 3500,
  },
];

// Calculate total duration
const TOTAL_DURATION = phases.reduce((acc, p) => acc + p.duration, 0);

// Cinematic intro with visuals and animations
export function CinematicIntro({ 
  onComplete,
}: CinematicIntroProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Use refs to prevent multiple completions
  const hasCompleted = useRef(false);
  const onCompleteRef = useRef(onComplete);
  
  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Main timing effect - only runs once
  useEffect(() => {
    if (hasCompleted.current) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsedTime = 0;

    // Set up timers for each phase transition
    phases.forEach((phase, index) => {
      if (index === 0) {
        // First phase starts immediately
        setCurrentPhase(0);
        if (phase.showVisual) setShowImage(true);
      }
      
      // Calculate when this phase should end
      elapsedTime += phase.duration;
      
      // Set timer for next phase
      if (index < phases.length - 1) {
        const timer = setTimeout(() => {
          setCurrentPhase(index + 1);
          if (phases[index + 1].showVisual) setShowImage(true);
        }, elapsedTime);
        timers.push(timer);
      }
    });

    // Final completion timer
    const completeTimer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, TOTAL_DURATION + 800);
    timers.push(completeTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []); // Empty dependency array - only runs once

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] }
          }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-charcoal"
        >
          {/* Background Image with Reveal */}
          <div className="absolute inset-0">
            {/* Image layer */}
            <motion.div
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ 
                scale: showImage ? 1 : 1.3, 
                opacity: showImage ? 0.5 : 0 
              }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img
                src="/images/malipula/hero.jpg"
                alt="Malipula"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Animated gradient overlays */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(26, 39, 68, 0.97) 0%, rgba(13, 22, 40, 0.95) 100%)',
                  'linear-gradient(135deg, rgba(26, 39, 68, 0.90) 0%, rgba(13, 22, 40, 0.92) 100%)',
                  'linear-gradient(135deg, rgba(26, 39, 68, 0.97) 0%, rgba(13, 22, 40, 0.95) 100%)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0"
            />

            {/* Animated gold accent sweep */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ 
                x: ['100%', '-100%'],
                opacity: [0, 0.4, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.5
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/30 to-transparent skew-x-12"
            />
          </div>

          {/* Particle effects */}
          {mounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {precomputedParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    x: `${particle.left}%`, 
                    y: '100%',
                    opacity: 0,
                    scale: particle.scale
                  }}
                  animate={{ 
                    y: '-20%',
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: 'linear'
                  }}
                  className="absolute w-1 h-1 bg-gold rounded-full shadow-lg shadow-gold/50"
                  style={{ left: `${particle.left}%` }}
                />
              ))}
            </div>
          )}

          {/* Decorative geometric shapes */}
          <motion.div
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 0.08, rotate: 0, scale: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute top-1/4 -left-20 w-96 h-96 border-2 border-gold rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 0.05, rotate: 0, scale: 1 }}
            transition={{ duration: 2.5, delay: 0.3 }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] border border-gold rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold rounded-full"
          />

          {/* Animated horizontal line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"
          />

          {/* Animated vertical line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold to-transparent"
          />

          {/* Corner decorations */}
          {[
            { top: '1.5rem', left: '1.5rem', borders: ['border-t-2', 'border-l-2'] },
            { top: '1.5rem', right: '1.5rem', borders: ['border-t-2', 'border-r-2'] },
            { bottom: '1.5rem', left: '1.5rem', borders: ['border-b-2', 'border-l-2'] },
            { bottom: '1.5rem', right: '1.5rem', borders: ['border-b-2', 'border-r-2'] },
          ].map((corner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.15, duration: 0.6, type: 'spring', stiffness: 200 }}
              className={`absolute w-16 h-16 md:w-24 md:h-24 border-gold/50 ${corner.borders.join(' ')}`}
              style={{ top: corner.top, left: corner.left, right: corner.right, bottom: corner.bottom }}
            />
          ))}

          {/* Main content container */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
            {/* Animated logo mark */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 100, delay: 0.3 }}
              className="mb-12"
            >
              <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-28 h-28 md:w-40 md:h-40 border border-gold/40 rounded-full"
                  style={{ left: -8, top: -8 }}
                />
                {/* Inner rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 border border-gold/25 rounded-full"
                  style={{ left: -4, top: -4 }}
                />
                {/* Innermost rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border border-gold/15 rounded-full"
                />
                {/* Logo */}
                <motion.img
                  src="/images/malipula/m.png"
                  alt="Malipula"
                  className="relative w-20 h-20 md:w-28 md:h-28 object-contain"
                  animate={{ 
                    filter: ['drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))', 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.6))', 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Text content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 50, filter: 'blur(25px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -50, filter: 'blur(25px)' }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center max-w-4xl"
              >
                {/* Main text with word animation */}
                <div className="overflow-hidden mb-4">
                  <motion.p className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white tracking-wide leading-tight">
                    {phases[currentPhase].text.split(' ').map((word, wordIndex) => (
                      <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0, y: 40, rotateX: -90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ 
                          delay: wordIndex * 0.12,
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="inline-block mr-2 md:mr-4"
                        style={{ transformOrigin: 'center bottom' }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.p>
                </div>

                {/* Subtext */}
                {phases[currentPhase].subtext && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="flex flex-col items-center mt-10"
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-8"
                    />
                    <motion.p
                      initial={{ opacity: 0, y: 10, letterSpacing: '0.2em' }}
                      animate={{ opacity: 1, y: 0, letterSpacing: '0.5em' }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-gold text-base md:text-xl tracking-[0.5em] uppercase font-light"
                    >
                      {phases[currentPhase].subtext}
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: TOTAL_DURATION / 1000, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light origin-left"
            />
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                className="relative"
              >
                <div 
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-700 ${
                    index === currentPhase 
                      ? 'bg-gold scale-125' 
                      : index < currentPhase 
                        ? 'bg-gold/50' 
                        : 'bg-white/20'
                  }`}
                />
                {index === currentPhase && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gold"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => {
              if (!hasCompleted.current) {
                hasCompleted.current = true;
                setIsComplete(true);
                onCompleteRef.current?.();
              }
            }}
            className="absolute top-6 right-6 md:top-8 md:right-8 px-5 py-2.5 text-white/60 hover:text-white text-sm tracking-wider uppercase transition-all duration-300 border border-white/20 hover:border-gold hover:text-gold rounded-full backdrop-blur-sm"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Alternative: Split screen reveal intro
export function SplitRevealIntro({
  onComplete,
  duration = 5000
}: CinematicIntroProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const hasCompleted = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setShowContent(true);
    
    const timer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div className="fixed inset-0 z-[9999] flex">
          {/* Left panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
            className="w-1/2 bg-charcoal relative overflow-hidden"
          >
            <img
              src="/images/malipula/service1.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-charcoal/70" />
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
            className="w-1/2 bg-navy relative overflow-hidden"
          >
            <img
              src="/images/malipula/service2.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-navy/70" />
          </motion.div>

          {/* Center content */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            {showContent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="mb-8"
                >
                  <img
                    src="/images/malipula/m.png"
                    alt="Malipula"
                    className="w-28 h-28 md:w-36 md:h-36 mx-auto object-contain"
                  />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-4"
                >
                  Malipula Suits
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-gold text-lg tracking-[0.3em] uppercase"
                >
                  Royal. Rooted. Refined.
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export
export { CinematicIntro as Preloader };
