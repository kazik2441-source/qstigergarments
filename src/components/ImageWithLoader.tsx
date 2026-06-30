import React, { useState, useEffect, useRef } from 'react';

interface ImageWithLoaderProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
  showSpinner?: boolean;
  style?: React.CSSProperties;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  loading?: "lazy" | "eager";
  [key: string]: any;
}

export const loadedUrls = new Set<string>();

export default function ImageWithLoader({
  src,
  alt,
  className = '',
  containerClassName = '',
  placeholderClassName = '',
  showSpinner = true,
  style,
  onLoad,
  ...props
 }: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(() => {
    return src ? loadedUrls.has(src) : false;
  });
  const [shouldShowSpinner, setShouldShowSpinner] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (src && loadedUrls.has(src)) {
      setIsLoaded(true);
      setShouldShowSpinner(false);
      return;
    }

    // Reset load state on src change
    setIsLoaded(false);
    setShouldShowSpinner(false);

    // If image is already fully loaded in cache, mark as loaded instantly
    if (imgRef.current && imgRef.current.complete) {
      if (src) loadedUrls.add(src);
      setIsLoaded(true);
      return;
    }

    // Delay spinner appearance by 500ms to allow smooth fast loading without any flashing
    const timer = setTimeout(() => {
      setShouldShowSpinner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (src) {
      loadedUrls.add(src);
    }
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md flex items-center justify-center z-10 ${placeholderClassName}`}>
          {showSpinner && shouldShowSpinner && (
            <div className="w-5 h-5 border-2 border-tiger-orange border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
      <img
        ref={imgRef}
        src={src || null}
        alt={alt}
        onLoad={handleLoad}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 30ms ease-in-out',
        }}
        className={className}
        {...props}
      />
    </div>
  );
}
