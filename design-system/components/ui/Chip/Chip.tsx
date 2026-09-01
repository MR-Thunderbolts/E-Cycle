import React, { ReactNode } from 'react';

export interface ChipProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    icon?: string; // Material Symbol icon name
    variant?: 'default' | 'primary' | 'secondary';
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({
    children,
    active = false,
    onClick,
    icon,
    variant = 'default',
    className = '',
}) => {
    // Base styles
    const baseStyles = 'px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors flex items-center gap-1 border shrink-0';

    // Active/inactive styles based on variant
    const variantStyles = {
        default: {
            active: 'bg-primary text-white border-primary shadow-md shadow-primary/20',
            inactive: 'bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5',
        },
        primary: {
            active: 'bg-primary text-white border-primary shadow-md shadow-primary/20',
            inactive: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent border-primary/20 hover:bg-primary/20',
        },
        secondary: {
            active: 'bg-accent text-primary border-accent shadow-md shadow-accent/20',
            inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700',
        },
    };

    const stateStyles = active ? variantStyles[variant].active : variantStyles[variant].inactive;

    // Interactive or static
    const interactiveStyles = onClick ? 'cursor-pointer' : '';

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`${baseStyles} ${stateStyles} ${interactiveStyles} ${className}`}
        >
            {icon && <span className="material-symbols-rounded text-sm">{icon}</span>}
            {children}
        </button>
    );
};
