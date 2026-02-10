'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    placeholder = 'empty',
    blurDataURL,
    onLoad,
    onError,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
    };

    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}>
                Image not available
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                } ${className}`}
                priority={priority}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                onLoad={handleLoad}
                onError={handleError}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}