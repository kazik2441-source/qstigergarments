import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_INFO } from '../data';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show a helpful conversion quote tooltip 3 seconds after loading
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleIconClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
  };

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end">
      
      {/* Animated Greeting Conversational Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            id="whatsapp-helper-tooltip"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="mb-3 bg-white text-tiger-dark p-4 rounded-2xl shadow-2xl border border-gray-150 max-w-xs w-72 relative"
          >
            {/* Tooltip Arrow */}
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white border-r border-b border-gray-150 rotate-45" />

            <div className="flex items-start justify-between mb-2 pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold font-mono tracking-wider text-green-600 uppercase">Q.S TIGER CARE</span>
              </div>
              <button
                id="close-whatsapp-tooltip"
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-tiger-dark transition-colors p-0.5 rounded-md hover:bg-gray-100"
                aria-label="Dismiss message bubble"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 text-left">
              <p className="text-xs font-semibold text-tiger-dark">
                Trade & Order Assistance
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Namaskar! Reach out direct on WhatsApp for speedy responses regarding garments pricing and custom sizing.
              </p>
            </div>

            <a
              id="whatsapp-tooltip-direct-link"
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleIconClick}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-colors w-full"
            >
              <span>Instant Chat</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pulse Floating Green Chat Button */}
      <motion.a
        id="main-whatsapp-floating-btn"
        href={CONTACT_INFO.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleIconClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with our sales team via WhatsApp"
        className="relative text-white p-3.5 rounded-full shadow-2xl hover:shadow-[#25D366]/40 shadow-[#25D366]/40 transition-shadow flex items-center justify-center group"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* Glow pulsing ring around the button */}
        <span className="absolute inset-0 rounded-full border border-[#25D366]/80 animate-pulse scale-110 pointer-events-none" />
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366]/30 animate-ping pointer-events-none" />

        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 fill-current text-white group-hover:rotate-12 transition-transform duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Floating brand indicator */}
        <span className="absolute top-[-3px] right-[-3px] flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
        </span>
      </motion.a>
    </div>
  );
}
