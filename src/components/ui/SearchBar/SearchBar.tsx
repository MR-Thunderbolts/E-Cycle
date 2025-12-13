import React from 'react';
import { IconButton } from '../IconButton';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onClear?: () => void;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    onClear,
    className = '',
}) => {
    const handleClear = () => {
        onChange('');
        onClear?.();
    };

    return (
        <div className={`bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-dark-border px-4 py-3 flex items-center gap-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all ${className}`}>
            <span className="material-symbols-rounded text-gray-400">search</span>
            <input
                type="text"
                placeholder={placeholder}
                className="flex-1 outline-none text-sm text-text dark:text-dark-text placeholder:text-gray-400 bg-transparent"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <IconButton
                    icon="close"
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                    ariaLabel="Clear search"
                />
            )}
        </div>
    );
};
