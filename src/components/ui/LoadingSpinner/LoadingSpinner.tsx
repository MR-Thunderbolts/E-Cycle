import React from 'react';
import { Icon } from '../Icon';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'white' | 'gray';
    text?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', variant = 'primary', text, className = '' }) => (
    <div className={['ec-spinner', `ec-spinner--${variant}`, className].filter(Boolean).join(' ')} role="status">
        <Icon name="progress_activity" className={`ec-spin ec-spinner__icon--${size}`} />
        {text && <p className="ec-spinner__text">{text}</p>}
    </div>
);
