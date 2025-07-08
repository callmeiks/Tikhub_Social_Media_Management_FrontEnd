import React, { useState } from 'react';

interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackText?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm', 
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-2xl'
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  fallbackText,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);

  const convertToJPG = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        try {
          const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(jpgDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageUrl;
    });
  };

  React.useEffect(() => {
    if (src) {
      setLoading(true);
      setImageError(false);
      
      convertToJPG(src)
        .then((jpgSrc) => {
          setConvertedSrc(jpgSrc);
          setLoading(false);
        })
        .catch((error) => {
          console.warn('Failed to convert image to JPG:', error);
          setConvertedSrc(src);
          setLoading(false);
        });
    }
  }, [src]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError(true);
  };

  const getFallbackText = (): string => {
    if (fallbackText) return fallbackText;
    if (alt) return alt.charAt(0).toUpperCase();
    return '?';
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${className}`;

  if (imageError || !src) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-blue-400 to-purple-500 text-white`}>
        {getFallbackText()}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} overflow-hidden bg-gray-200`}>
      {loading && (
        <div className="animate-pulse bg-gray-300 w-full h-full rounded-full" />
      )}
      {convertedSrc && (
        <img
          src={convertedSrc}
          alt={alt}
          className={`w-full h-full object-cover rounded-full ${loading ? 'hidden' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
};