'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your tailoring services.",
  position = 'bottom-right',
  className = '',
}: WhatsAppButtonProps) {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg ${positionClasses[position]} ${className}`}
      whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(37, 211, 102, 0.5)' }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      
      {/* WhatsApp icon */}
      <svg
        viewBox="0 0 92 93"
        fill="none"
        className="w-7 h-7 text-white relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.383437 46.081C0.381204 54.2018 2.48974 62.1312 6.49907 69.1203L0 93L24.2839 86.5923C31.0005 90.2719 38.5259 92.2 46.1733 92.2005H46.1934C71.4388 92.2005 91.9892 71.5273 92 46.1173C92.0048 33.8044 87.2443 22.226 78.595 13.5151C69.9471 4.805 58.4459 0.00561945 46.1915 0C20.9431 0 0.394233 20.6721 0.38381 46.081"
          fill="currentColor"
        />
        <path
          d="M34.4576 26.0905C33.5544 24.1027 32.6039 24.0626 31.745 24.0278C31.0417 23.9978 30.2377 24 29.4344 24C28.6304 24 27.3241 24.2995 26.2199 25.4934C25.1146 26.6883 22 29.576 22 35.4493C22 41.3226 26.3202 46.999 26.9225 47.7963C27.5255 48.5921 35.2627 61.0305 47.5166 65.8156C57.7007 69.7922 59.7732 69.0013 61.9835 68.8019C64.1941 68.6032 69.1166 65.9149 70.1208 63.1273C71.1258 60.3401 71.1258 57.9509 70.8245 57.4516C70.5232 56.9542 69.7192 56.6555 68.5135 56.0587C67.3079 55.462 61.3804 52.5735 60.2755 52.1751C59.1702 51.777 58.3666 51.5784 57.5625 52.7737C56.7585 53.9672 54.4499 56.6555 53.7462 57.4516C53.0432 58.2496 52.3395 58.3489 51.1343 57.7518C49.9279 57.1529 46.0453 55.8938 41.4389 51.8272C37.8549 48.6629 35.4353 44.7553 34.732 43.5599C34.0287 42.3665 34.6567 41.7195 35.2612 41.1246C35.8029 40.5898 36.4672 39.7306 37.0706 39.0338C37.6717 38.3366 37.8723 37.8392 38.2743 37.0431C38.6767 36.2462 38.4753 35.549 38.1744 34.9519C37.8723 34.3548 35.5296 28.4508 34.4576 26.0905Z"
          fill="white"
        />
      </svg>
    </motion.a>
  );
}

// Alternative with tooltip
interface WhatsAppButtonWithTooltipProps extends WhatsAppButtonProps {
  tooltip?: string;
}

export function WhatsAppButtonWithTooltip({
  phoneNumber,
  message,
  position = 'bottom-right',
  tooltip = "Chat with us!",
  className = '',
}: WhatsAppButtonWithTooltipProps) {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const encodedMessage = encodeURIComponent(message || "Hello! I'm interested in your services.");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <motion.div
      className={`fixed z-50 group ${positionClasses[position]} ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-white rounded-lg shadow-lg text-charcoal text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        {tooltip}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white" />
      </motion.div>

      {/* Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg"
        whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(37, 211, 102, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.a>
    </motion.div>
  );
}
