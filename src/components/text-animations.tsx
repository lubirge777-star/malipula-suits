'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// MDX.so-style character animated button
interface CharAnimatedButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showArrow?: boolean;
  arrowVariant?: 'right' | 'up-right';
  className?: string;
  disabled?: boolean;
}

export function CharAnimatedButton({
  text,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  arrowVariant = 'right',
  className = '',
  disabled = false,
}: CharAnimatedButtonProps) {
  const characters = text.split('');
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: 'bg-gold text-charcoal hover:bg-gold-dark',
    secondary: 'bg-navy text-white hover:bg-navy-light',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-charcoal',
    ghost: 'text-foreground hover:text-gold hover:bg-gold/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2',
    xl: 'px-10 py-5 text-xl gap-3',
  };

  const ButtonContent = (
    <motion.div
      ref={buttonRef}
      className={cn(
        'relative inline-flex items-center justify-center font-semibold rounded-full overflow-hidden transition-colors',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {/* Background shine effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Character animated text */}
      <span className="relative flex items-center">
        <span className="flex overflow-hidden">
          {characters.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 0 }}
              animate={{ 
                y: isHovered ? -3 : 0,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.02,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ 
                display: 'inline-block',
                transitionDelay: `${i * 15}ms`
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>

        {/* Animated arrow */}
        {showArrow && (
          <motion.span
            className="relative ml-1"
            initial={{ x: 0, opacity: 1 }}
            animate={{ 
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {arrowVariant === 'right' ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
          </motion.span>
        )}
      </span>
    </motion.div>
  );

  if (href && !disabled) {
    return (
      <a href={href} onClick={onClick}>
        {ButtonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled}>
      {ButtonContent}
    </button>
  );
}

// Split text reveal animation for headings
interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideIn' | 'blur';
  delay?: number;
  staggerAmount?: number;
}

export function SplitText({
  text,
  className = '',
  charClassName = '',
  animation = 'fadeUp',
  delay = 0,
  staggerAmount = 0.03,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const characters = text.split('');

  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
    },
  };

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className={cn('inline-block', charClassName)}
          initial={animations[animation].initial}
          animate={isInView ? animations[animation].animate : animations[animation].initial}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerAmount,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Word-by-word text reveal
interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function WordReveal({
  text,
  className = '',
  delay = 0,
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={cn('flex flex-wrap gap-x-2', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Animated underline link
interface AnimatedLinkProps {
  text: string;
  href: string;
  className?: string;
  underlineColor?: string;
}

export function AnimatedLink({
  text,
  href,
  className = '',
  underlineColor = 'bg-gold',
}: AnimatedLinkProps) {
  return (
    <motion.a
      href={href}
      className={cn('relative inline-block group', className)}
      whileHover={{ x: 3 }}
    >
      <span className="relative z-10">{text}</span>
      <span 
        className={cn(
          'absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300',
          underlineColor
        )} 
      />
    </motion.a>
  );
}

// Glowing button
interface GlowingButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  glowColor?: string;
  className?: string;
}

export function GlowingButton({
  text,
  onClick,
  href,
  glowColor = 'rgba(201, 169, 98, 0.5)',
  className = '',
}: GlowingButtonProps) {
  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: glowColor }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Button */}
      {href ? (
        <a
          href={href}
          className={cn(
            'relative px-8 py-4 bg-gold text-charcoal font-semibold rounded-full inline-block',
            className
          )}
        >
          {text}
        </a>
      ) : (
        <button
          onClick={onClick}
          className={cn(
            'relative px-8 py-4 bg-gold text-charcoal font-semibold rounded-full',
            className
          )}
        >
          {text}
        </button>
      )}
    </motion.div>
  );
}
