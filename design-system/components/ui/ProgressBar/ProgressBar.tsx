import React from 'react';

export interface ProgressBarProps {
    value: number; // 0-100
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
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Variant colors
    const variantStyles = {
        primary: 'bg-primary dark:bg-accent',
        secondary: 'bg-secondary dark:bg-secondary',
        success: 'bg-green-500',
        warning: 'bg-amber-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    return (
        <div className={`w-full ${className}`}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {label}
                        </span>
                    )}
                    {showLabel && (
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
