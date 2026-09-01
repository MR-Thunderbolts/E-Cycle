import React, { ReactNode } from 'react';

export interface BadgeProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    dot = false,
    className = '',
}) => {
    // Variant styles
    const variantStyles = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-primary',
        success: 'bg-green-500 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white',
        neutral: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    };

    // Size styles
    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    // Dot variant
    if (dot) {
        const dotSizes = {
            sm: 'w-2 h-2',
            md: 'w-2.5 h-2.5',
            lg: 'w-3 h-3',
        };

        return (
            <span className={`inline-flex items-center gap-1.5 ${className}`}>
                <span className={`rounded-full ${variantStyles[variant]} ${dotSizes[size]}`} />
                {children}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center justify-center font-semibold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
            {children}
        </span>
    );
};
