import React from 'react';
import { ImageWithSkeleton } from '../Skeleton';

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src = "https://picsum.photos/seed/ecycle/100/100",
    alt = "avatar",
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 border-2',
        md: 'w-11 h-11 border-[3px]',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className={`rounded-full border-primary dark:border-accent border-solid bg-white dark:bg-dark-surface flex items-center justify-center overflow-hidden shrink-0 aspect-square shadow-sm ${sizeClasses[size]} ${className}`}>
            <ImageWithSkeleton
                src={src}
                alt={alt}
                className="w-full h-full rounded-full"
                circle
                fallbackIcon="person"
            />
        </div>
    );
};

