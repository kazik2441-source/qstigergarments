import React, { useState, useEffect } from 'react';
const logoImg = '/favicon.jpg';
import { api, optimizeCloudinaryUrl } from '../services/api';
import ImageWithLoader from './ImageWithLoader';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'icon-only' | 'monochrome';
}

export default function Logo({ className = '', size = 120, variant = 'full' }: LogoProps) {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const settings = await api.getSiteSettings();
        if (settings && settings.logoUrl) {
          setCustomLogo(settings.logoUrl);
        } else {
          // Fallback to old key-value store if new one is empty
          const parsed = await api.getData('site_settings', null);
          if (parsed && parsed.logo) {
            setCustomLogo(parsed.logo);
          }
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadData();
  }, []);

  return (
    <ImageWithLoader
      src={optimizeCloudinaryUrl(customLogo || logoImg)} 
      alt="Official Logo" 
      loading="lazy"
      style={{ width: size, height: 'auto', maxHeight: size }} 
      className={`object-contain ${className}`} 
      containerClassName="inline-block"
    />
  );
}
