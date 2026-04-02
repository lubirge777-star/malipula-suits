'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Scroll-triggered reveal section
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animations[animation].initial}
      animate={isInView ? animations[animation].animate : animations[animation].initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax section wrapper
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
  offset?: ['start' | 'end', 'start' | 'end'];
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  offset = ['start', 'end'],
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${offset[0]} end`, `start ${offset[1]}`],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}

// Stagger children on scroll
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({
  className = '',
  color = 'bg-gold',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${color} origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
}

// Image parallax on scroll
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  speed = 0.5,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        style={{ y, scale }}
      />
    </div>
  );
}

// Text scroll animation (text changes as you scroll)
interface TextScrollProps {
  texts: string[];
  className?: string;
}

export function TextScroll({ texts, className = '' }: TextScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const index = useTransform(
    scrollYProgress,
    texts.map((_, i) => i / texts.length),
    texts.map((_, i) => i)
  );

  return (
    <div ref={ref} className={`relative h-[200vh] ${className}`}>
      <div className="sticky top-1/2 -translate-y-1/2 h-20 overflow-hidden">
        {texts.map((text, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
            style={{
              opacity: useTransform(
                scrollYProgress,
                [(i - 0.5) / texts.length, i / texts.length, (i + 0.5) / texts.length],
                [0, 1, 0]
              ),
              y: useTransform(
                scrollYProgress,
                [(i - 0.5) / texts.length, i / texts.length, (i + 0.5) / texts.length],
                [50, 0, -50]
              ),
            }}
          >
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  const displayValue = useTransform(scrollYProgress, [0, 1], [0, value]);
  const springValue = useSpring(displayValue, { duration: duration * 1000 });

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>
        {isInView ? (
          <motion.span>{springValue.get()}</motion.span>
        ) : (
          0
        )}
      </motion.span>
      {suffix}
    </span>
  );
}

// Reveal image with mask
interface MaskRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export function MaskReveal({
  children,
  className = '',
  direction = 'left',
  delay = 0,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const clipPaths = {
    left: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
    right: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
    up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
    down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: clipPaths[direction][0] }}
      animate={isInView ? { clipPath: clipPaths[direction][1] } : { clipPath: clipPaths[direction][0] }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
