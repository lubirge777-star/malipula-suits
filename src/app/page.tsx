'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Star,
  ArrowRight,
  ChevronRight,
  Crown,
  Scissors,
  Ruler,
  Truck,
  Shield,
  Phone,
  Play,
  Quote,
  Award,
  Sparkles,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CinematicIntro } from '@/components/preloader';
import { Marquee } from '@/components/marquee';
import { WhatsAppButton, ExpandableWhatsAppButton } from '@/components/whatsapp-button';
import { ServicesCarousel } from '@/components/services-carousel';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { ProductIndicators, FeatureCallout } from '@/components/product-indicators';
import { ScrollReveal, ScrollProgress } from '@/components/scroll-animations';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { InteractiveHeroSection } from '@/components/hero-interactive';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

// Categories with real Malipula services
const categories = [
  {
    name: 'Suits',
    image: '/images/malipula/service1.jpg',
    count: 45,
    slug: 'suits',
  },
  {
    name: 'Shirts',
    image: '/images/malipula/service2.jpg',
    count: 32,
    slug: 'shirts',
  },
  {
    name: 'Traditional Wear',
    image: '/images/malipula/service3.jpg',
    count: 28,
    slug: 'traditional-wear',
  },
  {
    name: 'Kaftans',
    image: '/images/malipula/service4.jpg',
    count: 18,
    slug: 'kaftans',
  },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Royal Navy Three-Piece Suit',
    price: 850000,
    originalPrice: 950000,
    image: '/images/malipula/service1.jpg',
    rating: 4.9,
    reviews: 24,
    isNew: true,
    isBestSeller: true,
    slug: 'royal-navy-three-piece-suit',
  },
  {
    id: 2,
    name: 'Classic Charcoal Blazer',
    price: 420000,
    originalPrice: null,
    image: '/images/malipula/service2.jpg',
    rating: 4.8,
    reviews: 18,
    isNew: false,
    isBestSeller: true,
    slug: 'classic-charcoal-blazer',
  },
  {
    id: 3,
    name: 'Premium Egyptian Cotton Shirt',
    price: 150000,
    originalPrice: 180000,
    image: '/images/malipula/team1.jpg',
    rating: 4.7,
    reviews: 32,
    isNew: true,
    isBestSeller: false,
    slug: 'premium-egyptian-cotton-shirt',
  },
  {
    id: 4,
    name: 'African Heritage Kaftan',
    price: 380000,
    originalPrice: null,
    image: '/images/malipula/service3.jpg',
    rating: 5.0,
    reviews: 15,
    isNew: false,
    isBestSeller: true,
    slug: 'african-heritage-kaftan',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Mwalimu Josephat',
    role: 'Business Executive',
    image: '/images/malipula/review1.jpg',
    content:
      'Malipula Suits transformed my wardrobe. The attention to detail in every stitch is remarkable. I have never felt more confident in my professional appearance.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Amina Hassan',
    role: 'Medical Director',
    image: '/images/malipula/review2-female.jpg',
    content:
      'The quality of fabrics and the precision of tailoring at Malipula is unmatched in Dar es Salaam. Their team truly understands the art of bespoke tailoring.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Engineer Michael',
    role: 'Tech Entrepreneur',
    image: '/images/malipula/review3.jpg',
    content:
      'From the initial consultation to the final fitting, the experience was exceptional. My wedding suit was perfect in every way. Thank you, Malipula!',
    rating: 5,
  },
];

// Team members with proper images
const team = [
  {
    name: 'Joseph Malipula',
    role: 'Master Tailor & Founder',
    image: '/images/malipula/team1.jpg',
  },
  {
    name: 'Grace Mwakasege',
    role: 'Head of Design',
    image: '/images/malipula/team2.jpg',
  },
  {
    name: 'Peter Kimaro',
    role: 'Senior Tailor',
    image: '/images/malipula/team3.jpg',
  },
  {
    name: 'Anna Mbeki',
    role: 'Customer Relations',
    image: '/images/malipula/team4-female.jpg',
  },
];

