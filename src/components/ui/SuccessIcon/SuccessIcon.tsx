import React from 'react';
import { Icon } from '../Icon';

export interface SuccessIconProps {
    icon?: string;
    /** CSS color of the glyph; the disc is a tint of it. */
    color?: string;
    size?: number;
}

/** Success glyph that bounces in: scale .4 → 1 and fade, ease-out-back, 0.5 s after a 0.15 s delay. */
export const SuccessIcon: React.FC<SuccessIconProps> = ({ icon = 'check', color = 'var(--ec-points)', size = 72 }) => (
    <div
        className="ec-success"
        aria-hidden="true"
        style={{ width: size, height: size, color, background: `color-mix(in oklch, ${color} 18%, transparent)` }}
    >
        <Icon name={icon} filled size={Math.round(size * 0.55)} />
    </div>
);
