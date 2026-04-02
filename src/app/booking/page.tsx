'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
  Scissors,
  Ruler,
  Video,
  MapPin,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

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

const appointmentTypes = [
  {
    id: 'in-store',
    title: 'In-Store Fitting',
    description: 'Visit our showroom for a personalized fitting experience',
    icon: MapPin,
    duration: '60 min',
    price: 'Free',
  },
  {
    id: 'virtual',
    title: 'Virtual Consultation',
    description: 'Connect with our stylists via video call from anywhere',
    icon: Video,
    duration: '45 min',
    price: 'TZS 25,000',
  },
  {
    id: 'measurement',
    title: 'Measurement Session',
    description: 'Get professionally measured for your custom garments',
    icon: Ruler,
    duration: '30 min',
    price: 'TZS 15,000',
  },
  {
    id: 'style',
    title: 'Style Consultation',
    description: 'Expert advice on fabrics, styles, and wardrobe planning',
    icon: Scissors,
    duration: '60 min',
    price: 'TZS 35,000',
  },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

const stylists = [
  { id: 1, name: 'Joseph Malipula', role: 'Master Tailor', rating: 5.0, image: '/images/malipula/team1.jpg' },
  { id: 2, name: 'Grace Mwakasege', role: 'Head of Design', rating: 4.9, image: '/images/malipula/team2.jpg' },
  { id: 3, name: 'Peter Kimaro', role: 'Senior Tailor', rating: 4.8, image: '/images/malipula/team3.jpg' },
  { id: 4, name: 'Any Available', role: 'First Available', rating: 4.9, image: null },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: '',
    date: '',
    time: '',
    stylist: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
    }, 2000);
  };

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    return date;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isConfirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <Check className="w-12 h-12 text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your appointment has been scheduled. We&apos;ll send you a confirmation email with all the details.
              </p>
              <Card className="border-gold/20 max-w-md mx-auto text-left">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground capitalize">{bookingData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-foreground">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">Sinza Showroom</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-4 justify-center mt-8">
                <Link href="/">
                  <Button className="bg-gold hover:bg-gold-dark text-charcoal">
                    Return Home
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" className="border-gold text-gold">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="text-center mb-12"
              >
                <motion.div variants={fadeInUp}>
                  <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Badge>
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                >
                  Schedule Your <span className="text-gold-gradient">Fitting</span>
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-muted-foreground max-w-2xl mx-auto"
                >
                  Book a personal session with our expert tailors and experience the Malipula difference.
                </motion.p>
              </motion.div>

              {/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-12"
              >
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        step >= s
                          ? 'bg-gold text-charcoal'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`w-12 sm:w-20 h-1 rounded transition-all ${
                          step > s ? 'bg-gold' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Select Type */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        What type of appointment do you need?
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {appointmentTypes.map((type) => (
                          <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              onClick={() => setBookingData({ ...bookingData, type: type.id })}
                              className={`cursor-pointer transition-all ${
                                bookingData.type === type.id
                                  ? 'border-gold ring-2 ring-gold/20'
                                  : 'border-gold/10 hover:border-gold/30'
                              }`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    bookingData.type === type.id ? 'bg-gold text-charcoal' : 'bg-gold/10 text-gold'
                                  }`}>
                                    <type.icon className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {type.duration}
                                      </span>
                                      <span className="text-gold font-medium">{type.price}</span>
                                    </div>
                                  </div>
                                  {bookingData.type === type.id && (
                                    <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-charcoal" />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Date & Time */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Select a Date</h2>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {dates.map((date, index) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dayNum = date.getDate();
                            
                            return (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setBookingData({ ...bookingData, date: dateStr })}
                                className={`p-3 rounded-xl text-center transition-all ${
                                  bookingData.date === dateStr
                                    ? 'bg-gold text-charcoal'
                                    : 'bg-muted hover:bg-muted/80 text-foreground'
                                }`}
                              >
                                <div className="text-xs opacity-70">{dayName}</div>
                                <div className="text-lg font-semibold">{dayNum}</div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Select a Time</h2>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map((time, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setBookingData({ ...bookingData, time })}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                bookingData.time === time
                                  ? 'bg-gold text-charcoal'
                                  : 'bg-muted hover:bg-muted/80 text-foreground'
                              }`}
                            >
                              {time}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Select Stylist */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        Choose Your Stylist
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {stylists.map((stylist) => (
                          <motion.div
                            key={stylist.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              onClick={() => setBookingData({ ...bookingData, stylist: stylist.id.toString() })}
                              className={`cursor-pointer transition-all ${
                                bookingData.stylist === stylist.id.toString()
                                  ? 'border-gold ring-2 ring-gold/20'
                                  : 'border-gold/10 hover:border-gold/30'
                              }`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                  {stylist.image ? (
                                    <img
                                      src={stylist.image}
                                      alt={stylist.name}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                                      <User className="w-8 h-8 text-gold" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">{stylist.name}</h3>
                                    <p className="text-sm text-muted-foreground">{stylist.role}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="w-4 h-4 text-gold fill-gold" />
                                      <span className="text-sm font-medium text-gold">{stylist.rating}</span>
                                    </div>
                                  </div>
                                  {bookingData.stylist === stylist.id.toString() && (
                                    <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-charcoal" />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Your Details */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        Your Contact Details
                      </h2>
                      <Card className="border-gold/10">
                        <CardContent className="p-6 space-y-6">
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder="John Doe"
                                  value={bookingData.name}
                                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                  className="pl-10 border-gold/20 focus:border-gold"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="you@example.com"
                                  value={bookingData.email}
                                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                  className="pl-10 border-gold/20 focus:border-gold"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+255 XXX XXX XXX"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                className="pl-10 border-gold/20 focus:border-gold"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Special Requests (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Any special requests or notes for your appointment..."
                              value={bookingData.notes}
                              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                              className="min-h-[100px] border-gold/20 focus:border-gold"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {!isConfirmed && (
                <div className="flex justify-between mt-8 pt-8 border-t border-gold/10">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="border-gold/20 text-foreground hover:border-gold hover:text-gold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {step < 4 ? (
                    <Button
                      onClick={handleNext}
                      disabled={
                        (step === 1 && !bookingData.type) ||
                        (step === 2 && (!bookingData.date || !bookingData.time)) ||
                        (step === 3 && !bookingData.stylist)
                      }
                      className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!bookingData.name || !bookingData.email || !bookingData.phone || isLoading}
                      className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                      ) : (
                        <>
                          Confirm Booking
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
