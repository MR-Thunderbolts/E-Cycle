import React from 'react';
import { Icon } from '../Icon';

const btn: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 9999,
    border: '1px solid var(--border-strong)',
    background: 'transparent',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
};

export interface CounterProps {
    value: number;
    onChange: (value: number) => void;
    /** Names the item for screen readers: «Quitar Celulares», «Agregar Celulares». */
    label?: string;
}

/** − / number / + */
export const Counter: React.FC<CounterProps> = ({ value, onChange, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
            type="button"
            aria-label={label ? `Quitar ${label}` : 'Quitar uno'}
            disabled={!value}
            onClick={() => onChange(value - 1)}
            style={{ ...btn, opacity: value ? 1 : 0.4 }}
        >
            <Icon name="remove" size={20} />
        </button>
        <span aria-live="polite" style={{ minWidth: 20, textAlign: 'center', fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            {value}
        </span>
        <button
            type="button"
            aria-label={label ? `Agregar ${label}` : 'Agregar uno'}
            onClick={() => onChange(value + 1)}
            style={{ ...btn, background: 'var(--brand-solid)', borderColor: 'var(--brand-solid)', color: 'var(--brand-on-solid)' }}
        >
            <Icon name="add" size={20} />
        </button>
    </div>
);
