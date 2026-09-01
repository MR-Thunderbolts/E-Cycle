import React from 'react';

interface SkeletonProps {
    className?: string;
    circle?: boolean;
}

/**
 * Skeleton placeholder with shimmer animation.
 * Use `className` to control size/shape (e.g., `w-32 h-32 rounded-2xl`).
 * Use `circle` for circular avatars/icons.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', circle = false }) => {
    return (
        <div
            className={`skeleton-shimmer ${circle ? 'rounded-full' : 'rounded-2xl'} ${className}`}
            aria-hidden="true"
        />
    );
};
