import type React from 'react';

/** Shared layout for the scrolling screens (Retiro, Escanear, Beneficios). */
export const screen = {
    /** Scroll container; the bottom padding clears the 100 px nav bar. */
    wrap: { position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 20px 132px' } as React.CSSProperties,
    h1: { fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: 0 } as React.CSSProperties,
    p: { fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 } as React.CSSProperties,
    card: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 24,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    } as React.CSSProperties,
    label: {
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.1em',
        color: 'var(--text-muted)',
    } as React.CSSProperties,
    /** Tinted round icon holder. */
    ico: (color: string, size = 44): React.CSSProperties => ({
        width: size,
        height: size,
        borderRadius: 9999,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `color-mix(in oklch, ${color} 14%, transparent)`,
        color,
    }),
};
