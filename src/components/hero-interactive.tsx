'use client';

import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Play, ArrowRight, Crown, Star, Scissors, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================
// 1. MOUSE PARALLAX HOOK
// ============================================
function useMouseParallax(strength: number = 1) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth * strength);
      mouseY.set((clientY - innerHeight / 2) / innerHeight * strength);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength, mouseX, mouseY]);

  return { mouseX, mouseY };
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
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -15;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 15;
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
// 6. FLOATING PARTICLES WITH MOUSE INTERACTION
// ============================================
function InteractiveParticles() {
  const { mouseX, mouseY } = useMouseParallax(100);
  const x = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 6}%`,
            top: `${10 + (i % 5) * 18}%`,
            x: useTransform(x, (v) => v * (i % 2 === 0 ? 30 : -30)),
            y: useTransform(y, (v) => v * (i % 2 === 0 ? 30 : -30)),
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-amber-400' : 'bg-gold'}`} />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// 7. FLOATING SUIT CARDS
// ============================================
function FloatingSuitCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
      {/* Left floating card */}
      <motion.div
        className="absolute left-8 top-1/3"
        animate={{
          y: [0, -15, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <TiltCard className="w-48 h-64 rounded-xl overflow-hidden shadow-2xl">
          <img
            src="/images/malipula/service1.jpg"
            alt="Premium Suit"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-semibold">Premium Collection</p>
            <p className="text-amber-400 text-xs">From TZS 450,000</p>
          </div>
        </TiltCard>
      </motion.div>

      {/* Right floating card */}
      <motion.div
        className="absolute right-12 top-1/4"
        animate={{
          y: [0, 20, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <TiltCard className="w-40 h-56 rounded-xl overflow-hidden shadow-2xl">
          <img
            src="/images/malipula/service3.jpg"
            alt="Traditional Wear"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-semibold">Traditional</p>
            <p className="text-amber-400 text-xs">Custom Made</p>
          </div>
        </TiltCard>
      </motion.div>

      {/* Small accent card */}
      <motion.div
        className="absolute right-24 bottom-1/4"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        <div className="w-24 h-32 rounded-lg overflow-hidden shadow-xl">
          <img
            src="/images/malipula/service2.jpg"
            alt="Shirts"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// 8. SCROLL INDICATOR WITH ANIMATION
// ============================================
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">Explore</span>
        <div className="w-6 h-10 border-2 border-amber-500/40 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-amber-400 rounded-full"
          />
        </div>
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
  const { mouseX, mouseY } = useMouseParallax(50);
  const backgroundX = useSpring(useTransform(mouseX, (v) => v * 20), { stiffness: 50, damping: 20 });
  const backgroundY = useSpring(useTransform(mouseY, (v) => v * 20), { stiffness: 50, damping: 20 });

  const typewriterWords = ['Craftsmanship', 'Elegance', 'Tradition', 'Excellence'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ x: backgroundX, y: backgroundY, scale: 1.1 }}
      >
        <img
          src="/images/malipula/hero.jpg"
          alt="Malipula Suits"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/60" />
      </motion.div>

      {/* Interactive Particles */}
      <InteractiveParticles />

      {/* Floating Suit Cards */}
      <FloatingSuitCards />

      {/* Decorative Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-96 h-96 border border-amber-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] border border-amber-500/5 rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2 text-sm">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                </motion.div>
                Award-Winning Tailor - EAGMA 2025
              </Badge>
            </motion.div>

            {/* Main Heading with Typewriter */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
            >
              Royal.{' '}
              <span className="text-gold-gradient">Rooted.</span>
              <br />
              <span className="text-white/90">Refined.</span>
            </motion.h1>

            {/* Typewriter Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl sm:text-2xl text-amber-400 mb-4 h-8"
            >
              <TypewriterText words={typewriterWords} className="font-light" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Where craftsmanship meets elegance, and tradition blends seamlessly with modern style.
              Experience exceptional tailoring from the heart of Dar es Salaam.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <MagneticButton href="/shop" strength={0.2}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold text-lg px-8 py-6 shadow-lg shadow-amber-500/25 transition-all duration-300 group"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Shop Collection
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </MagneticButton>

              <MagneticButton href="/booking" strength={0.2}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 font-semibold text-lg px-8 py-6 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Book Fitting
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-gold-gradient">
                    {stat.numericValue ? (
                      <AnimatedCounter 
                        value={stat.numericValue} 
                        suffix={stat.value.replace(/[0-9,]/g, '')} 
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Brand Card with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex justify-center"
          >
            <TiltCard className="relative w-96" glareEnabled>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 text-center border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/40 rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-500/40 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-500/40 rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-500/40 rounded-br-3xl" />

                  {/* Animated Logo */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="mb-6"
                  >
                    <img
                      src="/images/malipula/m.png"
                      alt="Malipula"
                      className="w-32 h-32 mx-auto object-contain"
                    />
                  </motion.div>

                  <h3 className="text-3xl font-bold text-white mb-2">MALIPULA SUITS</h3>
                  <p className="text-amber-400 mb-6 text-lg">Crafting Excellence Since 2015</p>

                  {/* Animated Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: star * 0.1 }}
                      >
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">Based on 500+ reviews</p>

                  {/* Scissors Icon */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <Scissors className="w-8 h-8 text-slate-900" />
                  </motion.div>
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

export default InteractiveHeroSection;