const stats = [
  { label: 'Happy Customers', value: '5,000+', numericValue: 5000 },
  { label: 'Years of Excellence', value: '10+', numericValue: 10 },
  { label: 'Custom Designs', value: '15,000+', numericValue: 15000 },
  { label: 'Award Winning', value: 'EAGMA 2025' },
];

const features = [
  {
    icon: Scissors,
    title: 'Expert Tailoring',
    description: 'Master craftsmen with decades of experience in bespoke tailoring.',
  },
  {
    icon: Ruler,
    title: 'Perfect Fit',
    description: 'Precise measurements and adjustments for your unique body.',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Complimentary delivery within Dar es Salaam for orders above TZS 300,000.',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: '100% satisfaction guarantee on all our tailored pieces.',
  },
];

// whyChooseFeatures removed - now using ServicesCarousel component

// Product indicators for a suit - ACCURATE positions for a formal suit
const suitIndicators = [
  {
    id: 'lapel',
    x: 50, // Center - where lapels meet
    y: 22, // Upper chest - lapels are visible here
    title: 'Peak Lapel',
    description: 'Hand-crafted peak lapels with pick stitching detail for a refined look.',
    details: ['100% Wool construction', 'Hand-finished edges', 'Satin trim option available'],
  },
  {
    id: 'chest-pocket',
    x: 32, // Left chest area
    y: 28, // Just below the shoulder line
    title: 'Welt Chest Pocket',
    description: 'Classic welt pocket perfectly positioned for your pocket square.',
    details: ['Reinforced stitching', 'Traditional 10° angle', 'Hand-sewn edges'],
  },
  {
    id: 'buttons',
    x: 50, // Center of jacket
    y: 42, // Mid-torso where front buttons are
    title: 'Corozo Buttons',
    description: 'Natural tagua nut buttons provide an elegant, eco-friendly finish.',
    details: ['Sustainable material', 'Natural luster finish', 'Durable construction'],
  },
  {
    id: 'waist-pocket',
    x: 28, // Left side at waist
    y: 52, // Waist level where flap pockets are
    title: 'Flap Pockets',
    description: 'Functional flap pockets with hand-sewn jetting for clean lines.',
    details: ['Reinforced corners', 'Jetted pocket option', 'Ticket pocket available'],
  },
  {
    id: 'fabric',
    x: 65, // Right side of jacket
    y: 38, // Mid-section showing fabric quality
    title: 'Premium Italian Wool',
    description: 'Super 150s Italian wool sourced from the finest mills.',
    details: ['Super 150s wool', 'Breathable weave', 'Natural wrinkle resistance'],
  },
];

