import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string; // Material Symbol icon name
    variant?: 'default' | 'primary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    variant = 'default',
    size = 'md',
    ariaLabel,
    className = '',
    ...props
}) => {
    // Variant styles
    const variantStyles = {
        default: 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10',
        primary: 'text-primary dark:text-accent hover:bg-primary/10',
        ghost: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5',
    };

    // Size styles
    const sizeStyles = {
        sm: 'w-8 h-8 text-xl',
        md: 'w-10 h-10 text-2xl',
        lg: 'w-12 h-12 text-3xl',
    };

    const baseStyles = 'rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            aria-label={ariaLabel}
            {...props}
        >
            <span className="material-symbols-rounded">{icon}</span>
        </button>
    );
};
