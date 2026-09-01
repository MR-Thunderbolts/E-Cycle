import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    className?: string;
    skeletonClassName?: string;
    /** Set to true for circular images (e.g. avatars) */
    circle?: boolean;
    /** Optional fallback icon name (Material Symbols) when image fails to load */
    fallbackIcon?: string;
}

/**
 * Drop-in replacement for <img> that shows a shimmer skeleton while loading
 * and smoothly fades in the image once it's ready.
 */
export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
    src,
    alt,
    className = '',
    skeletonClassName,
    circle = false,
    fallbackIcon,
}) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    return (
        <div className={`relative ${className}`}>
            {/* Skeleton shown until the image fully loads */}
            {status === 'loading' && (
                <Skeleton
                    className={`absolute inset-0 ${skeletonClassName ?? ''}`}
                    circle={circle}
                />
            )}

            {/* Error fallback */}
            {status === 'error' && fallbackIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-rounded text-gray-400">{fallbackIcon}</span>
                </div>
            )}

            {/* The actual image — hidden until loaded to avoid a flash */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
            />
        </div>
    );
};
