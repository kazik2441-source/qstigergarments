import React, { useState, useEffect } from 'react';
import { Scissors, Menu, X, ArrowRight, ShieldAlert, LogIn, UserCircle, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_NAME, CONTACT_INFO } from '../data';
import { api } from '../services/api';
import Logo from './Logo';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onLoginClick: () => void;
}

export default function Header({ activeSection, setActiveSection, onLoginClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState(COMPANY_NAME);
  const navigate = useNavigate();

  const [headerAlert, setHeaderAlert] = useState('');
  const [activeCustomer, setActiveCustomer] = useState<any>(null);

  const checkAuth = async () => {
    try {
      const stored = await api.getData('active_customer', null);
      if (stored) {
        setActiveCustomer(stored);
      } else {
        setActiveCustomer(null);
      }
    } catch(e) {}
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth_changed', checkAuth);
    
    const loadSettings = async () => {
      try {
        const parsed = await api.getData('site_settings', null);
        if (parsed) {
          if (parsed.companyName) {
            setSiteName(parsed.companyName);
          }
          if (parsed.headerAlertText) {
            setHeaderAlert(parsed.headerAlertText);
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadSettings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth_changed', checkAuth);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'products', label: 'Products' },
    { id: 'infrastructure', label: 'Infrastructure & Stats' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const handleLogout = async () => {
    if (activeCustomer) {
      try {
        const logs = await api.getData('customer_logs', []);
        const updatedLogs = logs.map((log: any) => {
          if (log.sessionId === activeCustomer.sessionId) {
            return { ...log, logoutTime: new Date().toISOString(), status: 'logged_out' };
          }
          return log;
        });
        await api.setData('customer_logs', updatedLogs);
        await api.setData('active_customer', null);
        setActiveCustomer(null);
        window.dispatchEvent(new Event('auth_changed'));
        window.location.reload();
      } catch (e) {
        console.warn("Storage blocked", e);
      }
    }
  };

  return (
    <>
      {headerAlert && (
        <div className="bg-tiger-orange text-white text-xs sm:text-sm font-semibold text-center py-2 px-4 shadow-md relative z-50">
          {headerAlert}
        </div>
      )}
      <header
        id="site-header"
        className={`fixed left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-tiger-dark/95 backdrop-blur-md shadow-xl border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
        style={{ top: headerAlert ? (isScrolled ? '0' : '36px') : '0' }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            id="header-brand-logo"
            onClick={() => scrollToSection('home')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
          >
            <Logo size={36} className="md:w-[46px] md:h-[46px] transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.25)]" />
            <div>
              <span className="font-display font-bold text-base md:text-xl tracking-tight text-white block leading-none truncate max-w-[140px] sm:max-w-none">
                {siteName}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-mono text-tiger-orange font-bold uppercase block mt-1">
                Freedom Life
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-navbar" className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                id={`nav-link-${item.id}`}
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/wishlist')}
              className="text-gray-300 hover:text-tiger-orange p-2 rounded-full transition-colors flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </nav>

          {/* Quote & Login Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              id="desktop-cta-quote"
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white px-2 py-2 text-sm font-semibold transition-colors duration-300 relative group"
            >
              Get Quote
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tiger-orange transition-all duration-300 group-hover:w-full"></span>
            </button>
            {activeCustomer ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  Hi, {activeCustomer.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-400 hover:text-red-300 px-3 py-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="desktop-cta-login"
                onClick={onLoginClick}
                className="group relative flex items-center space-x-2 bg-gradient-to-r from-tiger-orange to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(239,108,0,0.3)] hover:shadow-[0_0_25px_rgba(239,108,0,0.5)] transform hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
                <UserCircle className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Quick Actions (Login + Menu) */}
          <div className="md:hidden flex items-center space-x-2 shrink-0">
            <button
              onClick={() => navigate('/wishlist')}
              className="p-1.5 text-gray-300 hover:text-tiger-orange"
            >
              <Heart className="w-5 h-5" />
            </button>
            {activeCustomer ? (
              <button
                onClick={handleLogout}
                className="text-[10px] font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded transition-colors"
                title="Logout"
              >
                Logout
              </button>
            ) : (
              <button
                id="mobile-quick-login"
                onClick={onLoginClick}
                className="flex items-center space-x-1 bg-gradient-to-r from-tiger-orange to-orange-500 text-white px-3 py-1.5 rounded text-[10px] font-bold"
              >
                <UserCircle className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div
        id="mobile-navigation-drawer"
        className={`md:hidden fixed inset-x-0 top-[73px] bg-tiger-dark/98 backdrop-blur-lg border-b border-white/10 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              id={`mobile-nav-link-${item.id}`}
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-tiger-orange text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/wishlist');
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all text-tiger-orange hover:text-white hover:bg-tiger-orange flex items-center space-x-2"
          >
            <Heart className="w-5 h-5" />
            <span>My Wishlist</span>
          </button>
          <div className="pt-4 border-t border-white/5 space-y-2">
            <button
              id="mobile-cta-quote"
              onClick={() => scrollToSection('contact')}
              className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-lg text-center font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Free Quote Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="mobile-cta-officer-login"
              onClick={() => navigate('/officer-login')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-3 rounded-lg text-center font-semibold transition-all flex items-center justify-center space-x-2 border border-gray-700"
            >
              <Shield className="w-4 h-4" />
              <span>Officer Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
