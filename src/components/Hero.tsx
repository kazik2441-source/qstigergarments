import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Scissors, ArrowRight, Zap } from 'lucide-react';
import { COMPANY_NAME, TAGLINE, ESTABLISHED_YEAR } from '../data';
import Logo from './Logo';
import { api, optimizeCloudinaryUrl } from '../services/api';

interface HeroProps {
  onQuoteClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onQuoteClick, onExploreClick }: HeroProps) {
  const [siteName, setSiteName] = useState(COMPANY_NAME);
  const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&q=80&w=2000');

  useEffect(() => {
    const loadData = async () => {
      try {
        const parsed = await api.getData('site_settings', null);
        if (parsed) {
          if (parsed.companyName) {
            setSiteName(parsed.companyName);
          }
          if (parsed.homeBanner) {
            setHeroBg(parsed.homeBanner);
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadData();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-tiger-dark"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={optimizeCloudinaryUrl(heroBg)}
          alt="Premium Dark Fabric Texture"
          loading="lazy"
          className="w-full h-full object-cover object-center opacity-40 transform scale-105 filter brightness-50 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tiger-dark/95 via-tiger-dark/85 to-tiger-dark/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-tiger-dark/40 to-tiger-dark/95" />
      </div>

      {/* Grid Decors (Aesthetic Textile pattern overlay) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#e05e00 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center">
        
        {/* Established Badge */}
        <motion.div
          id="hero-badge"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 bg-tiger-orange/15 border border-tiger-orange/30 px-4 py-1.5 rounded-full mb-4"
        >
          <Sparkles className="w-4 h-4 text-tiger-orange" />
          <span className="text-xs uppercase font-mono tracking-widest text-[#f08535] font-semibold">
            ESTABLISHED SINCE {ESTABLISHED_YEAR}
          </span>
        </motion.div>

        {/* B2B Business Model Badge */}
        <motion.div
          id="hero-b2b-badge"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center space-x-3 bg-gradient-to-r from-tiger-orange via-amber-500 to-tiger-orange border border-amber-400/50 shadow-[0_0_20px_rgba(224,94,0,0.3)] px-6 py-2.5 rounded-full mb-8 relative overflow-hidden group cursor-default"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="text-sm md:text-base uppercase font-display tracking-widest text-white font-bold drop-shadow-md">
            Premium B2B Wholesale Marketing & Apparel Sourcing Platform
          </span>
        </motion.div>

        {/* Brand Logo logo-art */}
        <motion.div
          id="hero-logo-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-2xl animate-pulse" />
          <Logo size={140} className="relative z-10 filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-300" />
        </motion.div>

        {/* Brand Headline */}
        <motion.h2
          id="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight text-white max-w-5xl leading-tight"
        >
          {siteName}
        </motion.h2>

        {/* Brand Tagline in Elegant Display Style */}
        <motion.p
          id="hero-tagline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-tiger-orange via-amber-500 to-amber-200 tracking-[0.08em] my-6"
        >
          &ldquo;{TAGLINE}&rdquo;
        </motion.p>

        {/* Corporate Bulletpoint Subheadings */}
        <motion.p
          id="hero-subtext"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 text-center max-w-2xl leading-relaxed mb-10"
        >
          Premium industrial-grade Textile & Ready-Made Garments (RMG) manufacturing. 
          Pioneering bulk organic knitwear and children baby jeans with 100% zero-waste standards.
        </motion.p>

        {/* Key Operational Highlights */}
        <motion.div
          id="hero-features-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl w-full mb-12 border-t border-b border-white/5 py-6"
        >
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <div className="bg-white/5 p-2 rounded-lg text-tiger-orange">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-white text-sm font-semibold">100% Checked Quality</span>
              <span className="block text-gray-400 text-xs">Zero-defect dispatch parameters</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center">
            <div className="bg-white/5 p-2 rounded-lg text-tiger-orange">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-white text-sm font-semibold">Organic Cotton & linen</span>
              <span className="block text-gray-400 text-xs">100% Sustainable fiber sourcing</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-end">
            <div className="bg-white/5 p-2 rounded-lg text-tiger-orange">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-white text-sm font-semibold">1.2 Lakh Pieces/Mo</span>
              <span className="block text-gray-400 text-xs">High throughput capacity systems</span>
            </div>
          </div>
        </motion.div>

        {/* CTA Button Group */}
        <motion.div
          id="hero-cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 w-full sm:w-auto"
        >
          <button
            id="hero-btn-quote"
            onClick={onQuoteClick}
            className="group w-full sm:w-auto bg-tiger-orange hover:bg-tiger-orange/90 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-300 hover:shadow-xl hover:shadow-tiger-orange/20 flex items-center justify-center space-x-2.5 border border-transparent hover:border-white/10"
          >
            <span>Get a Quote / Contact Us</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          <button
            id="hero-btn-products"
            onClick={onExploreClick}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-300 border border-white/10 hover:border-white/20 text-center block"
          >
            Browse Products Range
          </button>
        </motion.div>

      </div>

      {/* Smooth transition wave/border divider to next section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[2px] z-10">
        <svg
          className="relative block w-full h-[40px] md:h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 120L0 0C132.33 3.96 261 48 402 48C576 48 702-8 873-8C986-8 1085 19.33 1200 44L1200 120Z"
            className="fill-[#faf9f6]"
          ></path>
        </svg>
      </div>

    </section>
  );
}
