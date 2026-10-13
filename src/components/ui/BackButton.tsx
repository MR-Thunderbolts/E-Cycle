import React from 'react';
import { Icon } from './Icon';

interface BackButtonProps {
    onClick: () => void;
    variant?: 'default' | 'overlay';
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, variant = 'default', className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label="Volver"
        className={['ec-backbtn', variant === 'overlay' ? 'ec-backbtn--overlay' : '', className].filter(Boolean).join(' ')}
    >
        <Icon name="arrow_back" />
    </button>
);
