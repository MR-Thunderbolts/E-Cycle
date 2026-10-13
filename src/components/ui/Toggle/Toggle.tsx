import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: () => void;
    label?: string; // Screen reader label
    className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, className = '' }) => (
    <label className={['ec-toggle', className].filter(Boolean).join(' ')}>
        <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
        <span className="ec-toggle__track" />
    </label>
);
