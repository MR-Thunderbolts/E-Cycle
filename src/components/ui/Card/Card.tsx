import React, { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    onClick,
    className = '',
}) => {
    // Variant styles
    const variantStyles = {
        default: 'bg-white dark:bg-dark-surface shadow-sm',
        elevated: 'bg-white dark:bg-dark-surface shadow-lg',
        outlined: 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border',
    };

    // Padding styles
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    // Interactive styles if onClick is provided
    const interactiveStyles = onClick
        ? 'cursor-pointer active:scale-[0.98] transition-transform'
        : '';

    const combinedStyles = `rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`;

    return (
        <div className={combinedStyles} onClick={onClick}>
            {children}
        </div>
    );
};
