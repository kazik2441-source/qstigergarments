import React, { useState } from 'react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  placeholderClassName?: string;
  showSpinner?: boolean;
}

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
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md flex items-center justify-center z-10 ${placeholderClassName}`}>
          {showSpinner && (
            <div className="w-5 h-5 border-2 border-tiger-orange border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        className={className}
        {...props}
      />
    </div>
  );
}
