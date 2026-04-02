'use client';

import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Play, ArrowRight, Crown, Star, Scissors, Sparkles, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================
// 1. MOUSE PARALLAX HOOK (Limited movement, disabled on mobile)
// ============================================
function useMouseParallax(strength: number = 1) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = window;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth * strength);
      mouseY.set((clientY - innerHeight / 2) / innerHeight * strength);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength, mouseX, mouseY, isMobile]);

  return { mouseX, mouseY, isMobile };
}

// ============================================
// 2. TYPEWRITER EFFECT COMPONENT
// ============================================
interface TypewriterTextProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

function TypewriterText({ 
  words, 
  className = '', 
  typingSpeed = 80, 
  deletingSpeed = 50,
  pauseDuration = 2000 
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  );
}

// ============================================
// 3. ANIMATED COUNTER COMPONENT
// ============================================
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2,
  className = '' 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// ============================================
// 4. MAGNETIC BUTTON COMPONENT
// ============================================
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
}

function MagneticButton({ children, className = '', strength = 0.3, href, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ============================================
// 5. 3D TILT CARD COMPONENT
// ============================================
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glareEnabled?: boolean;
}

function TiltCard({ children, className = '', glareEnabled = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {children}
      {glareEnabled && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none rounded-2xl"
          style={{ transform: 'translateZ(50px)' }}
        />
      )}
    </motion.div>
  );
}

// ============================================
// 6. FLOATING PARTICLES - Enhanced for Mobile
// ============================================
function FloatingParticles({ isMobile = false }: { isMobile?: boolean }) {
  const particleCount = isMobile ? 8 : 12;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * (isMobile ? 10 : 7)}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, isMobile ? -10 : -15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        >
          <div className={`rounded-full ${i % 2 === 0 ? 'bg-amber-400/50' : 'bg-amber-300/30'} ${isMobile ? 'w-1.5 h-1.5' : 'w-1 h-1'}`} />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// 7. MOBILE DECORATIVE ELEMENTS - Beautiful & Engaging
