import React from 'react';
import { IconBox, IconBoxProps } from '../IconBox/IconBox';

interface MenuItemProps {
    icon: string;
    label: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
    variant?: 'default' | 'danger';
    className?: string;
    iconVariant?: IconBoxProps['variant'];
    showChevron?: boolean;
    description?: string;
    border?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onClick,
    rightElement,
    variant = 'default',
    className = '',
    iconVariant, // Optional override, otherwise defaults based on variant
    showChevron = true,
    description,
    border = true
}) => {

    // Determine styles based on variant
    const isDanger = variant === 'danger';

    const containerClasses = `w-full p-4 flex items-center gap-4 transition-colors ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5' : ''
        } ${border ? 'border-b border-gray-50 dark:border-gray-800' : ''
        } ${className}`;

    const textClass = isDanger
        ? 'text-red-500 font-medium'
        : 'text-text dark:text-dark-text font-medium text-sm';

    // Auto-select icon variant if not provided
    const resolvedIconVariant = iconVariant || (isDanger ? 'danger' : 'secondary');

    return (
        <div className={containerClasses} onClick={onClick}>
            <IconBox icon={icon} variant={resolvedIconVariant} />

            <div className="flex-1 text-left">
                <div className={textClass}>{label}</div>
                {description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>}
            </div>

            {rightElement}

            {!rightElement && showChevron && (
                <span className={`material-symbols-rounded text-gray-400 ${isDanger ? 'text-red-300' : ''}`}>
                    chevron_right
                </span>
            )}
        </div>
    );
};
