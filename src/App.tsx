/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { api } from './services/api';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import ProductSection from './components/ProductSection';
import InfrastructureSection from './components/InfrastructureSection';
import ContactSection from './components/ContactSection';
import BlogSection from './components/BlogSection';
import ReviewsSection from './components/ReviewsSection';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import OfficerLogin from './components/OfficerLogin';
import OfficerDashboard from './components/OfficerDashboard';
import ProductDetails from './components/ProductDetails';
import Wishlist from './components/Wishlist';

function MainWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const parsed = await api.getData('site_settings', null);
        if (parsed) {
          if (parsed.primaryColor) {
            document.documentElement.style.setProperty('--color-tiger-orange', parsed.primaryColor);
          }
          if (parsed.secondaryColor) {
            document.documentElement.style.setProperty('--color-tiger-dark', parsed.secondaryColor);
          }
          if (parsed.companyName) {
            document.title = parsed.companyName;
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'products', 'infrastructure', 'contact'];
      const scrollPosition = window.scrollY + 250; // offset for detection trigger

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const offset = 80; // fixed header adjustment
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth',
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // fixed header adjustment
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Check state immediately before setting timer
    const hasDismissed = sessionStorage.getItem('hasDismissedPopup');
    if (hasDismissed) return;

    const checkAndShow = async () => {
      const currentDismissed = sessionStorage.getItem('hasDismissedPopup');
      if (currentDismissed) return;
      try {
        const user = await api.getData('active_customer', null);
        if (user) return;
        setIsLoginModalOpen(true);
      } catch (e) {
        console.warn(e);
      }
    };

    const timer = setTimeout(checkAndShow, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseLoginModal = () => {
    sessionStorage.setItem('hasDismissedPopup', 'true');
    setIsLoginModalOpen(false);
  };

  return (
    <div id="corporate-app-root" className="min-h-screen bg-[#faf9f6] flex flex-col antialiased selection:bg-tiger-orange selection:text-white">
      {/* Sticky Top-Level Navigation */}
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      {/* Main Structural Body */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero 
          onQuoteClick={() => handleScrollTo('contact')} 
          onExploreClick={() => handleScrollTo('products')} 
        />

        {/* Sustainable Foundation Details */}
        <AboutUs />

        {/* Dynamic RMG showcase showroom */}
        <ProductSection />

        {/* Mechanical capacity, HR force and Unit stats */}
        <InfrastructureSection />

        {/* Blog & News Section */}
        <BlogSection />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Inquiries channels and interactive request forms */}
        <ContactSection />
      </main>

      {/* Floating converting WhatsApp Care Trigger */}
      <FloatingWhatsApp />

      {/* Global Contact & Coordinates Footer */}
      <Footer />

      {/* Login Authentication Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal} 
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainWebsite />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/officer-login" element={<OfficerLogin />} />
      <Route path="/officer-dashboard" element={<OfficerDashboard />} />
    </Routes>
  );
}

