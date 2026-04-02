'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export function AnimatedButton({
  text,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  className = '',
}: AnimatedButtonProps) {
  // Split text into characters for animation
  const characters = text.split('');

  const baseStyles = 'relative inline-flex items-center justify-center font-semibold overflow-hidden transition-all duration-300 rounded-full group';
  
  const variants = {
    primary: 'bg-gold text-charcoal hover:bg-gold-dark',
    secondary: 'bg-navy text-white hover:bg-navy-light',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-charcoal',
  };

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const ButtonContent = (
    <>
      {/* Background shine effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Character animated text */}
      <span className="relative flex items-center gap-2">
        <span className="flex">
          {characters.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 0 }}
              whileHover={{ y: -3 }}
              transition={{
                duration: 0.3,
                delay: i * 0.02,
                ease: 'easeInOut',
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
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        )}
      </span>
    </>
  );

  const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedClassName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {ButtonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={combinedClassName}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ButtonContent}
    </motion.button>
  );
}

// Specialized CTA button with more dramatic animation
interface CTAButtonProps {
  text: string;
  subtext?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function CTAButton({
  text,
  subtext,
  href,
  onClick,
  className = '',
}: CTAButtonProps) {
  const characters = text.split('');

  const ButtonContent = (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gold/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main button */}
      <div className="relative inline-flex flex-col items-center">
        <motion.div
          className="relative inline-flex items-center gap-3 px-10 py-5 bg-gold text-charcoal font-bold text-lg rounded-full overflow-hidden"
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 169, 98, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shine effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Animated characters */}
          <span className="relative flex">
            {characters.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.2,
                    delay: i * 0.03,
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
          
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 5, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.div>
        
        {subtext && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {subtext}
          </motion.span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className={`group ${className}`}>
        {ButtonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`group ${className}`}>
      {ButtonContent}
    </button>
  );
}
