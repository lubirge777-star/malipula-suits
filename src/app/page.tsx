'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import Link from 'next/link';
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
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Play,
  Quote,
  Layers,
  Palette,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CinematicIntro, SplitRevealIntro } from '@/components/preloader';
import { Marquee, MarqueeShowcase } from '@/components/marquee';
import { AnimatedButton, CTAButton } from '@/components/animated-button';
import { WhatsAppButton } from '@/components/whatsapp-button';
// New animation components from design research
import { FeatureCards } from '@/components/horizontal-scroll';
import { ProductIndicators, FeatureCallout } from '@/components/product-indicators';
import { CharAnimatedButton, SplitText, WordReveal, MagneticButton } from '@/components/text-animations';
import { ScrollReveal, ParallaxSection, StaggerContainer, StaggerItem, ScrollProgress } from '@/components/scroll-animations';
import { Navigation } from '@/components/navigation';

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
    description: 'Premium bespoke suits for every occasion',
  },
  {
    name: 'Shirts',
    image: '/images/malipula/service2.jpg',
    count: 32,
    description: 'Custom-fitted shirts with premium fabrics',
  },
  {
    name: 'Traditional Wear',
    image: '/images/malipula/service3.jpg',
    count: 28,
    description: 'African heritage meets modern elegance',
  },
  {
    name: 'Kaftans',
    image: '/images/malipula/service4.jpg',
    count: 18,
    description: 'Royal kaftans for special occasions',
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
    image: '/images/malipula/review2.jpg',
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
    image: '/images/malipula/team4.jpg',
  },
];

