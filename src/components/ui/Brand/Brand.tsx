import React from 'react';
import isotipoSvg from '@/assets/brand/isotipo.svg?raw';
import logotipoSvg from '@/assets/brand/logotipo.svg?raw';

// Marca aprobada «Ciclo fluido» (Figma · Lámina E-Cycle, nodo 158:7899). The SVG files are the
// exported originals; only their fills are swapped for the logo/* variables so the mark follows
// light and dark mode, and the size is scaled with the aspect ratio kept.
const ISO = { w: 49.5057, h: 47.8554, src: isotipoSvg };
const WORD = { w: 143.068, h: 40.1985, src: logotipoSvg };
/** Horizontal lockup: 200 × 48, wordmark 56.93 px right of and 3.83 px below the symbol's origin. */
const LOCKUP = { w: 200, h: 48, wordX: 56.93, wordY: 3.83 };

const themed = (raw: string, w: number, h: number) =>
    raw
        .replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`)
        .replaceAll('fill="#004D40"', 'style="fill:var(--logo-symbol)"')
        .replaceAll('fill="#19B99A"', 'style="fill:var(--logo-pixel)"')
        .replaceAll('fill="#092E28"', 'style="fill:var(--logo-wordmark)"');

interface PieceProps {
    /** Rendered height in px; the width follows the artwork's proportions. */
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    /** Inside another labelled element (the lockup): hidden from screen readers. */
    decorative?: boolean;
}

const piece =
    (art: { w: number; h: number; src: string }, defaultHeight: number, name: string): React.FC<PieceProps> =>
    ({ height = defaultHeight, className, style, decorative }) => {
        const w = (art.w * height) / art.h;
        return (
            <span
                role={decorative ? undefined : 'img'}
                aria-label={decorative ? undefined : name}
                aria-hidden={decorative || undefined}
                className={className}
                style={{ display: 'inline-flex', lineHeight: 0, ...style }}
                dangerouslySetInnerHTML={{ __html: themed(art.src, w, height) }}
            />
        );
    };

/** Isotipo: symbol + 2 pixels. */
export const Isotipo = piece(ISO, 48, 'E-Cycle');
/** Logotipo: «e-cycle» lettering. */
export const Logotipo = piece(WORD, 40, 'E-Cycle');

/** Horizontal lockup (isotipo + logotipo). `height` is the lockup's height; 48 matches the artwork. */
export const LogoHorizontal: React.FC<PieceProps> = ({ height = LOCKUP.h, className, style }) => {
    const k = height / LOCKUP.h;
    return (
        <span
            role="img"
            aria-label="E-Cycle"
            className={className}
            style={{ position: 'relative', display: 'inline-block', width: LOCKUP.w * k, height, flexShrink: 0, ...style }}
        >
            <Isotipo decorative height={ISO.h * k} style={{ position: 'absolute', left: 0, top: 0 }} />
            <Logotipo decorative height={WORD.h * k} style={{ position: 'absolute', left: LOCKUP.wordX * k, top: LOCKUP.wordY * k }} />
        </span>
    );
};