// Scroll-triggered section wrapper
function ScrollTriggeredSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function MalipulaHome() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);
  const router = useRouter();

  // Check if user has visited before (using localStorage for persistence)
  useEffect(() => {
    const visited = localStorage.getItem('malipula_intro_shown_permanent');
    if (visited === 'true') {
      setHasVisited(true);
      setShowPreloader(false);
    }
  }, []);

  // Stable callback for preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Cinematic Intro - Only show on first visit */}
      {showPreloader && !hasVisited && (
        <CinematicIntro onComplete={handlePreloaderComplete} />
      )}

      {/* Navigation */}
      <Navigation transparent />

      {/* Master Hero Section */}
      <InteractiveHeroSection stats={stats} />

      {/* 3D Workshop Callout (Immersive Integration) */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center bg-white/5 rounded-[48px] p-8 md:p-16 border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full" />
                
                <div className="relative z-10">
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-6">Innovative Tooling</Badge>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">The <span className="text-gold-gradient">Workshop</span> Experience</h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Design your masterpiece in real-time. Our 3D workshop allows you to visualize every stitch, fabric grain, and silhouette detail before our master tailors begin their work.
                    </p>
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="space-y-2">
                             <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <Ruler className="text-amber-500 w-5 h-5" />
                             </div>
                             <h4 className="text-white font-bold">AI Measured</h4>
                             <p className="text-slate-500 text-xs text-balance">28 precise metrics captured via our proprietary AI vision engine.</p>
                        </div>
                        <div className="space-y-2">
                             <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <Shield className="text-amber-500 w-5 h-5" />
                             </div>
                             <h4 className="text-white font-bold">Authentic Only</h4>
                             <p className="text-slate-500 text-xs text-balance">100% Super 150s Italian Wool and Masterpiece Silk collections.</p>
                        </div>
                    </div>
                    <Link href="/workshop">
                        <Button className="h-14 px-8 bg-white/5 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black rounded-2xl transition-all">
                            Enter the 3D Workshop
                        </Button>
                    </Link>
                </div>

                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative aspect-square flex items-center justify-center rounded-[40px] overflow-hidden bg-black/40 border border-white/5"
                >
                    <div className="absolute inset-0 items-center justify-center flex">
                        <Box size={120} className="text-amber-500/10" />
                    </div>
                    <div className="z-10 text-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                           <Play className="text-black fill-black w-6 h-6 ml-1" />
                        </div>
                        <p className="text-white font-bold text-sm uppercase tracking-widest">Interactive Preview</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-4 sm:py-6 bg-slate-900 overflow-hidden">
        <Marquee
          text={[
            'BESPOKE TAILORING',
            'PREMIUM FABRICS',
            'HANDCRAFTED SUITS',
            'AFRICAN HERITAGE',
            'WEDDING ATTIRE',
            'CORPORATE WEAR',
            'CUSTOM FITTINGS',
            'EAGMA AWARD WINNER',
          ]}
          speed={30}
          itemClassName="text-sm sm:text-lg font-semibold text-amber-400 tracking-wider"
          className="py-3 sm:py-4"
        />
      </section>



      {/* Why Choose Malipula - Scroll Triggered */}
      <section className="bg-slate-950 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollTriggeredSection>
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                The Experience
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                Why Choose <span className="text-gold-gradient">Malipula</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
                Discover what makes us the premier tailoring destination in East Africa
              </p>
            </div>
          </ScrollTriggeredSection>

          <ServicesCarousel autoPlayInterval={5000} />
        </div>
      </section>

      {/* Discover the Details Section - FIXED INDICATORS */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeUp" className="text-center mb-8 sm:mb-12 md:mb-16">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
              Featured Design
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Discover the <span className="text-gold-gradient">Details</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Click on the indicators to explore the craftsmanship behind our signature suit.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale">
            <ProductIndicators
              image="/images/malipula/service1.jpg"
              imageAlt="Malipula Signature Suit - Click indicators to explore"
              indicators={suitIndicators}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Callouts */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureCallout
            features={[
              {
                icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
                title: 'Award Winning',
                description: 'EAGMA 2025 Best Tailor in East Africa',
              },
              {
                icon: <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />,
                title: 'Bespoke Service',
                description: 'Every piece custom-made to your measurements',
              },
              {
                icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />,
                title: 'Free Delivery',
                description: 'Within Dar es Salaam for orders above TZS 300,000',
              },
              {
                icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
                title: 'Satisfaction Guaranteed',
                description: '100% satisfaction or we will make it right',
              },
            ]}
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/malipula/about.jpg"
                  alt="About Malipula"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">10+</div>
                <div className="text-xs sm:text-sm font-medium">Years of Excellence</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">Our Story</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Crafting <span className="text-gold-gradient">Elegance</span> Since 2015
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Welcome to Malipula Suits, where craftsmanship meets elegance, and tradition blends seamlessly with modern style. As a visionary tailor and fashion designer based in the vibrant city of Dar es Salaam, Tanzania, we take pride in creating exceptional wardrobes for the discerning working class.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Every garment we create is a labor of love, a testament to our dedication to the art of tailoring. Our team of skilled artisans, with years of experience in the world of fashion, pour their heart and soul into every stitch, ensuring that each piece is a masterpiece.
              </p>
              <Link href="/about">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold text-sm sm:text-base">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
              Our Collections
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Explore Our <span className="text-gold-gradient">Categories</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              From timeless suits to contemporary kaftans, discover pieces that define your style.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer"
              >
                <Link href={`/shop?category=${category.slug}`}>
                  <div className="aspect-[3/4] relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                            {category.name}
                          </h3>
                          <p className="text-amber-400 text-xs sm:text-sm">{category.count} Products</p>
                        </div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 md:mb-16 gap-4"
          >
            <div className="text-center sm:text-left">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
                Best Sellers
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Featured <span className="text-gold-gradient">Products</span>
              </h2>
            </div>
            <Link href="/shop">
              <Button
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 text-sm sm:text-base"
              >
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/product/${product.slug}`}>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 sm:gap-2">
                        {product.isNew && (
                          <Badge className="bg-amber-500 text-slate-900 font-semibold text-xs">New</Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge className="bg-slate-800 text-white font-semibold text-xs">Best Seller</Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:text-slate-900 transition-colors"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:text-slate-900 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                      </div>

                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-full text-sm">
                          Quick View
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({product.reviews})
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-amber-600">
                          TZS {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            TZS {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
              Our Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Meet The <span className="text-gold-gradient">Artisans</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
              The skilled hands behind every masterpiece.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group text-center"
              >
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-amber-400 text-xs sm:text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              What Our <span className="text-gold-gradient">Clients Say</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Hear from our valued customers about their experience with Malipula Suits
            </p>
          </motion.div>

          <TestimonialsCarousel autoPlayInterval={6000} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Animated Background Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-amber-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.3, 1, 1.3], 
            opacity: [0.15, 0.3, 0.15],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 left-0 w-80 sm:w-[400px] h-80 sm:h-[400px] bg-amber-400/10 rounded-full blur-3xl"
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-1/4 w-32 h-32 border border-amber-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-amber-400/10 rotate-45"
        />
        
        {/* Particle effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-amber-400/30' : 'bg-amber-300/20'}`} />
          </motion.div>
        ))}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Animated Badge */}
            <motion.div variants={fadeInUp}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Badge className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/30 mb-4 sm:mb-6 text-xs sm:text-sm backdrop-blur-sm px-4 py-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mr-2"
                  >
                    ✨
                  </motion.span>
                  Limited Time Offer
                </Badge>
              </motion.div>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Book Your{' '}
              <motion.span
                className="text-gold-gradient inline-block"
                animate={{ 
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                Free Consultation
              </motion.span>
            </motion.h2>
            
            {/* Animated Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed"
            >
              Schedule a personal fitting session with our master tailors and discover the Malipula difference.
            </motion.p>
            
            {/* CTA Buttons with Enhanced Effects */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0"
            >
              <Link href="/booking" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-8 shadow-2xl shadow-amber-500/30 transition-all duration-300 rounded-2xl relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.span>
                      Book Appointment
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
                    />
                  </Button>
                </motion.div>
              </Link>
              
              <a href="tel:+255654321987" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 font-semibold text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-8 transition-all duration-300 backdrop-blur-sm rounded-2xl bg-white/5"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    </motion.span>
                    Call Us Now
                  </Button>
                </motion.div>
              </a>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 sm:mt-12 text-gray-400 text-xs sm:text-sm"
            >
              {[
                { icon: Shield, text: '100% Satisfaction' },
                { icon: Truck, text: 'Free Delivery' },
                { icon: Award, text: 'Award Winning' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Support Button */}
      <ExpandableWhatsAppButton 
        phoneNumber="+255655123456"
        message="Hello! I'm interested in booking a consultation for a custom suit at Malipula Suits."
        tooltipText="Tailoring Expert Online"
      />
    </div>
  );
}
