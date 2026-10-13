import React from 'react';
import { Icon } from '../Icon';

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
    type = 'button',
    ...props
}) => (
    <button
        type={type}
        className={['ec-iconbtn', `ec-iconbtn--${variant}`, `ec-iconbtn--${size}`, className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
        {...props}
    >
        <Icon name={icon} />
    </button>
);
