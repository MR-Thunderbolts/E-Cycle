import React, { ReactNode } from 'react';

export interface EmptyStateProps {
    icon?: string; // Material Symbol icon name
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
            {/* Icon */}
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 blur-xl rounded-full scale-150 opacity-50" />
                <span className="relative material-symbols-rounded text-6xl text-gray-400 dark:text-gray-600">
                    {icon}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-2">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mb-6">
                    {description}
                </p>
            )}

            {/* Action */}
            {action && <div>{action}</div>}
        </div>
    );
};
