'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Video,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Calendar } from '@/components/ui/calendar';
import { AdminLayout } from '@/components/admin/admin-layout';
import { toast } from '@/hooks/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface Appointment {
  id: string;
  type: string;
  status: string;
  scheduled_at: string;
  duration: number;
  location: string | null;
  is_virtual: boolean;
  meeting_link: string | null;
  notes: string | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

const appointmentTypes: Record<string, { label: string; color: string }> = {
  in_store_fitting: { label: 'In-Store Fitting', color: 'bg-blue-500' },
  virtual_consultation: { label: 'Virtual Consultation', color: 'bg-purple-500' },
  measurement_session: { label: 'Measurement Session', color: 'bg-green-500' },
  style_consultation: { label: 'Style Consultation', color: 'bg-gold' },
  pickup: { label: 'Pickup', color: 'bg-cyan-500' },
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600', icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600', icon: XCircle },
  no_show: { label: 'No Show', color: 'bg-gray-500/10 text-gray-600', icon: XCircle },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get appointments for selected date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.scheduled_at);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  };

  // Get dates with appointments for calendar highlights
  const datesWithAppointments = appointments.map((apt) => {
    const date = new Date(apt.scheduled_at);
    return date.toDateString();
  });

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      toast({
        title: 'Appointment Updated',
        description: `Status changed to ${newStatus}`,
      });

      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Generate time slots for the day
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i; // 9 AM to 6 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

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
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage fittings, consultations, and pickups</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-gold text-charcoal' : ''}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gold text-charcoal' : ''}
            >
              List
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => {
            const count = appointments.filter(a => a.status === key).length;
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

        {/* Calendar / List View */}
        {viewMode === 'calendar' ? (
          <motion.div variants={fadeInUp} className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="border-gold/10">
              <CardHeader>
                <CardTitle className="text-sm">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-gold/10"
                  modifiers={{
                    hasAppointment: appointments.map((apt) => new Date(apt.scheduled_at)),
                  }}
                  modifiersStyles={{
                    hasAppointment: {
                      backgroundColor: 'rgb(212 175 55 / 0.2)',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Day Schedule */}
            <Card className="border-gold/10 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardTitle>
                <Badge variant="secondary">
                  {selectedDateAppointments.length} appointments
                </Badge>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                ) : selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateAppointments.map((apt) => {
                      const type = appointmentTypes[apt.type] || { label: apt.type, color: 'bg-gray-500' };
                      const status = statusConfig[apt.status] || statusConfig.pending;
                      
                      return (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => setSelectedAppointment(apt)}
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-gold/20"
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">
                              {formatTime(apt.scheduled_at)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {apt.duration}min
                            </span>
                          </div>
                          <div className={`w-1 h-12 rounded-full ${type.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">
                                {apt.user?.name || 'Guest'}
                              </p>
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{type.label}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              {apt.is_virtual ? (
                                <span className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Virtual
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {apt.location || 'In-Store'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* List View */
          <motion.div variants={fadeInUp}>
            <Card className="border-gold/10">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/10 bg-muted/50">
                          <th className="text-left p-4 font-semibold">Customer</th>
                          <th className="text-left p-4 font-semibold">Type</th>
                          <th className="text-left p-4 font-semibold">Date & Time</th>
                          <th className="text-left p-4 font-semibold">Location</th>
                          <th className="text-left p-4 font-semibold">Status</th>
                          <th className="text-right p-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((apt) => {
                          const type = appointmentTypes[apt.type] || { label: apt.type, color: 'bg-gray-500' };
                          const status = statusConfig[apt.status] || statusConfig.pending;
                          
                          return (
                            <tr key={apt.id} className="border-b border-gold/5 hover:bg-muted/30">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{apt.user?.name || 'Guest'}</p>
                                  <p className="text-xs text-muted-foreground">{apt.user?.email}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="secondary">{type.label}</Badge>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{formatDate(apt.scheduled_at)}</p>
                                  <p className="text-xs text-muted-foreground">{formatTime(apt.scheduled_at)}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                {apt.is_virtual ? (
                                  <Badge className="bg-purple-500/10 text-purple-600">
                                    <Video className="w-3 h-3 mr-1" />
                                    Virtual
                                  </Badge>
                                ) : (
                                  <span className="text-sm">{apt.location || 'In-Store'}</span>
                                )}
                              </td>
                              <td className="p-4">
                                <Badge className={status.color}>{status.label}</Badge>
                              </td>
                              <td className="p-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(apt)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge className={statusConfig[selectedAppointment.status]?.color}>
                  {statusConfig[selectedAppointment.status]?.label}
                </Badge>
                <Badge variant="secondary">
                  {appointmentTypes[selectedAppointment.type]?.label || selectedAppointment.type}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedAppointment.user?.name || 'Guest'}</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(selectedAppointment.scheduled_at)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(selectedAppointment.scheduled_at)} • {selectedAppointment.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {selectedAppointment.is_virtual ? 'Virtual Meeting' : selectedAppointment.location || 'In-Store'}
                    </p>
                    {selectedAppointment.meeting_link && (
                      <a
                        href={selectedAppointment.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gold hover:underline"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {selectedAppointment.status === 'pending' && (
                  <Button
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                    disabled={updating}
                    className="flex-1 bg-gold hover:bg-gold-dark text-charcoal"
                  >
                    Confirm
                  </Button>
                )}
                {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                      disabled={updating}
                      className="flex-1"
                    >
                      Complete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                      disabled={updating}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
