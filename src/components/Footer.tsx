import React, { useState, useEffect } from 'react';
import { Scissors, Mail, Phone, MapPin, ArrowUpRight, Heart, ShieldCheck } from 'lucide-react';
import { COMPANY_NAME, TAGLINE, CONTACT_INFO, ESTABLISHED_YEAR, MANUFACTURING_UNITS } from '../data';
import { api } from '../services/api';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteName, setSiteName] = useState(COMPANY_NAME);
  const [corpDesc, setCorpDesc] = useState(`An distinguished garments and textile weaving institution established in ${ESTABLISHED_YEAR}. Engineering compliant ready-made garment pipelines utilizing premium organic fibers and zero-waste fabrication standards of Kolkata.`);
  const [address, setAddress] = useState(CONTACT_INFO.headquarters);
  const [socialFB, setSocialFB] = useState('');
  const [socialIG, setSocialIG] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const parsed = await api.getData('site_settings', null);
        if (parsed) {
          if (parsed.companyName) {
            setSiteName(parsed.companyName);
          }
          if (parsed.corporateDescription) {
            setCorpDesc(parsed.corporateDescription);
          }
          if (parsed.officeAddress) {
            setAddress(parsed.officeAddress);
          }
          if (parsed.socialFacebook) {
            setSocialFB(parsed.socialFacebook);
          }
          if (parsed.socialInstagram) {
            setSocialIG(parsed.socialInstagram);
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadSettings();
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer id="site-footer" className="bg-[#0e0e10] text-gray-400 pt-20 pb-10 relative overflow-hidden border-t border-white/5">
      
      {/* Visual background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-tiger-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Brand & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/5">
          
          {/* Logo Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo size={48} className="filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform duration-300" />
              <div>
                <span className="font-display font-bold text-white text-xl tracking-tight block leading-none">
                  {siteName}
                </span>
                <span className="text-[10px] tracking-[0.15em] font-mono text-tiger-orange font-bold uppercase block mt-1">
                  ESTO. {ESTABLISHED_YEAR}
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm whitespace-pre-wrap">
              {corpDesc}
            </p>

            <div className="flex items-center space-x-3 text-xs font-mono text-gray-500 border-l-2 border-tiger-orange pl-3 mb-4">
              <ShieldCheck className="w-4 h-4 text-tiger-orange shrink-0" />
              <span>WHOLESALE REGISTERED EXPORT UNIT</span>
            </div>

            {(socialFB || socialIG) && (
              <div className="flex items-center space-x-4 pt-2">
                {socialFB && (
                  <a href={socialFB} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-tiger-orange transition-colors">
                    Facebook
                  </a>
                )}
                {socialIG && (
                  <a href={socialIG} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-tiger-orange transition-colors">
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links columns */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-display font-medium text-white text-sm uppercase tracking-widest">
              Trade Index Links
            </h4>
            
            <ul className="space-y-3.5 text-sm">
              <li>
                <button
                  id="foot-link-home"
                  onClick={() => handleScrollTo('home')}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>Home Landing</span>
                </button>
              </li>
              <li>
                <button
                  id="foot-link-about"
                  onClick={() => handleScrollTo('about')}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>Sustainable Legacy</span>
                </button>
              </li>
              <li>
                <button
                  id="foot-link-products"
                  onClick={() => handleScrollTo('products')}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>Virtual Showroom</span>
                </button>
              </li>
              <li>
                <button
                  id="foot-link-infra"
                  onClick={() => handleScrollTo('infrastructure')}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>Production & Stats</span>
                </button>
              </li>
              <li>
                <button
                  id="foot-link-contact"
                  onClick={() => handleScrollTo('contact')}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>Procurement Form</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Direct channel details */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-display font-medium text-white text-sm uppercase tracking-widest">
              Direct Inquiries
            </h4>

            <div className="space-y-4 text-sm">
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-tiger-orange shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <span className="block font-semibold text-white">Central Registry HQ</span>
                  <span className="block mt-0.5 text-xs text-gray-500 whitespace-pre-wrap">{address}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-tiger-orange shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <span className="block font-semibold text-white">Main Manufacturing</span>
                  <span className="block mt-0.5 text-xs text-gray-500">Kolkata, Makal Hati, Molla Para</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Phone className="w-4 h-4 text-tiger-orange mt-0.5" />
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="hover:text-white transition-colors font-mono">
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-tiger-orange mt-0.5" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors break-all font-mono">
                  {CONTACT_INFO.email}
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div id="footer-bottom" className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
          <div>
            <span>&copy; {currentYear} <strong>{siteName}</strong>. All Rights Reserved.</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Stitched with commitment in Kolkata, West Bengal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hover:text-white cursor-pointer" onClick={() => handleScrollTo('home')}>Terms of Trade</span>
            <span className="text-gray-700">•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => handleScrollTo('home')}>Compliance Certifications</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
