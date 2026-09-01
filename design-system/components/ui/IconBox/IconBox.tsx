import React from 'react';

export interface IconBoxProps {
    icon: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'neutral' | 'success' | 'white';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({
    icon,
    variant = 'secondary',
    size = 'md',
    className = ''
}) => {
    // Size maps
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl',
        xl: 'w-14 h-14 text-2xl',
    };

    // Variant maps for [Background Color, Text Color]
    const variantClasses = {
        primary: 'bg-primary dark:bg-primary/20 text-white dark:text-accent',
        secondary: 'bg-[#D0EBE8] dark:bg-primary/20 text-primary-dark dark:text-accent',
        danger: 'bg-red-100 dark:bg-red-900/30 text-red-500',
        neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
        white: 'bg-white dark:bg-dark-surface text-primary-dark dark:text-accent', // For cards
        success: 'bg-[#E8F5E9] dark:bg-green-900/20 text-[#2E7D32] dark:text-green-400',
    };

    return (
        <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full flex items-center justify-center shrink-0 ${variantClasses[variant] || variantClasses.secondary} ${className}`}>
            <span className={`material-symbols-rounded ${variant === 'secondary' || variant === 'primary' ? 'filled-icon' : ''}`}>
                {icon}
            </span>
        </div>
    );
};
