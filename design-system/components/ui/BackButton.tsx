import React from 'react';

interface BackButtonProps {
    onClick: () => void;
    variant?: 'default' | 'overlay';
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
    onClick,
    variant = 'default',
    className = ''
}) => {
    const baseStyles = "p-2 rounded-full transition-colors flex items-center justify-center";

    const variantStyles = {
        default: "text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10",
        overlay: "bg-white/20 backdrop-blur-md text-text dark:text-white hover:bg-white/30"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            aria-label="Volver"
        >
            <span className="material-symbols-rounded text-2xl">arrow_back</span>
        </button>
    );
};
