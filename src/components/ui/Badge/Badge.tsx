import React, { ReactNode } from 'react';

export interface BadgeProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    className?: string;
}

const DOT = { sm: 8, md: 10, lg: 12 };

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'md', dot = false, className = '' }) => {
    if (dot) {
        return (
            <span className={['ec-badge-dot', className].filter(Boolean).join(' ')}>
                <span className={`ec-badge-dot__dot ec-badge--${variant}`} style={{ width: DOT[size], height: DOT[size] }} />
                {children}
            </span>
        );
    }
    return (
        <span className={['ec-badge', `ec-badge--${variant}`, `ec-badge--${size}`, className].filter(Boolean).join(' ')}>
            {children}
        </span>
    );
};
