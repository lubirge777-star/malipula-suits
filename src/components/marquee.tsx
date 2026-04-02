'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
  text: string | string[];
  speed?: number; // animation duration in seconds
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
  separator?: string;
}

export function Marquee({
  text,
  speed = 25,
  direction = 'left',
  className = '',
  itemClassName = '',
  separator = '•',
}: MarqueeProps) {
  const items = Array.isArray(text) ? text : [text];
  const displayItems = [...items, ...items]; // Duplicate for seamless loop
  
  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex ${animationClass}`} style={{ animationDuration: `${speed}s` }}>
        {displayItems.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center mx-4 ${itemClassName}`}
          >
            {item}
            <span className="mx-8 opacity-50">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Multiple row marquee with alternating directions
interface MarqueeStackProps {
  rows: {
    text: string | string[];
    direction?: 'left' | 'right';
    speed?: number;
  }[];
  className?: string;
  rowClassName?: string;
}

export function MarqueeStack({ rows, className = '', rowClassName = '' }: MarqueeStackProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {rows.map((row, index) => (
        <Marquee
          key={index}
          text={row.text}
          direction={row.direction || index % 2 === 0 ? 'left' : 'right'}
          speed={row.speed || 25}
          className={rowClassName}
        />
      ))}
    </div>
  );
}

// Product/Service showcase marquee like Arturos
interface MarqueeShowcaseProps {
  items: {
    icon?: React.ReactNode;
    text: string;
    image?: string;
  }[];
  speed?: number;
  className?: string;
}

export function MarqueeShowcase({ items, speed = 30, className = '' }: MarqueeShowcaseProps) {
  const displayItems = [...items, ...items, ...items]; // Triple for good coverage

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div 
        className="inline-flex animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {displayItems.map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-3 mx-6 px-6 py-3 bg-white/5 rounded-full"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.text}
                className="w-8 h-8 object-cover rounded-full"
              />
            )}
            {item.icon}
            <span className="font-semibold tracking-wide">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
