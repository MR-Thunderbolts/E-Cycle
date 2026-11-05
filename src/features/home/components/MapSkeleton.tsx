import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui';
import { DUR } from '@/constants/motion';

/** Pin-shaped placeholders: [left %, top %]. */
const PINS: [number, number][] = [
    [26, 34],
    [64, 28],
    [72, 56],
    [38, 66],
];

/** Placeholder for the map while it loads: shimmering «streets», pin blobs and the controls. */
export const MapSkeleton: React.FC<{ controlsBottom: number }> = ({ controlsBottom }) => (
    <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.slow }}
        style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'var(--surface-page)', overflow: 'hidden' }}
    >
        <Skeleton style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.55 }} />
        {/* Faux street grid. */}
        {[22, 48, 74].map((t) => (
            <div key={`h${t}`} style={{ position: 'absolute', left: 0, right: 0, top: `${t}%`, height: 14, background: 'var(--surface-page)', opacity: 0.7 }} />
        ))}
        {[18, 52, 82].map((l) => (
            <div key={`v${l}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${l}%`, width: 14, background: 'var(--surface-page)', opacity: 0.7 }} />
        ))}
        {PINS.map(([l, t], i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    left: `${l}%`,
                    top: `${t}%`,
                    width: 28,
                    height: 28,
                    transform: 'translate(-50%,-100%)',
                    borderRadius: '50% 50% 50% 0',
                    rotate: '-45deg',
                    background: 'var(--border-strong)',
                    animation: `ec-map-sk 1.6s ease-in-out ${i * 0.15}s infinite`,
                }}
            />
        ))}
        {/* User dot. */}
        <div
            style={{
                position: 'absolute',
                left: '50%',
                top: '42%',
                width: 18,
                height: 18,
                transform: 'translate(-50%,-50%)',
                borderRadius: 9999,
                background: 'var(--border-strong)',
                animation: 'ec-map-sk 1.6s ease-in-out infinite',
            }}
        />
        {/* Search bar and zoom controls. */}
        <Skeleton style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 56, borderRadius: 9999 }} />
        <Skeleton style={{ position: 'absolute', right: 16, bottom: controlsBottom + 56, width: 44, height: 96, borderRadius: 9999 }} />
        <Skeleton style={{ position: 'absolute', right: 16, bottom: controlsBottom, width: 44, height: 44, borderRadius: 9999 }} />
    </motion.div>
);
