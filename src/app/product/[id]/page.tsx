'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Star,
  ChevronRight,
  ChevronLeft,
  Truck,
  Shield,
  RefreshCw,
  Ruler,
  Scissors,
  Crown,
  Share2,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

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

// Sample product data
const productData = {
  id: 1,
  name: 'Royal Navy Three-Piece Suit',
  price: 850000,
  originalPrice: 950000,
  images: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
  ],
  category: 'Suits',
  rating: 4.9,
  reviews: 24,
  description: 'Experience unparalleled elegance with our Royal Navy Three-Piece Suit. Crafted from premium Italian Merino wool, this masterpiece combines traditional tailoring with contemporary style. Perfect for weddings, business meetings, and special occasions.',
  features: [
    'Premium Italian Merino Wool',
    'Full Canvas Construction',
    'Hand-Stitched Lapels',
    'Pick-Stitched Details',
    'Bemberg Lining',
    'Natural Shoulder',
  ],
  colors: [
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Black', hex: '#1A1A1A' },
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
  fabricOptions: [
    { name: 'Italian Merino Wool', price: 0 },
    { name: 'Cashmere Blend', price: 150000 },
    { name: 'Egyptian Cotton', price: -100000 },
  ],
  customizationOptions: [
    { name: 'Lapel Style', options: ['Peak', 'Notch', 'Shawl'] },
    { name: 'Button Count', options: ['1 Button', '2 Buttons', '3 Buttons'] },
    { name: 'Vent Style', options: ['Single Vent', 'Double Vent', 'No Vent'] },
    { name: 'Pocket Style', options: ['Flap', 'Welt', 'Patch'] },
  ],
  relatedProducts: [
    { id: 2, name: 'Classic White Shirt', price: 150000, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80' },
    { id: 3, name: 'Silk Tie Collection', price: 85000, image: 'https://images.unsplash.com/photo-1598033057782-09f93acc3f66?w=400&q=80' },
    { id: 4, name: 'Oxford Dress Shoes', price: 320000, image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80' },
  ],
};

const reviews = [
  {
    id: 1,
    name: 'Mwalimu Josephat',
    date: 'January 2025',
    rating: 5,
    comment: 'Absolutely stunning quality! The fit is perfect and the fabric feels luxurious. Malipula exceeded my expectations.',
    image: 'https://i.pravatar.cc/100?img=11',
  },
  {
    id: 2,
    name: 'Dr. Amina Hassan',
    date: 'December 2024',
    rating: 5,
    comment: 'The attention to detail is remarkable. From the stitching to the lining, everything speaks of quality craftsmanship.',
    image: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: 3,
    name: 'Engineer Michael',
    date: 'November 2024',
    rating: 5,
    comment: 'Wore this to my wedding and received countless compliments. Worth every shilling!',
    image: 'https://i.pravatar.cc/100?img=12',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedFabric, setSelectedFabric] = useState(productData.fabricOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const finalPrice = productData.price + selectedFabric.price;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-lg border-b border-gold/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-gold" />
                <span className="text-2xl font-bold text-gold-gradient">MALIPULA</span>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {['Home', 'Shop', 'Fabrics', 'About', 'Contact'].map((item) => (
                <motion.div key={item} whileHover={{ y: -2 }} className="relative group">
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-foreground hover:text-gold transition-colors font-medium">
                    {item}
                  </Link>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </motion.div>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-gold/10 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs rounded-full flex items-center justify-center font-bold">2</span>
              </motion.button>
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-6">Book Fitting</Button>
            </div>

            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-background border-t border-gold/20">
              <div className="px-4 py-6 space-y-4">
                {['Home', 'Shop', 'Fabrics', 'About', 'Contact'].map((item) => (
                  <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block text-lg font-medium text-foreground hover:text-gold transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/shop" className="text-muted-foreground hover:text-gold transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{productData.name}</span>
          </motion.div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={productData.images[currentImageIndex]}
                    alt={productData.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-gold text-charcoal font-semibold">New Arrival</Badge>
                  <Badge className="bg-navy text-white font-semibold">Best Seller</Badge>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors">
                    <Heart className="w-5 h-5" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors">
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {productData.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div>
                <p className="text-gold font-medium mb-2">{productData.category}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{productData.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(productData.rating) ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground">{productData.rating} ({productData.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gold">TZS {formatPrice(finalPrice)}</span>
                {productData.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">TZS {formatPrice(productData.originalPrice)}</span>
                )}
                <Badge className="bg-green-100 text-green-700">Save TZS {formatPrice(productData.originalPrice! - finalPrice)}</Badge>
              </div>

              <Separator />

              {/* Color Selection */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Color: <span className="text-gold">{selectedColor.name}</span></h3>
                <div className="flex gap-3">
                  {productData.colors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name ? 'border-gold ring-2 ring-gold/30' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Size</h3>
                  <Button variant="link" className="text-gold p-0 h-auto">
                    <Ruler className="w-4 h-4 mr-1" />
                    Size Guide
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-gold bg-gold text-charcoal'
                          : 'border-gold/20 hover:border-gold/50 text-foreground'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Fabric Selection */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Fabric Option</h3>
                <div className="space-y-2">
                  {productData.fabricOptions.map((fabric) => (
                    <motion.button
                      key={fabric.name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        selectedFabric.name === fabric.name
                          ? 'border-gold bg-gold/10'
                          : 'border-gold/20 hover:border-gold/50'
                      }`}
                    >
                      <span className="font-medium">{fabric.name}</span>
                      <span className={`font-semibold ${fabric.price > 0 ? 'text-gold' : fabric.price < 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {fabric.price > 0 ? `+TZS ${formatPrice(fabric.price)}` : fabric.price < 0 ? `-TZS ${formatPrice(Math.abs(fabric.price))}` : 'Included'}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gold/20 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-muted transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-semibold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-muted-foreground">Only 5 left in stock</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1 bg-gold hover:bg-gold-dark text-charcoal font-semibold text-lg py-7">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-charcoal py-7">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Book Fitting CTA */}
              <Card className="border-gold/20 bg-gradient-to-r from-navy/5 to-gold/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">Need a Custom Fit?</h4>
                      <p className="text-sm text-muted-foreground">Book a personal fitting session with our master tailors</p>
                    </div>
                    <Button className="bg-gold hover:bg-gold-dark text-charcoal">Book Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Truck, title: 'Free Delivery', desc: 'Over TZS 300K' },
                  { icon: Shield, title: 'Quality Guarantee', desc: '100% Authentic' },
                  { icon: RefreshCw, title: 'Easy Returns', desc: '30 Days' },
                ].map((feature, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                    <feature.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                    <h5 className="font-medium text-sm">{feature.title}</h5>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-gold/20 rounded-none p-0 h-auto">
              {['description', 'features', 'reviews', 'shipping'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-gold capitalize"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">{productData.description}</p>
                <h3 className="text-xl font-semibold text-foreground mt-6 mb-4">Customization Options</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {productData.customizationOptions.map((option) => (
                    <Card key={option.name} className="border-gold/10">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2">{option.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {option.options.map((opt) => (
                            <Badge key={opt} variant="secondary" className="bg-muted">{opt}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="features" className="pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4">
                {productData.features.map((feature, index) => (
                  <Card key={index} className="border-gold/10">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-gold" />
                      </div>
                      <span className="font-medium text-foreground">{feature}</span>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-8">
              <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">
                {reviews.map((review) => (
                  <motion.div key={review.id} variants={fadeInUp}>
                    <Card className="border-gold/10">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-foreground">{review.name}</h4>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="shipping" className="pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-gold/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Delivery Information</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong className="text-foreground">Free Delivery:</strong> Orders above TZS 300,000 within Dar es Salaam</p>
                      <p><strong className="text-foreground">Standard Delivery:</strong> 3-5 business days within Tanzania</p>
                      <p><strong className="text-foreground">Express Delivery:</strong> 1-2 business days (additional charges apply)</p>
                      <p><strong className="text-foreground">Custom Orders:</strong> 7-14 business days for tailoring</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Complete Your Look</h2>
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productData.relatedProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp} whileHover={{ y: -5 }} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="bg-gold hover:bg-gold-dark text-charcoal">Quick Add</Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">{product.name}</h3>
                    <p className="text-gold font-semibold">TZS {formatPrice(product.price)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-gold" />
              <span className="text-xl font-bold text-gold-gradient">MALIPULA</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 Malipula Suits. Royal. Rooted. Refined.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
