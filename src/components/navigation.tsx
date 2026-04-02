'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Crown,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/api/hooks';
import { useAuth } from '@/lib/auth/auth-context';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Fabrics', href: '/fabrics' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// Animation variants
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.08,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const menuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { cart } = useCart();
  const { user } = useAuth();

  const cartCount = cart?.length || 0;

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const showGlass = scrolled || !transparent;

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <motion.div
          animate={{
            y: showGlass ? 0 : 0,
          }}
          className={`relative max-w-6xl mx-auto rounded-2xl overflow-hidden transition-all duration-500 ${
            showGlass
              ? 'bg-slate-900/70 backdrop-blur-2xl shadow-2xl shadow-black/30'
              : transparent
              ? 'bg-transparent'
              : 'bg-slate-900/50 backdrop-blur-xl'
          }`}
          style={{
            boxShadow: showGlass
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : 'none',
          }}
        >
          {/* Animated glowing border */}
          {showGlass && (
            <>
              {/* Top glow line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Moving shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent skew-x-12"
                  animate={{
                    x: ['-100%', '400%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-amber-400/60 to-transparent" />
                <div className="absolute top-0 left-0 w-[1px] h-8 bg-gradient-to-b from-amber-400/60 to-transparent" />
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-l from-amber-400/60 to-transparent" />
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-amber-400/60 to-transparent" />
              </div>
            </>
          )}

          {/* Inner glow overlay */}
          {showGlass && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />
          )}

          <div className="relative px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                variants={linkVariants}
                className="flex items-center"
              >
                <Link href="/" className="flex items-center gap-2.5 group">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="relative"
                  >
                    <img
                      src="/images/malipula/m.png"
                      alt="Malipula"
                      className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-lg"
                    />
                    {/* Logo glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-amber-400/40 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.6, 0.4],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                  <div className="hidden sm:flex flex-col">
                    <motion.span
                      className="text-lg font-bold tracking-wider text-white"
                      whileHover={{ color: '#fbbf24' }}
                    >
                      MALIPULA
                    </motion.span>
                    <span className="text-[10px] tracking-[0.2em] text-amber-400/80 uppercase">
                      Royal. Rooted. Refined.
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-xl p-1 backdrop-blur-sm">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={linkVariants}
                    onHoverStart={() => setHoveredLink(link.name)}
                    onHoverEnd={() => setHoveredLink(null)}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActive(link.href)
                          ? 'text-amber-400'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10">{link.name}</span>

                      {/* Active background pill */}
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-amber-400/15 rounded-lg border border-amber-400/30"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover background */}
                      {!isActive(link.href) && (
                        <motion.div
                          className="absolute inset-0 bg-white/10 rounded-lg"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: hoveredLink === link.name ? 1 : 0,
                            scale: hoveredLink === link.name ? 1 : 0.9,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Book Fitting Button - Desktop */}
                <motion.div
                  variants={linkVariants}
                  className="hidden md:block"
                >
                  <Link href="/booking">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        <span>Book Fitting</span>
                      </span>
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Icons */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {/* Wishlist */}
                  <motion.div variants={linkVariants}>
                    <Link href="/wishlist">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2.5 text-white/70 hover:text-white rounded-xl transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Cart */}
                  <motion.div variants={linkVariants}>
                    <Link href="/cart">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2.5 text-white/70 hover:text-white rounded-xl transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <AnimatePresence>
                          {cartCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                            >
                              {cartCount}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* User */}
                  <motion.div variants={linkVariants}>
                    <Link href={user ? '/account' : '/auth/login'}>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2.5 text-white/70 hover:text-white rounded-xl transition-colors"
                      >
                        <User className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Mobile Menu Toggle */}
                  <motion.button
                    variants={linkVariants}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
                  >
                    <AnimatePresence mode="wait">
                      {mobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-2xl z-50 lg:hidden border-l border-white/10"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col h-full relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative">
                      <img
                        src="/images/malipula/m.png"
                        alt="Malipula"
                        className="w-10 h-10 object-contain"
                      />
                      <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white">MALIPULA</span>
                      <span className="text-[9px] tracking-widest text-amber-400/70 uppercase">Royal. Rooted. Refined.</span>
                    </div>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="px-4 space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                            isActive(link.href)
                              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="font-medium">{link.name}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            isActive(link.href) ? 'text-amber-400' : 'text-white/30'
                          }`} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-6 mx-4 border-t border-white/10" />

                  {/* User Section */}
                  <div className="px-4 space-y-1">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href={user ? '/account' : '/auth/login'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{user ? 'My Account' : 'Sign In'}</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.48 }}
                    >
                      <Link
                        href="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Wishlist</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.56 }}
                    >
                      <Link
                        href="/cart"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Cart</span>
                        {cartCount > 0 && (
                          <Badge className="ml-auto bg-amber-500 text-white text-xs">
                            {cartCount} items
                          </Badge>
                        )}
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-6 border-t border-white/10">
                  <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold py-4 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="w-5 h-5" />
                      Book Your Fitting
                    </motion.button>
                  </Link>
                  <div className="flex items-center justify-center gap-2 mt-4 text-white/40">
                    <Sparkles className="w-3 h-3 text-amber-400/60" />
                    <p className="text-xs tracking-wide">
                      Royal. Rooted. Refined.
                    </p>
                    <Sparkles className="w-3 h-3 text-amber-400/60" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Export a simpler version for admin pages
export function AdminNavigation() {
  return null; // Admin has its own layout
}
