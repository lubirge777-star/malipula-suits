'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Scissors,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/admin-layout';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock data - in production, fetch from Supabase
const stats = [
  {
    name: 'Total Revenue',
    value: 'TZS 45.2M',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    name: 'Total Orders',
    value: '234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBag,
    color: 'bg-blue-500',
  },
  {
    name: 'Total Customers',
    value: '1,456',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    name: 'Products',
    value: '89',
    change: '+3',
    trend: 'up',
    icon: Package,
    color: 'bg-gold',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Mwangi', amount: 850000, status: 'processing', date: '2025-01-15' },
  { id: 'ORD-002', customer: 'Sarah Kimaro', amount: 420000, status: 'paid', date: '2025-01-15' },
  { id: 'ORD-003', customer: 'Michael Joseph', amount: 1200000, status: 'shipped', date: '2025-01-14' },
  { id: 'ORD-004', customer: 'Anna Mbeki', amount: 380000, status: 'pending', date: '2025-01-14' },
  { id: 'ORD-005', customer: 'Peter Kimaro', amount: 650000, status: 'delivered', date: '2025-01-13' },
];

const upcomingAppointments = [
  { id: 1, customer: 'David Massawe', type: 'Fitting', time: '10:00 AM', date: 'Today' },
  { id: 2, customer: 'Grace Mwakasege', type: 'Consultation', time: '2:00 PM', date: 'Today' },
  { id: 3, customer: 'Joseph Malipula', type: 'Measurement', time: '11:00 AM', date: 'Tomorrow' },
  { id: 4, customer: 'Amina Hassan', type: 'Fitting', time: '3:30 PM', date: 'Tomorrow' },
];

const productionQueue = [
  { id: 1, item: 'Navy Three-Piece Suit', customer: 'John Mwangi', stage: 'Cutting', progress: 25 },
  { id: 2, item: 'Charcoal Blazer', customer: 'Sarah Kimaro', stage: 'Sewing', progress: 60 },
  { id: 3, item: 'White Dress Shirt', customer: 'Michael Joseph', stage: 'Finishing', progress: 85 },
  { id: 4, item: 'Traditional Kaftan', customer: 'Anna Mbeki', stage: 'Quality Check', progress: 95 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  paid: 'bg-blue-500/10 text-blue-600 border-blue-200',
  processing: 'bg-purple-500/10 text-purple-600 border-purple-200',
  shipped: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  delivered: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-6"
      >
        {/* Page Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gold/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card className="border-gold/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm" className="text-gold">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">TZS {formatPrice(order.amount)}</p>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div variants={fadeInUp}>
            <Card className="border-gold/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Appointments</CardTitle>
                <Link href="/admin/appointments">
                  <Button variant="ghost" size="sm" className="text-gold">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-navy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{apt.customer}</p>
                        <p className="text-sm text-muted-foreground">{apt.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{apt.time}</p>
                        <p className="text-xs text-muted-foreground">{apt.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Production Queue */}
        <motion.div variants={fadeInUp}>
          <Card className="border-gold/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="w-5 h-5 text-gold" />
                Production Queue
              </CardTitle>
              <Button variant="outline" size="sm">
                Manage Queue
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {productionQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/50 border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.customer}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.stage}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gold rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp}>
          <Card className="border-gold/10 bg-gradient-to-r from-charcoal to-navy">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Quick Actions</h3>
                  <p className="text-gray-400">Frequently used actions for your daily operations</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/admin/products">
                    <Button className="bg-gold hover:bg-gold-dark text-charcoal">
                      <Package className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Layers className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </Link>
                  <Link href="/admin/orders">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Truck className="w-4 h-4 mr-2" />
                      Update Order
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
