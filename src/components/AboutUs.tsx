import React, { useState, useEffect } from 'react';
import { Leaf, RefreshCw, Layers, Sparkles, Building, BookmarkCheck } from 'lucide-react';
import { ESTABLISHED_YEAR, SUSTAINABILITY_PILLARS, COMPANY_NAME } from '../data';
import { api, optimizeCloudinaryUrl } from '../services/api';
import ceoImg from '../assets/ceo.jpg';
import ImageWithLoader from './ImageWithLoader';

export default function AboutUs() {
  const [siteName, setSiteName] = useState(COMPANY_NAME);
  const [ceoImage, setCeoImage] = useState(ceoImg);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await api.getSiteSettings();
        if (settings && settings.ceoImageUrl) {
          setCeoImage(settings.ceoImageUrl);
        } else {
          // Fallback
          const parsed = await api.getData('site_settings', null);
          if (parsed) {
            if (parsed.companyName) {
              setSiteName(parsed.companyName);
            }
            if (parsed.ceoImage) {
              setCeoImage(parsed.ceoImage);
            }
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadSettings();
  }, []);

  return (
    <section id="about" className="py-24 bg-[#faf9f6] relative overflow-hidden">
      
      {/* Decorative vector threads inside background */}
      <div className="absolute top-1/4 right-[5%] w-96 h-96 rounded-full bg-tiger-orange/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="about-heading" className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-tiger-orange/10 px-3.5 py-1.5 rounded-full mb-4">
            <BookmarkCheck className="w-4 h-4 text-tiger-orange" />
            <span className="text-xs font-mono font-bold tracking-widest text-tiger-orange uppercase">Our Legacy</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-tiger-dark tracking-tight leading-tight">
            Pioneering Sustainable Textile Manufacturing Since {ESTABLISHED_YEAR}
          </h2>
          <div className="w-16 h-1.5 bg-tiger-orange mx-auto mt-6 rounded-full" />
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: General Corporate Journey */}
          <div id="about-corporate-narrative" className="lg:col-span-6 space-y-6">
            <span className="text-sm font-mono tracking-widest text-gray-400 font-bold uppercase block">
              16+ YEARS OF HIGH-STANDARDS TAILORING
            </span>
            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-tiger-dark leading-snug">
              Delivering Premium Apparel with Unmatched Structural Integrity
            </h3>
            
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Founded in 2010, <strong className="text-tiger-dark font-semibold">{siteName}</strong> has evolved into a premier ready-made garments (RMG) manufacturer based in Kolkata, India. Driven by our foundational philosophy of <strong className="text-tiger-orange font-semibold">&ldquo;FREEDOM LIFE&rdquo;</strong>, we master the art of producing soft-knits and children's collections that combine dynamic performance with organic comfort.
            </p>

            <p className="text-gray-600 leading-relaxed text-base">
              Starting from a small localized team, we grew intentionally to operate state-of-the-art facilities across Makal Hati and Sontoshpur. Today, with over 50-60 skilled core artisans, master-cutters, and high-speed industrial mechanisms, we dispatch over 1.2 Lakh pieces monthly to various distributors across India and abroad.
            </p>

            {/* Micro list of facts */}
            <div id="about-fast-facts" className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Building className="w-5 h-5 text-tiger-orange mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-tiger-dark text-sm">Dual Facilities</span>
                  <span className="block text-gray-500 text-xs">Makalhati & Sontoshpur units</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-tiger-orange mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-tiger-dark text-sm">100% Quality Assurance</span>
                  <span className="block text-gray-500 text-xs">Exemplary zero-defect finish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Sustainability Values */}
          <div id="about-sustainability-values" className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
              <h3 className="font-display font-bold text-xl sm:text-2xl text-tiger-dark">
                Eco-Conscious Manufacturing Values
              </h3>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-4 mb-6">
              Our planet deserves conscious guardianship. Q.S Tiger Garments implements comprehensive green production pipelines to keep clothing manufacture clean, low-waste, and socially responsible.
            </p>

            {/* Sustainability Pillars Cards list */}
            <div className="space-y-6">
              {SUSTAINABILITY_PILLARS.map((pillar, i) => {
                const colors = [
                  "bg-green-50 text-green-600 border-green-100",
                  "bg-orange-50 text-tiger-orange border-orange-100",
                  "bg-blue-50 text-blue-600 border-blue-100"
                ];
                const icons = [
                  <Leaf className="w-5 h-5" key="leaf" />,
                  <RefreshCw className="w-5 h-5" key="refresh" />,
                  <Layers className="w-5 h-5" key="layers" />
                ];

                return (
                  <div
                    id={`sustainability-card-${i}`}
                    key={i}
                    className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-xl hover:bg-[#faf9f6] transition-colors duration-200 border border-transparent hover:border-gray-100"
                  >
                    <div className={`p-3 rounded-xl border shrink-0 ${colors[i % colors.length]}`}>
                      {icons[i % icons.length]}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-semibold text-tiger-dark text-base">
                        {pillar.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Leadership Branding Section */}
        <div className="mt-20 border-t border-gray-200 pt-16">
          <div className="text-center mb-10">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-tiger-dark tracking-tight">
              Executive Leadership
            </h3>
            <div className="w-16 h-1 bg-tiger-orange mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Left: CEO Large Photo */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <ImageWithLoader 
                  src={optimizeCloudinaryUrl(ceoImage)} 
                  alt="KAZI SHAKAOTULLA - CEO" 
                  loading="lazy"
                  className="w-full h-auto object-cover aspect-[3/4]"
                  containerClassName="w-full h-auto aspect-[3/4]"
                />
              </div>
              <div className="text-center mt-6">
                <h4 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 uppercase tracking-wide">KAZI SHAKAOTULLA</h4>
                <span className="text-sm font-mono tracking-widest text-tiger-orange uppercase block mt-2 font-bold">CEO & OWNER</span>
              </div>
            </div>
            
            {/* Right: Company Owner / Info */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-tiger-orange/10 rounded-full flex items-center justify-center mb-6">
                  <BookmarkCheck className="w-10 h-10 text-tiger-orange" />
                </div>
                <span className="text-sm font-mono tracking-widest text-tiger-orange uppercase block mb-3 font-bold">COMPANY FOUNDER</span>
                <h4 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-wide leading-snug">KAZI MD SANAULLA</h4>
                <div className="w-12 h-1 bg-gray-200 mx-auto mt-6 rounded-full mb-6"></div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Pioneering the vision of sustainable, premium-quality garments manufacturing since inception, driving our core philosophy of "Freedom Life".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
