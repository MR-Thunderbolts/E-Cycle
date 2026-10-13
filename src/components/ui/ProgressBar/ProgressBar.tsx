import React from 'react';

export interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    label,
    className = '',
}) => {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
        <div className={['ec-progress', className].filter(Boolean).join(' ')}>
            {(showLabel || label) && (
                <div className="ec-progress__head">
                    {label && <span className="ec-progress__label">{label}</span>}
                    {showLabel && <span className="ec-progress__pct">{Math.round(pct)}%</span>}
                </div>
            )}
            <div
                className={`ec-progress__track ec-progress--${size}`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={Math.min(value, max)}
                aria-label={label}
            >
                <div className={`ec-progress__fill ec-progress__fill--${variant}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};
