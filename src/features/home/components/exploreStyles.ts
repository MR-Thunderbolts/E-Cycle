import type React from 'react';

export const rowStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'border-color var(--dur-fast), transform var(--dur-instant)',
    font: 'inherit',
    color: 'inherit',
};

export const dotStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 9999,
    background: 'var(--brand-tint)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'var(--brand-fg)',
};

export const sectionLabel: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    color: 'var(--text-muted)',
};
