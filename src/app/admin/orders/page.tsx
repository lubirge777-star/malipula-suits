'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/components/admin/admin-layout';
import { toast } from '@/hooks/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  subtotal: number;
  delivery_method: string;
  delivery_status: string;
  notes: string | null;
  created_at: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
  };
  order_items?: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600', icon: CheckCircle },
  in_production: { label: 'In Production', color: 'bg-purple-500/10 text-purple-600', icon: Package },
  ready: { label: 'Ready', color: 'bg-indigo-500/10 text-indigo-600', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-600', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      toast({
        title: 'Order Updated',
        description: `Order status changed to ${newStatus}`,
      });

      fetchOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders and production</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => {
            const count = orders.filter(o => o.status === key).length;
            const Icon = config.icon;
            return (
              <Card key={key} className="border-gold/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.color.split(' ')[0]} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeInUp}>
          <Card className="border-gold/10">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number, customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gold/20 focus:border-gold"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48 border-gold/20 focus:border-gold">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={fadeInUp}>
          <Card className="border-gold/10">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10 bg-muted/50">
                        <th className="text-left p-4 font-semibold">Order</th>
                        <th className="text-left p-4 font-semibold">Customer</th>
                        <th className="text-left p-4 font-semibold">Items</th>
                        <th className="text-left p-4 font-semibold">Total</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        
                        return (
                          <tr
                            key={order.id}
                            className="border-b border-gold/5 hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-4">
                              <div>
                                <p className="font-semibold text-foreground">{order.order_number}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {order.delivery_method?.replace('_', ' ')}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-foreground">
                                  {order.user?.name || 'Guest'}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary">
                                {order.order_items?.length || 0} items
                              </Badge>
                            </td>
                            <td className="p-4 font-semibold text-gold">
                              TZS {formatPrice(order.total)}
                            </td>
                            <td className="p-4">
                              <Badge className={status.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                      View Details
                                    </DropdownMenuItem>
                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                        >
                                          Mark Confirmed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => updateOrderStatus(order.id, 'in_production')}
                                        >
                                          Start Production
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                                        >
                                          Mark Shipped
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                                        >
                                          Mark Delivered
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {order.status !== 'cancelled' && (
                                      <DropdownMenuItem
                                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                        className="text-red-600"
                                      >
                                        Cancel Order
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gold/10">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
                    {filteredOrders.length} orders
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center gap-4">
                <Badge className={statusConfig[selectedOrder.status]?.color || ''}>
                  {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                </Badge>
                <Badge variant="outline">
                  Payment: {selectedOrder.payment_status}
                </Badge>
              </div>

              {/* Customer Info */}
              <Card className="border-gold/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedOrder.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedOrder.user?.phone || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-gold/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × TZS {formatPrice(item.unit_price)}
                          </p>
                        </div>
                        <p className="font-semibold">TZS {formatPrice(item.total_price)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>TZS {formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-gold">TZS {formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="border-gold/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{selectedOrder.delivery_method?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  {selectedOrder.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Notes: {selectedOrder.notes}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Update Status */}
              <div className="flex gap-2">
                <Select onValueChange={(v) => updateOrderStatus(selectedOrder.id, v)}>
                  <SelectTrigger className="border-gold/20">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
