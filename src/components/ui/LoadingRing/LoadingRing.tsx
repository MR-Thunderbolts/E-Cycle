import React from 'react';

export interface LoadingRingProps {
    /** Diameter in px: 112 on the big loading screens, 24 on the step that is running. */
    size?: number;
    /** Accessible name; leave empty when the surrounding text already says it. */
    label?: string;
}

/** Arc of ~126° turning once every 0.8 s over a faint track. */
export const LoadingRing: React.FC<LoadingRingProps> = ({ size = 112, label }) => {
    const stroke = size >= 64 ? 4 : 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
        <svg
            className="ec-ring"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
        >
            <circle className="ec-ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} />
            {/* The arc keeps turning with «reducir movimiento»: it is the only sign that something is happening. */}
            <circle
                className="ec-ring__arc ec-keep-motion"
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${(c * 126) / 360} ${c}`}
            />
        </svg>
    );
};
