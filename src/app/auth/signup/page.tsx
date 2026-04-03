'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  User,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from '@/hooks/use-toast';

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

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all fields to continue.',
          variant: 'destructive',
        });
        return;
      }
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please check both password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message || 'Could not create account. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account, then sign in.',
        });
        router.push('/auth/login');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Brand */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-charcoal"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/malipula/hero.jpg"
            alt="Malipula Suits"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/90 to-navy/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/malipula/m.png" alt="Malipula" className="w-10 h-10 object-contain" />
              <img src="/images/malipula/logo.png" alt="Malipula Suits" className="h-8 object-contain brightness-0 invert" />
            </Link>
          </div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-md"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold text-white mb-6"
            >
              Join the <span className="text-gold-gradient">Malipula</span> Family
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg mb-8">
              Create an account to unlock exclusive benefits, track orders, and save your measurements for the perfect fit every time.
            </motion.p>
            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                'Save your custom measurements',
                'Track orders in real-time',
                'Exclusive member discounts',
                'Priority booking for fittings',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span>© 2025 Malipula Suits</span>
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            <Link href="#" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms</Link>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <img src="/images/malipula/m.png" alt="Malipula" className="w-10 h-10 object-contain" />
              <img src="/images/malipula/logo.png" alt="Malipula Suits" className="h-8 object-contain" />
            </Link>
          </div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-muted-foreground">
                {step === 1 ? 'Enter your personal details' : 'Create your password'}
              </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= 1 ? 'bg-gold text-charcoal' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-gold' : 'bg-muted'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= 2 ? 'bg-gold text-charcoal' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
            </motion.div>

            <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 border-gold/20 focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 border-gold/20 focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 XXX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 border-gold/20 focus:border-gold"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 border-gold/20 focus:border-gold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 border-gold/20 focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-1 rounded border-gold/20 text-gold focus:ring-gold"
                        required
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to the{' '}
                        <Link href="#" className="text-gold hover:text-gold-dark">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="text-gold hover:text-gold-dark">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold py-6 text-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                ) : step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Create Account
                    <Crown className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {step === 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </Button>
              )}
            </motion.form>

            {/* Sign In Link */}
            <motion.p variants={fadeInUp} className="text-center mt-8 text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold hover:text-gold-dark font-medium transition-colors">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
