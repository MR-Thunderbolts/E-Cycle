import React, { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', padding = 'md', onClick, className = '' }) => {
    const cls = [
        'ec-card',
        `ec-card--${variant}`,
        padding !== 'none' ? `ec-card--p-${padding}` : '',
        onClick ? 'ec-card--interactive' : '',
        className,
    ].filter(Boolean).join(' ');
    return <div className={cls} onClick={onClick}>{children}</div>;
};
