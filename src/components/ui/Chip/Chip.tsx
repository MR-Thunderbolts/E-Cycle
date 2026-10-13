import React, { ReactNode } from 'react';
import { Icon } from '../Icon';

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
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        aria-pressed={onClick ? active : undefined}
        data-clickable={onClick ? 'true' : 'false'}
        className={['ec-chip', `ec-chip--${variant}-${active ? 'on' : 'off'}`, className].filter(Boolean).join(' ')}
    >
        {icon && <Icon name={icon} />}
        {children}
    </button>
);
