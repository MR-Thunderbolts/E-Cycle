import React from 'react';

interface SkeletonProps {
    className?: string;
    circle?: boolean;
    style?: React.CSSProperties;
}

/** Placeholder that pulses between 100 % and 45 % opacity. Size it with `style` or `className`. */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', circle = false, style }) => (
    <div
        aria-hidden="true"
        style={style}
        className={['ec-skeleton', circle ? 'ec-skeleton--circle' : '', className].filter(Boolean).join(' ')}
    />
);
