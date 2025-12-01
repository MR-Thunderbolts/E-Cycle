import React from 'react';

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src = "https://picsum.photos/100/100?random=user",
    alt = "avatar",
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 border-2 p-0.5',
        md: 'w-11 h-11 border-[3px] p-[2px]',
        lg: 'w-16 h-16 border-4 p-1'
    };

    return (
        <div className={`rounded-full border-primary border-solid bg-white dark:bg-dark-surface flex items-center justify-center overflow-hidden shrink-0 aspect-square shadow-sm ${sizeClasses[size]} ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover object-center rounded-full block"
            />
        </div>
    );
};
