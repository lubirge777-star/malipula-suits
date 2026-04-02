'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Star,
  Filter,
  Grid,
  List,
  Search,
  Crown,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts, useCategories, useCart } from '@/lib/api/hooks';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  thumbnail: string | null;
  images: string | null;
  is_featured: boolean;
  is_new: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  items: Array<{
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    price_modifier: number;
    stock_quantity: number;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling', 'Top Rated'];

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('Newest');
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { user } = useAuth();
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();

  const products = (productsData?.products || []) as Product[];
  const categories = categoriesData?.categories || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== 'all' && product.category?.slug !== selectedCategory) return false;
      if (product.base_price < priceRange[0] || product.base_price > priceRange[1]) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.base_price - b.base_price;
        case 'Price: High to Low':
          return b.base_price - a.base_price;
        case 'Best Selling':
          return b.is_featured ? 1 : -1;
        default:
          return b.is_new ? 1 : -1;
      }
    });

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    const result = await addToCart({ product_id: productId, quantity: 1 });
    
    if (result.success) {
      toast({
        title: 'Added to cart!',
        description: 'Item has been added to your shopping cart.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-charcoal to-navy" />
        <div className="absolute inset-0 pattern-bg opacity-10" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-gold/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="text-center">
            <motion.div variants={fadeInUp}>
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Collection
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our <span className="text-gold-gradient">Collection</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover exceptional tailoring pieces crafted with precision and passion.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-gold/20 focus:border-gold" />
                </div>

                {/* Categories */}
                <Card className="border-gold/10">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedCategory('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === 'all' ? 'bg-gold text-charcoal font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        All Products
                      </motion.button>
                      {categoriesLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-gold" />
                        </div>
                      ) : (
                        categories.map((category: Category) => (
                          <motion.button
                            key={category.id}
                            whileHover={{ x: 5 }}
                            onClick={() => setSelectedCategory(category.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedCategory === category.slug ? 'bg-gold text-charcoal font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {category.name}
                          </motion.button>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Range */}
                <Card className="border-gold/10">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={1500000} step={50000} className="mb-4" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>TZS {formatPrice(priceRange[0])}</span>
                      <span>TZS {formatPrice(priceRange[1])}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden border-gold/20 text-gold">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] border-gold/20 focus:border-gold">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex items-center gap-2 border border-gold/20 rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-charcoal' : 'text-muted-foreground hover:text-foreground'}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gold text-charcoal' : 'text-muted-foreground hover:text-foreground'}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Loading State */}
              {productsLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              )}

              {/* Mobile Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowFilters(false)}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                    
                    {/* Filter Panel */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-gold/10 z-50 lg:hidden overflow-y-auto"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-6">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-10 border-gold/20 focus:border-gold" 
                          />
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                          <h4 className="font-medium text-foreground mb-3">Categories</h4>
                          <div className="space-y-2">
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() => setSelectedCategory('all')}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedCategory === 'all' ? 'bg-gold text-charcoal font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              All Products
                            </motion.button>
                            {categoriesLoading ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                              </div>
                            ) : (
                              categories.map((category: Category) => (
                                <motion.button
                                  key={category.id}
                                  whileHover={{ x: 5 }}
                                  onClick={() => setSelectedCategory(category.slug)}
                                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    selectedCategory === category.slug ? 'bg-gold text-charcoal font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {category.name}
                                </motion.button>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                          <h4 className="font-medium text-foreground mb-3">Price Range</h4>
                          <Slider value={priceRange} onValueChange={setPriceRange} max={1500000} step={50000} className="mb-4" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>TZS {formatPrice(priceRange[0])}</span>
                            <span>TZS {formatPrice(priceRange[1])}</span>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <Button 
                          onClick={() => setShowFilters(false)}
                          className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Error State */}
              {productsError && (
                <div className="text-center py-20">
                  <p className="text-red-500 mb-4">Failed to load products</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              )}

              {/* Products Grid */}
              {!productsLoading && !productsError && (
                <motion.div initial="initial" animate="animate" variants={staggerContainer} className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={scaleIn} whileHover={{ y: -5 }} className="group">
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img 
                            src={product.thumbnail || product.images?.split(',')[0] || '/images/malipula/service1.jpg'} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />

                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.is_new && <Badge className="bg-gold text-charcoal font-semibold">New</Badge>}
                            {product.is_featured && <Badge className="bg-navy text-white font-semibold">Featured</Badge>}
                          </div>

                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors">
                              <Heart className="w-5 h-5" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }} 
                              whileTap={{ scale: 0.95 }} 
                              onClick={() => handleAddToCart(product.id)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors"
                            >
                              <ShoppingBag className="w-5 h-5" />
                            </motion.button>
                          </div>

                          <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Link href={`/product/${product.id}`}>
                              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">View Details</Button>
                            </Link>
                          </div>
                        </div>

                        <CardContent className="p-5">
                          <p className="text-xs text-gold mb-1">{product.category?.name || 'Uncategorized'}</p>
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-gold">TZS {formatPrice(product.base_price)}</span>
                          </div>

                          {product.items && product.items.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {product.items.slice(0, 3).map((item) => (
                                item.color && (
                                  <span key={item.id} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                    {item.color}
                                  </span>
                                )
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Empty State */}
              {!productsLoading && !productsError && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Crown className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
