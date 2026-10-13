import React from 'react';

interface SkeletonProps {
    className?: string;
    circle?: boolean;
    style?: React.CSSProperties;
}

/** Shimmer placeholder. Size it with `style` or `className`. */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', circle = false, style }) => (
    <div
        aria-hidden="true"
        style={style}
        className={['skeleton-shimmer', 'ec-skeleton', circle ? 'ec-skeleton--circle' : '', className].filter(Boolean).join(' ')}
    />
);
