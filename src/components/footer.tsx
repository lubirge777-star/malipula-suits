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

// ============================================
// WHATSAPP ICON COMPONENT
// ============================================
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
                { icon: WhatsAppIcon, href: 'https://wa.me/255654321987?text=Hello! I\'m interested in your tailoring services.', isWhatsApp: true },
                { icon: Instagram, href: 'https://instagram.com/malipula_suits' },
                { icon: Facebook, href: 'https://facebook.com/malipulasuits' },
                { icon: Twitter, href: 'https://twitter.com/malipulasuits' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    social.isWhatsApp 
                      ? 'bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-lg hover:shadow-[#25D366]/30' 
                      : 'bg-white/10 hover:bg-gold hover:text-charcoal'
                  }`}
                  title={social.isWhatsApp ? 'Chat on WhatsApp' : undefined}
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
