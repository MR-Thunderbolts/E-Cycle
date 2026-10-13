import React from 'react';
import { Icon } from '../Icon';

export interface IconBoxProps {
    icon: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'neutral' | 'success' | 'white';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({ icon, variant = 'secondary', size = 'md', className = '' }) => (
    <div className={['ec-iconbox', `ec-iconbox--${size}`, `ec-iconbox--${variant}`, className].filter(Boolean).join(' ')}>
        <Icon name={icon} filled={variant === 'secondary' || variant === 'primary'} />
    </div>
);
