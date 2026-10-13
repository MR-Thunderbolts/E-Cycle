import React from 'react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onClear?: () => void;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Buscar...', onClear, className = '' }) => (
    <div className={['ec-searchbar', className].filter(Boolean).join(' ')}>
        <Icon name="search" className="ec-searchbar__icon" />
        <input
            type="text"
            placeholder={placeholder}
            aria-label={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        {value && (
            <IconButton
                icon="close"
                size="sm"
                variant="ghost"
                ariaLabel="Limpiar búsqueda"
                onClick={() => {
                    onChange('');
                    onClear?.();
                }}
            />
        )}
    </div>
);
