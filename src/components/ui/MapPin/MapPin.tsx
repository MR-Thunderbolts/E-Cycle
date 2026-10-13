import React from 'react';
import { Icon } from '../Icon';

export interface MapPinProps {
    label: string;
    selected?: boolean;
    dimmed?: boolean;
    onClick?: () => void;
}

export const MapPin: React.FC<MapPinProps> = ({ label, selected = false, dimmed = false, onClick }) => (
    <button
        type="button"
        aria-label={label}
        aria-pressed={selected}
        className={['ec-pin', selected ? 'ec-pin--selected' : '', dimmed ? 'ec-pin--dimmed' : ''].filter(Boolean).join(' ')}
        onClick={onClick}
    >
        <Icon name="location_on" filled />
    </button>
);
