'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

// ============================================
// REAL WHATSAPP SVG ICON
// ============================================
function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
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

// ============================================
// MAIN WHATSAPP BUTTON
// ============================================
interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your tailoring services at Malipula Suits.",
  position = 'bottom-right',
  className = '',
  showTooltip = true,
  tooltipText = "Chat with us!",
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  // Clean phone number
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  // Show button after delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hide pulse after first interaction hint
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`fixed z-50 ${positionClasses[position]} ${className}`}
        >
          {/* Tooltip */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-full mb-3 right-0 whitespace-nowrap"
            >
              <div className="relative bg-white rounded-xl px-4 py-2.5 shadow-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-800">{tooltipText}</p>
                <p className="text-xs text-gray-500">Tap to start chatting</p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
              </div>
            </motion.div>
          )}

          {/* Main Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full shadow-lg shadow-[#25D366]/30"
            aria-label="Contact us on WhatsApp"
          >
            {/* Pulse Effect */}
            {showPulse && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-20" />
              </>
            )}

            {/* Outer ring animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-white/20"
            />

            {/* WhatsApp Icon */}
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EXPANDABLE WHATSAPP BUTTON
// ============================================
interface ExpandableWhatsAppButtonProps extends WhatsAppButtonProps {
  expandedMessage?: string;
}

export function ExpandableWhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your tailoring services.",
  expandedMessage,
  position = 'bottom-right',
  className = '',
}: ExpandableWhatsAppButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(expandedMessage || message)}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`fixed z-50 ${positionClasses[position]} ${className}`}
        >
          {/* Expanded Chat Bubble */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-20 right-0 w-72 sm:w-80"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Header */}
                  <div className="bg-[#25D366] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Malipula Suits</p>
                      <p className="text-white/80 text-xs">Typically replies instantly</p>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="ml-auto text-white/80 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 bg-[#ECE5DD]">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-sm text-gray-700">
                        👋 Hello! Welcome to Malipula Suits.
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        How can we help you today? We're here to assist with bespoke tailoring, fittings, and any questions about our services.
                      </p>
                      <p className="text-xs text-gray-400 mt-2 text-right">Just now</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <motion.a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#20BD5A] transition-colors"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Start Conversation
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-colors ${
              isExpanded 
                ? 'bg-gray-700 shadow-gray-700/30' 
                : 'bg-[#25D366] shadow-[#25D366]/30'
            }`}
            aria-label="Open WhatsApp chat"
          >
            {/* Pulse Effect */}
            {!isExpanded && (
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
            )}

            {/* Icon */}
            {isExpanded ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// SIMPLE ICON-ONLY VERSION
// ============================================
export function WhatsAppIconOnly({
  phoneNumber,
  message = "Hello! I'm interested in your tailoring services.",
  className = '',
}: WhatsAppButtonProps) {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center w-10 h-10 bg-[#25D366] rounded-full text-white shadow-lg hover:shadow-[#25D366]/30 transition-shadow ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="w-5 h-5" />
    </motion.a>
  );
}

export default WhatsAppButton;
