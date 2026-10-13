import React from 'react';
import { Icon } from '../Icon';

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'avatar', size = 'md', className = '' }) => (
    <div className={['ec-avatar', `ec-avatar--${size}`, className].filter(Boolean).join(' ')}>
        {src ? <img src={src} alt={alt} /> : <Icon name="person" style={{ color: 'var(--ec-gray-400)' }} />}
    </div>
);
