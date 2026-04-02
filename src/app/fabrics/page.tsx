'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ShoppingBag, Filter, Search, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const fabrics = [
  {
    id: '1',
    name: 'Italian Super 150s Wool',
    slug: 'italian-super-150s-wool',
    description: 'Luxurious Italian wool with exceptional drape and breathability',
    material: 'Wool',
    composition: '100% Virgin Wool',
    price_per_meter: 150000,
    quality: 'LUXURY',
    origin: 'Italy',
    color: 'Navy Blue',
    color_hex: '#1a2744',
    is_premium: true,
  },
  {
    id: '2',
    name: 'British Super 130s Wool',
    slug: 'british-super-130s-wool',
    description: 'Classic British wool known for durability and elegance',
    material: 'Wool',
    composition: '100% Wool',
    price_per_meter: 120000,
    quality: 'PREMIUM',
    origin: 'United Kingdom',
    color: 'Charcoal Grey',
    color_hex: '#36454f',
    is_premium: true,
  },
  {
    id: '3',
    name: 'Egyptian Cotton',
    slug: 'egyptian-cotton',
    description: 'Premium Egyptian cotton for luxurious shirts',
    material: 'Cotton',
    composition: '100% Egyptian Cotton',
    price_per_meter: 60000,
    quality: 'LUXURY',
    origin: 'Egypt',
    color: 'White',
    color_hex: '#ffffff',
    is_premium: true,
  },
  {
    id: '4',
    name: 'Pure Belgian Linen',
    slug: 'pure-belgian-linen',
    description: 'Premium Belgian linen for hot weather',
    material: 'Linen',
    composition: '100% Linen',
    price_per_meter: 70000,
    quality: 'PREMIUM',
    origin: 'Belgium',
    color: 'Natural',
    color_hex: '#f5f5dc',
    is_premium: true,
  },
  {
    id: '5',
    name: 'Kente Cloth',
    slug: 'kente-cloth',
    description: 'Traditional Ghanaian kente cloth for special occasions',
    material: 'Cotton/Silk',
    composition: 'Cotton and Silk Blend',
    price_per_meter: 150000,
    quality: 'LUXURY',
    origin: 'Ghana',
    color: 'Gold/Red/Green',
    color_hex: '#ffd700',
    is_premium: true,
  },
  {
    id: '6',
    name: 'Merino Wool Blend',
    slug: 'merino-wool-blend',
    description: 'Soft and breathable merino blend for comfort',
    material: 'Wool Blend',
    composition: '70% Merino Wool, 30% Polyester',
    price_per_meter: 80000,
    quality: 'PREMIUM',
    origin: 'Australia',
    color: 'Black',
    color_hex: '#000000',
    is_premium: false,
  },
  {
    id: '7',
    name: 'Ankara Wax Print',
    slug: 'ankara-wax-print',
    description: 'Vibrant African wax print fabric',
    material: 'Cotton',
    composition: '100% Cotton',
    price_per_meter: 35000,
    quality: 'STANDARD',
    origin: 'Nigeria',
    color: 'Multi-colored',
    color_hex: '#ff6b35',
    is_premium: false,
  },
  {
    id: '8',
    name: 'Mulberry Silk',
    slug: 'mulberry-silk',
    description: 'Premium mulberry silk for special occasions',
    material: 'Silk',
    composition: '100% Silk',
    price_per_meter: 200000,
    quality: 'LUXURY',
    origin: 'China',
    color: 'Ivory',
    color_hex: '#fffff0',
    is_premium: true,
  },
];

const qualityColors = {
  BUDGET: 'bg-slate-500',
  STANDARD: 'bg-blue-500',
  PREMIUM: 'bg-amber-500',
  LUXURY: 'bg-gradient-to-r from-amber-400 to-yellow-500',
};

export default function FabricsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const materials = ['All', 'Wool', 'Cotton', 'Linen', 'Silk', 'Cotton/Silk', 'Wool Blend'];
  const qualities = ['All', 'LUXURY', 'PREMIUM', 'STANDARD', 'BUDGET'];

  const filteredFabrics = fabrics.filter((fabric) => {
    const matchesMaterial = !selectedMaterial || selectedMaterial === 'All' || fabric.material.includes(selectedMaterial);
    const matchesQuality = !selectedQuality || selectedQuality === 'All' || fabric.quality === selectedQuality;
    const matchesSearch = !searchQuery || 
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMaterial && matchesQuality && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Collection
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gold-gradient">Premium Fabrics</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Explore our curated collection of the world's finest fabrics, from Italian wools to African heritage textiles
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
          >
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            {/* Material Filter */}
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material}
                  onClick={() => setSelectedMaterial(material === 'All' ? null : material)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    (selectedMaterial === material || (material === 'All' && !selectedMaterial))
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fabrics Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFabrics.map((fabric, index) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/fabrics/${fabric.slug}`}>
                  <Card className="group bg-white/5 border-white/10 hover:border-amber-500/30 transition-all duration-300 overflow-hidden cursor-pointer hover:bg-white/10">
                    {/* Color Swatch */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundColor: fabric.color_hex }}
                      />
                      {/* Pattern overlay for special fabrics */}
                      {fabric.is_premium && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={`${qualityColors[fabric.quality as keyof typeof qualityColors]} text-slate-900 font-semibold`}>
                          {fabric.quality}
                        </Badge>
                        {fabric.is_premium && (
                          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Premium
                          </Badge>
                        )}
                      </div>
                      {/* Origin */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs text-white/60 bg-black/40 px-2 py-1 rounded-full">
                          {fabric.origin}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-1">
                        {fabric.name}
                      </h3>
                      <p className="text-sm text-white/50 mb-3 line-clamp-2">
                        {fabric.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/40">{fabric.material}</p>
                          <p className="font-bold text-amber-400">{formatPrice(fabric.price_per_meter)}/m</p>
                        </div>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredFabrics.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No fabrics found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
