'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Package,
  Calendar,
  Heart,
  Ruler,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Crown,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';

// Mock data - in real app, this would come from Supabase
const recentOrders = [
  {
    id: 'ORD-1001',
    date: '2024-01-15',
    status: 'IN_PRODUCTION',
    total: 850000,
    items: 2,
  },
  {
    id: 'ORD-1000',
    date: '2024-01-10',
    status: 'DELIVERED',
    total: 420000,
    items: 1,
  },
];

const upcomingAppointments = [
  {
    id: '1',
    type: 'IN_STORE_FITTING',
    date: '2024-01-25',
    time: '14:00',
    location: 'Malipula Studio, Masaki',
  },
];

const measurements = {
  chest: 102,
  waist: 86,
  shoulders: 48,
  sleeve_length: 65,
  neck: 40,
  height: 178,
};

export default function AccountPage() {
  const { user, signOut } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'IN_PRODUCTION':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4 text-blue-400" />;
      default:
        return <Package className="w-4 h-4 text-white/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN_PRODUCTION':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'SHIPPED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Welcome back, {user?.name || 'Guest'}
                  </h1>
                  <p className="text-white/50">{user?.email || 'guest@example.com'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/booking">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    <Crown className="w-4 h-4 mr-2" />
                    Book Fitting
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="border-white/20 text-white/70 hover:text-red-400 hover:border-red-500/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Package className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-white/50">Total Orders</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-xs text-white/50">Upcoming Fitting</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-xs text-white/50">Wishlist Items</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Ruler className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-xs text-white/50">Measurement Profile</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
                <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
                  <Package className="w-4 h-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="appointments" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="measurements" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
                  <Ruler className="w-4 h-4 mr-2" />
                  Measurements
                </TabsTrigger>
                <TabsTrigger value="addresses" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
                  <MapPin className="w-4 h-4 mr-2" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Order History</span>
                      <Link href="/orders" className="text-sm text-amber-400 hover:text-amber-300 font-normal">
                        View All
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-semibold text-white">{order.id}</p>
                            <p className="text-sm text-white/50">{order.date} • {order.items} items</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-amber-400">{formatPrice(order.total)}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/30" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Appointments</span>
                      <Link href="/booking" className="text-sm text-amber-400 hover:text-amber-300 font-normal">
                        Book New
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white">{apt.type.replace('_', ' ')}</p>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>{apt.date}</span>
                          <span>{apt.time}</span>
                        </div>
                        <p className="text-sm text-white/50 mt-1">{apt.location}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Measurements Tab */}
              <TabsContent value="measurements">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>My Measurements</span>
                      <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                        Edit Profile
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(measurements).map(([key, value]) => (
                        <div key={key} className="p-4 bg-white/5 rounded-xl text-center">
                          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                            {key.replace('_', ' ')}
                          </p>
                          <p className="text-2xl font-bold text-white">{value}</p>
                          <p className="text-xs text-white/50">cm</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Saved Addresses</span>
                      <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                        Add New
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-white">Home</p>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                              Default
                            </Badge>
                          </div>
                          <p className="text-white/60 text-sm">
                            123 Masaki Peninsula Road<br />
                            Dar es Salaam, Tanzania
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