const stats = [
  { label: 'Happy Customers', value: '5,000+' },
  { label: 'Years of Excellence', value: '10+' },
  { label: 'Custom Designs', value: '15,000+' },
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

export default function MalipulaHome() {
  const [showPreloader, setShowPreloader] = useState(true);

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
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Cinematic Intro */}
      {showPreloader && (
        <CinematicIntro 
          onComplete={handlePreloaderComplete}
        />
      )}
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton 
        phoneNumber="+255654321987"
        message="Hello! I'm interested in your tailoring services at Malipula Suits."
      />
      
      {/* Navigation */}
      <Navigation transparent />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/malipula/hero.jpg"
            alt="Malipula Suits"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/50" />
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-gold/30 via-transparent to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2 text-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Award-Winning Tailor - EAGMA 2025
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              >
                Royal.{' '}
                <span className="text-gold-gradient">Rooted.</span>
                <br />
                Refined.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Where craftsmanship meets elegance, and tradition blends seamlessly with modern style. 
                Experience exceptional tailoring from the heart of Dar es Salaam.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-lg px-8 py-6 btn-luxury"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-charcoal font-semibold text-lg px-8 py-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Our Story
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/20"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gold-gradient">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Brand Highlight */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="glass-gold rounded-2xl p-8 text-center">
                  <img
                    src="/images/malipula/m.png"
                    alt="Malipula"
                    className="w-32 h-32 mx-auto mb-6 object-contain"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">MALIPULA SUITS</h3>
                  <p className="text-gold mb-6">Crafting Excellence Since 2015</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Based on 500+ reviews</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Section - Inspired by Arturos */}
      <section className="py-6 bg-navy overflow-hidden">
        <Marquee
          text={[
            "BESPOKE TAILORING",
            "PREMIUM FABRICS",
            "HANDCRAFTED SUITS",
            "AFRICAN HERITAGE",
            "WEDDING ATTIRE",
            "CORPORATE WEAR",
            "CUSTOM FITTINGS",
            "EAGMA AWARD WINNER",
          ]}
          speed={30}
          itemClassName="text-lg font-semibold text-gold tracking-wider"
          className="py-4"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-gold/30 transition-shadow"
                >
                  <feature.icon className="w-8 h-8 text-charcoal" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Carousel */}
      <section className="bg-charcoal py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
                The Experience
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Why Choose <span className="text-gold-gradient">Malipula</span>
              </h2>
            </div>
          </ScrollReveal>
          
          <FeatureCards
            sections={[
              {
                id: 'craftsmanship',
                title: 'Craftsmanship',
                subtitle: 'Expert Artistry',
                description: 'Every stitch tells a story of dedication and precision, crafted by master tailors with decades of experience.',
                image: '/images/malipula/service1.jpg',
                icon: <Scissors className="w-6 h-6" />,
                gradient: 'bg-gradient-to-br from-navy to-charcoal',
              },
              {
                id: 'quality',
                title: 'Quality Fabrics',
                subtitle: 'Premium Materials',
                description: 'We source only the finest fabrics from around the world, ensuring comfort, durability, and elegance.',
                image: '/images/malipula/service2.jpg',
                icon: <Layers className="w-6 h-6" />,
                gradient: 'bg-gradient-to-br from-charcoal to-navy',
              },
              {
                id: 'customization',
                title: 'Custom Fit',
                subtitle: 'Made for You',
                description: 'Your measurements, your style, your preferences. Each garment is uniquely tailored to your body.',
                image: '/images/malipula/service3.jpg',
                icon: <Ruler className="w-6 h-6" />,
                gradient: 'bg-gradient-to-br from-navy to-charcoal',
              },
              {
                id: 'heritage',
                title: 'African Heritage',
                subtitle: 'Rooted in Tradition',
                description: 'We celebrate African culture through contemporary designs that honor our rich heritage.',
                image: '/images/malipula/service4.jpg',
                icon: <Palette className="w-6 h-6" />,
                gradient: 'bg-gradient-to-br from-charcoal to-navy',
              },
            ]}
            autoPlayInterval={6000}
          />
        </div>
      </section>

      {/* Interactive Product Showcase - Tower Style */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeUp" className="text-center mb-16">
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              Featured Design
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Discover the <span className="text-gold-gradient">Details</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click on the indicators to explore the craftsmanship behind our signature suit.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale">
            <ProductIndicators
              image="/images/malipula/service1.jpg"
              imageAlt="Malipula Signature Suit"
              indicators={[
                {
                  id: 'lapel',
                  x: 45,
                  y: 25,
                  title: 'Peak Lapel',
                  description: 'Hand-crafted peak lapels with pick stitching detail.',
                  details: ['100% Wool', 'Hand-finished edges', 'Satin trim option'],
                },
                {
                  id: 'fabric',
                  x: 35,
                  y: 50,
                  title: 'Premium Fabric',
                  description: 'Italian wool sourced from the finest mills.',
                  details: ['Super 150s wool', 'Breathable weave', 'Wrinkle resistant'],
                },
                {
                  id: 'buttons',
                  x: 55,
                  y: 45,
                  title: 'Corozo Buttons',
                  description: 'Natural tagua nut buttons for an elegant finish.',
                  details: ['Eco-friendly', 'Durable finish', 'Natural luster'],
                },
                {
                  id: 'pocket',
                  x: 25,
                  y: 60,
                  title: 'Flap Pockets',
                  description: 'Functional flap pockets with hand-sewn details.',
                  details: ['Reinforced corners', 'Jetted option', 'Ticket pocket available'],
                },
                {
                  id: 'lining',
                  x: 70,
                  y: 55,
                  title: 'Bemberg Lining',
                  description: 'Luxurious cupro lining for breathability and comfort.',
                  details: ['Moisture-wicking', 'Anti-static', 'Silk-like feel'],
                },
              ]}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Callouts */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureCallout
            features={[
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Award Winning',
                description: 'EAGMA 2025 Best Tailor in East Africa',
              },
              {
                icon: <Scissors className="w-6 h-6" />,
                title: 'Bespoke Service',
                description: 'Every piece custom-made to your measurements',
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: 'Free Delivery',
                description: 'Within Dar es Salaam for orders above TZS 300,000',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Satisfaction Guaranteed',
                description: '100% satisfaction or we will make it right',
              },
            ]}
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/malipula/about.jpg"
                  alt="About Malipula"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -right-8 bg-gold text-charcoal p-6 rounded-2xl shadow-xl"
              >
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm font-medium">Years of Excellence</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">Our Story</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Crafting <span className="text-gold-gradient">Elegance</span> Since 2015
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Welcome to Malipula Suits, where craftsmanship meets elegance, and tradition blends seamlessly with modern style. As a visionary tailor and fashion designer based in the vibrant city of Dar es Salaam, Tanzania, we take pride in creating exceptional wardrobes for the discerning working class.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Every garment we create is a labor of love, a testament to our dedication to the art of tailoring. Our team of skilled artisans, with years of experience in the world of fashion, pour their heart and soul into every stitch, ensuring that each piece is a masterpiece.
              </p>
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                Learn More About Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              Our Collections
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Explore Our <span className="text-gold-gradient">Categories</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From timeless suits to contemporary kaftans, discover pieces that define your style.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {category.name}
                        </h3>
                        <p className="text-gold text-sm">{category.count} Products</p>
                      </div>
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="w-12 h-12 bg-gold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-5 h-5 text-charcoal" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-center mb-16"
          >
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
                Best Sellers
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Featured <span className="text-gold-gradient">Products</span>
              </h2>
            </div>
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-charcoal"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-gold text-charcoal font-semibold">
                          New Arrival
                        </Badge>
                      )}
                      {product.isBestSeller && (
                        <Badge className="bg-navy text-white font-semibold">
                          Best Seller
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                        Quick View
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-gold fill-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gold">
                        TZS {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          TZS {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              Our Team
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Meet The <span className="text-gold-gradient">Artisans</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The skilled hands behind every masterpiece.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-gold text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              What Our <span className="text-gold-gradient">Clients Say</span>
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gold/10"
              >
                <Quote className="w-10 h-10 text-gold/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-charcoal to-navy" />
        <div className="absolute inset-0 pattern-bg opacity-10" />
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-6">
                Limited Time Offer
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Book Your <span className="text-gold-gradient">Free Consultation</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Schedule a personal fitting session with our master tailors and discover the Malipula difference.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-lg px-10 py-7 btn-luxury"
              >
                Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-charcoal font-semibold text-lg px-10 py-7"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="/images/malipula/m.png" alt="Malipula" className="w-10 h-10 object-contain" />
                <img src="/images/malipula/logo.png" alt="Malipula Suits" className="h-8 object-contain" />
              </div>
              <p className="text-gray-400 mb-6">
                Royal. Rooted. Refined. Experience exceptional tailoring from the heart of Dar es Salaam.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="https://instagram.com/malipula_suits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="https://facebook.com/malipulasuits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold">Quick Links</h3>
              <ul className="space-y-3">
                {['Shop All', 'Suits', 'Shirts', 'Trousers', 'Kaftans', 'Fabrics'].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-gold transition-colors flex items-center group"
                      >
                        <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold">Customer Service</h3>
              <ul className="space-y-3">
                {[
                  'Book Appointment',
                  'Size Guide',
                  'Track Order',
                  'FAQs',
                  'Returns',
                  'Contact Us',
                ].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-gold transition-colors flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <span className="text-gray-400">
                    Sinza A, House No. 18,
                    <br />
                    Mapinduzi Street, Dar es Salaam
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <a
                    href="tel:+255754023335"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    +255 754 023 335
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gold shrink-0" />
                  <a
                    href="mailto:info@malipula.co.tz"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    info@malipula.co.tz
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 Malipula Suits. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gold text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gold text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