// ============================================
function MobileDecorativeElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden sm:hidden">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 -left-20 w-50 h-50 bg-amber-400/15 rounded-full blur-3xl"
      />
      
      {/* Floating geometric shapes */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 right-8 w-6 h-6 border border-amber-500/20 rotate-45"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute bottom-1/3 left-6 w-4 h-4 border border-amber-400/15 rounded-full"
      />
      
      {/* Gold shimmer line */}
      <motion.div
        animate={{ 
          x: ['-100%', '200%'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
        className="absolute top-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
      />
    </div>
  );
}

// ============================================
// 8. DESKTOP DECORATIVE ELEMENTS
// ============================================
function DesktopDecorativeElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
      {/* Subtle rotating circle - top right */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-80 h-80 border border-amber-500/8 rounded-full"
      />
      
      {/* Subtle rotating circle - bottom left */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -left-32 w-[450px] h-[450px] border border-amber-500/5 rounded-full"
      />

      {/* Gold accent lines */}
      <div className="absolute top-1/4 left-0 w-32 h-[1px] bg-gradient-to-r from-amber-500/30 to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-40 h-[1px] bg-gradient-to-l from-amber-500/20 to-transparent" />
      
      {/* Subtle corner decorations */}
      <div className="absolute top-20 left-10 w-12 h-12 border-l border-t border-amber-500/20" />
      <div className="absolute bottom-20 right-10 w-12 h-12 border-r border-b border-amber-500/20" />
    </div>
  );
}

// ============================================
// 9. SCROLL INDICATOR - Enhanced
// ============================================
function ScrollIndicator({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{ y: [0, isMobile ? 6 : 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        {!isMobile && (
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        )}
        <div className={`w-5 h-8 sm:h-8 border border-amber-500/30 rounded-full flex justify-center pt-1.5 ${isMobile ? 'backdrop-blur-sm bg-charcoal/30' : ''}`}>
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-amber-400/70 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// 10. MOBILE STATS CARD - Beautiful compact design
// ============================================
function MobileStatsCard({ stats }: { stats: { label: string; value: string; numericValue?: number }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="sm:hidden mt-8"
    >
      <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-2xl" />
        
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(0, 4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="relative text-center py-2"
            >
              <div className="text-xl font-bold text-gold-gradient">
                {stat.numericValue ? (
                  <AnimatedCounter 
                    value={stat.numericValue} 
                    suffix={stat.value.replace(/[0-9,]/g, '')} 
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// 11. MOBILE FLOATING BRAND ELEMENT
// ============================================
function MobileBrandElement() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="absolute top-24 right-4 sm:hidden"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="bg-charcoal/60 backdrop-blur-xl rounded-2xl p-3 border border-amber-500/20 shadow-lg shadow-amber-500/5">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img
              src="/images/malipula/m.png"
              alt="Malipula"
              className="w-12 h-12 object-contain"
            />
          </motion.div>
        </div>
        
        {/* Floating badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full px-2 py-0.5 shadow-lg"
        >
          <span className="text-[8px] font-bold text-charcoal">EAGMA 2025</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN HERO SECTION COMPONENT
// ============================================
interface InteractiveHeroSectionProps {
  stats?: { label: string; value: string; numericValue?: number }[];
}

export function InteractiveHeroSection({ 
  stats = [
    { label: 'Happy Customers', value: '5,000+', numericValue: 5000 },
    { label: 'Years of Excellence', value: '10+', numericValue: 10 },
    { label: 'Custom Designs', value: '15,000+', numericValue: 15000 },
    { label: 'Award Winning', value: '2025' },
  ]
}: InteractiveHeroSectionProps) {
  const { mouseX, mouseY, isMobile } = useMouseParallax(1);
  const backgroundX = useSpring(useTransform(mouseX, (v) => v * 5), { stiffness: 100, damping: 30 });
  const backgroundY = useSpring(useTransform(mouseY, (v) => v * 5), { stiffness: 100, damping: 30 });

  const typewriterWords = ['Craftsmanship', 'Elegance', 'Tradition', 'Excellence'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isMobile && (
          <motion.div
            className="absolute inset-[-20px]"
            style={{ x: backgroundX, y: backgroundY }}
          >
            <img
              src="/images/malipula/hero.jpg"
              alt="Malipula Suits"
              className="w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover object-center"
            />
          </motion.div>
        )}
        {isMobile && (
          <img
            src="/images/malipula/hero.jpg"
            alt="Malipula Suits"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        
        {/* Gradient Overlays - Mobile optimized */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/[0.97] via-charcoal/90 to-charcoal/75 hidden sm:block" />
        
        {/* Mobile gradient - darker and from bottom for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/60 sm:hidden" />
        
        {/* Mobile side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40 sm:hidden" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles isMobile={isMobile} />

      {/* Decorative Elements */}
      <MobileDecorativeElements />
      <DesktopDecorativeElements />

      {/* Mobile Brand Element - Top Right */}
      <MobileBrandElement />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-28 md:pt-32 lg:pt-36 pb-20 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 sm:mb-6"
            >
              <Badge className="bg-gold/15 text-gold border-gold/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm backdrop-blur-sm inline-flex items-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                </motion.div>
                Award-Winning Tailor
              </Badge>
            </motion.div>

            {/* Main Heading - Mobile optimized with staggered animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-3 sm:mb-6"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="inline-block"
                >
                  Royal.
                </motion.span>{' '}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="inline-block text-gold-gradient"
                >
                  Rooted.
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="inline-block text-white/90"
                >
                  Refined.
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Typewriter Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-amber-400 mb-4 sm:mb-4 h-7 sm:h-8"
            >
              <TypewriterText words={typewriterWords} className="font-light" />
            </motion.div>

            {/* Description - Hidden on very small screens, shown on larger */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="hidden sm:block text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Where craftsmanship meets elegance, and tradition blends seamlessly with modern style.
              Experience exceptional tailoring from the heart of Dar es Salaam.
            </motion.p>

            {/* Mobile Short Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="sm:hidden text-sm text-gray-300 mb-6 px-2"
            >
              Experience exceptional tailoring from the heart of Dar es Salaam.
            </motion.p>

            {/* CTA Buttons - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0"
            >
              <MagneticButton href="/shop" strength={0.15}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold text-base sm:text-base md:text-lg px-8 sm:px-8 py-6 sm:py-6 shadow-lg shadow-amber-500/25 transition-all duration-300 group rounded-xl"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Shop Collection
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </MagneticButton>

              <MagneticButton href="/booking" strength={0.15}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 font-semibold text-base sm:text-base md:text-lg px-8 sm:px-8 py-6 sm:py-6 transition-all duration-300 backdrop-blur-sm rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Book Fitting
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Desktop Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="hidden sm:grid grid-cols-4 gap-6 mt-10 md:mt-12 pt-8 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center py-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gold-gradient">
                    {stat.numericValue ? (
                      <AnimatedCounter 
                        value={stat.numericValue} 
                        suffix={stat.value.replace(/[0-9,]/g, '')} 
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Brand Card (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex justify-center items-center"
          >
            <TiltCard className="relative w-72 xl:w-80" glareEnabled>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 xl:p-8 text-center border border-amber-500/15 shadow-2xl">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-amber-500/30 rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-amber-500/30 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-amber-500/30 rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-amber-500/30 rounded-br-3xl" />

                  {/* Animated Logo */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="mb-4"
                  >
                    <img
                      src="/images/malipula/m.png"
                      alt="Malipula"
                      className="w-20 h-20 xl:w-24 xl:h-24 mx-auto object-contain"
                    />
                  </motion.div>

                  <h3 className="text-xl xl:text-2xl font-bold text-white mb-1">MALIPULA SUITS</h3>
                  <p className="text-amber-400 mb-3 text-sm xl:text-base">Crafting Excellence Since 2015</p>

                  {/* Animated Stars */}
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: star * 0.1 }}
                      >
                        <Star className="w-4 h-4 xl:w-5 xl:h-5 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs">Based on 500+ reviews</p>

                  {/* Scissors Icon */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <Scissors className="w-4 h-4 xl:w-5 xl:h-5 text-slate-900" />
                  </motion.div>
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Mobile Stats Card - Below content */}
        <MobileStatsCard stats={stats} />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator isMobile={isMobile} />

      {/* Bottom gradient for smooth section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </section>
  );
}

export default InteractiveHeroSection;
