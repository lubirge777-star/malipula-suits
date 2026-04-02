'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  Crown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  shop: [
    { name: 'Suits', href: '/shop?category=suits' },
    { name: 'Shirts', href: '/shop?category=shirts' },
    { name: 'Traditional Wear', href: '/shop?category=traditional' },
    { name: 'Kaftans', href: '/shop?category=kaftans' },
    { name: 'Accessories', href: '/shop?category=accessories' },
  ],
  services: [
    { name: 'Bespoke Tailoring', href: '/booking' },
    { name: 'Wedding Attire', href: '/booking' },
    { name: 'Corporate Wear', href: '/booking' },
    { name: 'Alterations', href: '/contact' },
    { name: 'Style Consultation', href: '/booking' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about' },
    { name: 'Careers', href: '/contact' },
    { name: 'Press', href: '/contact' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Size Guide', href: '/contact' },
    { name: 'Fabric Care', href: '/contact' },
    { name: 'Shipping Info', href: '/contact' },
    { name: 'Returns', href: '/contact' },
    { name: 'FAQ', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <motion.div whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 400 }}>
                <img
                  src="/images/malipula/m.png"
                  alt="Malipula"
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
              <img
                src="/images/malipula/logo.png"
                alt="Malipula Suits"
                className="h-8 object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Royal. Rooted. Refined. Experience exceptional tailoring from the heart of Dar es Salaam, Tanzania. Crafting excellence since 2015.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-3">
                Stay Updated
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gold"
                />
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-4 shrink-0">
                  Join
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/malipula_suits' },
                { icon: Facebook, href: 'https://facebook.com/malipulasuits' },
                { icon: Twitter, href: 'https://twitter.com/malipulasuits' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+255654321987"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +255 654 321 987
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@malipula.co.tz"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@malipula.co.tz
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 shrink-0 mt-1" />
                <span>
                  Samora Avenue,<br />
                  Dar es Salaam,<br />
                  Tanzania
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Malipula Suits. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> in Tanzania
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
