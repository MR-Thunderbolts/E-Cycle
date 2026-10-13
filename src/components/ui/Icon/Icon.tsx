import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Material Symbols Rounded glyph name. */
    name: string;
    /** Size in px (number) or any CSS length. */
    size?: number | string;
    filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, size, filled = false, className = '', style, ...rest }) => (
    <span
        className={['material-symbols-rounded', filled ? 'filled-icon' : '', className].filter(Boolean).join(' ')}
        style={size ? { fontSize: typeof size === 'number' ? `${size}px` : size, ...style } : style}
        aria-hidden="true"
        {...rest}
    >
        {name}
    </span>
);
