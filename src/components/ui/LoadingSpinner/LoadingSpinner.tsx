import React from 'react';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'white' | 'gray';
    text?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'primary',
    text,
    className = '',
}) => {
    // Size styles
    const sizeStyles = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl',
    };

    // Variant colors
    const variantStyles = {
        primary: 'text-primary dark:text-accent',
        white: 'text-white',
        gray: 'text-gray-400',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <span className={`material-symbols-rounded animate-spin ${sizeStyles[size]} ${variantStyles[variant]}`}>
                progress_activity
            </span>
            {text && (
                <p className={`text-sm font-medium ${variantStyles[variant]}`}>
                    {text}
                </p>
            )}
        </div>
    );
};
