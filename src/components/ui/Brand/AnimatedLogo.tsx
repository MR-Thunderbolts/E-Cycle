import React, { useEffect, useRef } from 'react';
import isotipoSvg from '@/assets/brand/isotipo.svg?raw';
import logotipoSvg from '@/assets/brand/logotipo.svg?raw';

/*
 * Animated stacked logo (splash). Prototype «Armado de la C», v8: icon first, spiral «Vuelta cerrada».
 * 1. The two pixels fall in a spiral toward the C (small one first), small like the end of a tail,
 *    and turn solid as they land.
 * 2. A snake picks up at that same speed and draws the real outline of the C, cell by cell of a
 *    10 × 10 grid, following its curve; it slows down into the tail without stopping dead.
 * 3. Icon and pixels fill with a fade; the outline takes the fill colour.
 * 4. The icon rises to its place while «e-cycle» comes out downward from behind it (outline first,
 *    then fill), and the tagline comes out from under the name with the same movement.
 * Everything is in the icon's own units (49.5 × 47.9); colours follow the logo/* variables.
 */

const NS = 'http://www.w3.org/2000/svg';
const ISO_W = 49.5057;
const ISO_H = 47.8554;
const WORD_W = 143.068;
const WORD_H = 40.1985;
const CELL = 4.95057;
const COLS = 10;
const ROWS = 10;
const SLICES = 22;

const pathsOf = (raw: string) => [...raw.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
const [ISO_BODY, ...ISO_DOTS] = pathsOf(isotipoSvg);
const WORD_PATHS = pathsOf(logotipoSvg);
/** Centres of the big and the small pixel (bounding boxes of their paths). */
const DOT_C: [number, number][] = [
    [38.3669, 6.1882],
    [47.443, 11.1388],
];

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
};
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ── Guide line through the middle of the stroke: top bar (right to left), stem, bottom bar, tail.
const ROUTE: [number, number][] = [
    [31, 5], [24, 4.6], [15, 4.8], [9, 8], [5.2, 14], [4.8, 22], [6.5, 30], [11, 37],
    [17, 41.2], [24, 42.6], [31, 41.6], [37, 38], [42, 33], [45.2, 27], [46.5, 22],
];
const SAMPLES: [number, number][] = (() => {
    const out: [number, number][] = [];
    const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
        0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
    for (let i = 0; i < ROUTE.length - 1; i++) {
        const p0 = ROUTE[Math.max(0, i - 1)], p1 = ROUTE[i], p2 = ROUTE[i + 1], p3 = ROUTE[Math.min(ROUTE.length - 1, i + 2)];
        for (let q = 0; q < 40; q++) out.push([cr(p0[0], p1[0], p2[0], p3[0], q / 40), cr(p0[1], p1[1], p2[1], p3[1], q / 40)]);
    }
    out.push(ROUTE[ROUTE.length - 1]);
    return out;
})();
const ROUTE_LEN = SAMPLES.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - SAMPLES[i - 1][0], p[1] - SAMPLES[i - 1][1]) : 0), 0);

// ── Motion: «Vuelta cerrada», one turn and a quarter close to the icon, like a whirl.
const ORBIT = { turns: 1.25, extra: 8, power: 1.8, trail: 6, gap: 0.03, grow: 0.45 };
const ARRIVE: [number, number][] = [
    [0, 0.8],
    [0.12, 0.92],
];
const SNAKE_A = 0.3;
const EASE_K = 2.4;
const spiralPos = (c: [number, number], u: number): [number, number] => {
    const cx = 24.75, cy = 24.5;
    const a1 = Math.atan2(c[1] - cy, c[0] - cx), r1 = Math.hypot(c[0] - cx, c[1] - cy);
    const e = Math.pow(clamp(u, 0, 1), ORBIT.power);
    const a = a1 + (1 - e) * Math.PI * 2 * ORBIT.turns; // counter-clockwise on screen, like the C
    const r = r1 + (1 - e) * ORBIT.extra;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
};
const LAND_V = (() => {
    const h = 0.002, span = ARRIVE[1][1] - ARRIVE[1][0];
    const p1 = spiralPos(DOT_C[0], 1), p0 = spiralPos(DOT_C[0], 1 - h);
    return Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / (h * span);
})();
const B0 = ARRIVE[1][1];
/** The snake starts at the landing speed of the pixels. */
const SNAKE_D = clamp((ROUTE_LEN * (SNAKE_A + (1 - SNAKE_A) * EASE_K)) / LAND_V, 0.7, 1.6);
const ICON_END = B0 + SNAKE_D;
const snakeP = (t: number) => {
    const x = clamp((t - B0) / SNAKE_D, 0, 1);
    return SNAKE_A * x + (1 - SNAKE_A) * (1 - Math.pow(1 - x, EASE_K));
};
const E = ICON_END;
const PLAN = {
    fill: [E - 0.12, E + 0.23],
    move: [E + 0.1, E + 0.8],
    wordFill: [E + 0.85, E + 1.35],
    tag: [E + 0.7, E + 1.4],
    tagColor: [E + 1.1, E + 1.5],
};
/** Seconds until the logo is fully built. */
export const LOGO_INTRO_S = E + 1.5;
/** How long the splash stays: the build plus a short beat to read it. */
export const LOGO_SPLASH_MS = Math.round(LOGO_INTRO_S * 1000) + 600;

// ── Grid cells that touch the symbol, in the order the snake reveals them.
interface Cell { c: number; r: number; x: number; y: number; hits: number; mx: number; my: number; step: number }
let CELLS: Cell[] | null = null;
let STEPS = 0;
const cellsOf = (): Cell[] => {
    if (CELLS) return CELLS;
    const ctx = document.createElement('canvas').getContext('2d')!;
    const shape = new Path2D(ISO_BODY);
    const cells: (Cell & { slice: number; side: number })[] = [];
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            let hits = 0, mx = 0, my = 0;
            for (let a = 0; a < 5; a++)
                for (let b = 0; b < 5; b++) {
                    const px = (c + (a + 0.5) / 5) * CELL, py = (r + (b + 0.5) / 5) * CELL;
                    if (ctx.isPointInPath(shape, px, py)) {
                        hits++;
                        mx += px;
                        my += py;
                    }
                }
            if (hits) cells.push({ c, r, x: c * CELL, y: r * CELL, hits, mx: mx / hits, my: my / hits, step: 0, slice: 0, side: 0 });
        }
    for (const k of cells) {
        let bi = 0, bd = Infinity;
        SAMPLES.forEach((sp, qi) => {
            const d = Math.hypot(sp[0] - k.mx, sp[1] - k.my);
            if (d < bd) {
                bd = d;
                bi = qi;
            }
        });
        const a = SAMPLES[Math.max(0, bi - 1)], b = SAMPLES[Math.min(SAMPLES.length - 1, bi + 1)];
        k.side = (b[0] - a[0]) * (k.my - SAMPLES[bi][1]) - (b[1] - a[1]) * (k.mx - SAMPLES[bi][0]);
        k.slice = Math.floor((bi / (SAMPLES.length - 1)) * SLICES);
    }
    const order = cells.map((_, i) => i).sort((p, q) => cells[p].slice - cells[q].slice || cells[p].side - cells[q].side);
    const sliceIds: number[] = [];
    order.forEach((i) => !sliceIds.includes(cells[i].slice) && sliceIds.push(cells[i].slice));
    for (const k of cells) k.step = sliceIds.indexOf(k.slice);
    // Rounded edge pieces light up with the full cell they lean on, so every step adds whole blocks.
    const at = new Map(cells.map((k) => [`${k.c},${k.r}`, k]));
    const full = (k?: Cell) => !!k && k.hits === 25;
    for (const k of cells) {
        if (full(k)) continue;
        let best: Cell | null = null, bd = Infinity;
        for (let dc = -1; dc <= 1; dc++)
            for (let dr = -1; dr <= 1; dr++) {
                const nb = at.get(`${k.c + dc},${k.r + dr}`);
                if (!nb || !full(nb)) continue;
                const d = Math.hypot(nb.x + CELL / 2 - k.mx, nb.y + CELL / 2 - k.my) + (dc && dr ? 1.5 : 0);
                if (d < bd) {
                    bd = d;
                    best = nb;
                }
            }
        if (best) k.step = best.step;
    }
    const used = [...new Set(cells.map((k) => k.step))].sort((p, q) => p - q);
    for (const k of cells) k.step = used.indexOf(k.step);
    STEPS = used.length;
    CELLS = cells;
    return cells;
};
const padD = (k: Cell) => {
    const p = 0.6, s = CELL + 2 * p;
    return `M${k.x - p} ${k.y - p}h${s}v${s}h${-s}z`;
};

const el = <K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>, parent?: Element) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, String(attrs[k]));
    parent?.appendChild(n);
    return n;
};

export interface AnimatedLogoProps {
    /** Icon height in px. */
    iconHeight?: number;
    /** «e-cycle» height in px. */
    wordHeight?: number;
    /** Space between the icon and the name, and between the name and the tagline, in px. */
    gap?: number;
    tagline?: string;
    taglineClassName?: string;
}

/** Stacked logo that builds itself: icon, then the name and the tagline coming out downward. */
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
    iconHeight = 84,
    wordHeight = 36,
    gap = 20,
    tagline,
    taglineClassName,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const tagRef = useRef<HTMLParagraphElement>(null);
    const tagLine = 21; // px, one line of the tagline
    const FEATHER = 8; // px, soft top edge the tagline comes out of

    const k = iconHeight / ISO_H; // px per icon unit
    const ws = wordHeight / WORD_H / k; // the name's scale in icon units
    const wordW = WORD_W * ws, wordH = WORD_H * ws;
    const wordX = ISO_W / 2 - wordW / 2;
    const wordY = ISO_H + gap / k;
    const x0 = Math.min(0, wordX), w = Math.max(ISO_W, wordX + wordW) - x0, h = wordY + wordH;
    // While it builds, the icon sits at the centre of the whole stack (logo + tagline), then rises.
    const stackH = h + (tagline ? (gap + tagLine) / k : 0);
    const SHIFT = (stackH - ISO_H) / 2;

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const cells = cellsOf();
        const id = `alogo${Math.random().toString(36).slice(2, 7)}`;

        const defs = el('defs', {}, svg);
        el('path', { d: ISO_BODY }, el('clipPath', { id: `${id}s` }, defs));
        const drawnPath = el('path', { d: '' }, el('clipPath', { id: `${id}d` }, defs));
        const glow = el('filter', { id: `${id}g`, x: '-10%', y: '-30%', width: '120%', height: '160%' }, defs);
        el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 0.6, result: 'b' }, glow);
        const mg = el('feMerge', {}, glow);
        el('feMergeNode', { in: 'b' }, mg);
        el('feMergeNode', { in: 'SourceGraphic' }, mg);

        // Icon
        const icon = el('g', {}, svg);
        const iconFill = el('path', { class: 'sym', d: ISO_BODY, opacity: 0 }, icon);
        const headG = el('g', { 'clip-path': `url(#${id}s)` }, icon);
        const heads = cells.map((c) =>
            el('rect', { class: 'pix', x: c.x - 0.02, y: c.y - 0.02, width: CELL + 0.04, height: CELL + 0.04, visibility: 'hidden' }, headG),
        );
        const outlineG = el('g', { 'clip-path': `url(#${id}d)`, visibility: 'hidden' }, icon);
        const outlinePix = el('path', { class: 'trace t-pix', d: ISO_BODY, filter: `url(#${id}g)` }, outlineG);
        const outlineSym = el('path', { class: 'trace t-sym', d: ISO_BODY, opacity: 0 }, outlineG);
        const dots = ISO_DOTS.map((d) => {
            const trail = Array.from({ length: ORBIT.trail }, () =>
                el('path', { class: 'trace t-pix', d, visibility: 'hidden', 'vector-effect': 'non-scaling-stroke' }, icon),
            );
            const g = el('g', { visibility: 'hidden' }, icon);
            return {
                g,
                trail,
                fill: el('path', { class: 'pix', d, opacity: 0 }, g),
                line: el('path', { class: 'trace t-pix', d, filter: `url(#${id}g)`, 'vector-effect': 'non-scaling-stroke' }, g),
            };
        });
        const spiral = (c: [number, number], u: number) => {
            const p = spiralPos(c, u), q = CELL / 4; // pixel steps
            return [Math.round((p[0] - c[0]) / q) * q, Math.round((p[1] - c[1]) / q) * q];
        };
        const at = (c: [number, number], o: number[], s: number) =>
            `translate(${c[0] + o[0]} ${c[1] + o[1]}) scale(${s.toFixed(3)}) translate(${-c[0]} ${-c[1]})`;

        // Name: comes out downward over a soft edge just inside the bottom of the C, so no line shows.
        const grad = el('linearGradient', { id: `${id}eg`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: 6 }, defs);
        el('stop', { offset: 0, 'stop-color': '#000' }, grad);
        el('stop', { offset: 1, 'stop-color': '#fff' }, grad);
        const mask = el('mask', { id: `${id}e`, maskUnits: 'userSpaceOnUse', x: -100, y: -100, width: 300, height: 300 }, defs);
        el('rect', { x: -100, y: -100, width: 300, height: 300, fill: `url(#${id}eg)` }, mask);
        const wordOuter = el('g', { mask: `url(#${id}e)` }, svg);
        const word = el('g', {}, wordOuter);
        const fillG = el('g', { opacity: 0 }, word);
        const pixG = el('g', { filter: `url(#${id}g)`, opacity: 0 }, word);
        const symG = el('g', { opacity: 0 }, word);
        const sw = (0.5 / ws).toFixed(3);
        for (const d of WORD_PATHS) {
            el('path', { class: 'word', d }, fillG);
            el('path', { class: 'trace t-pix', d, 'stroke-width': sw }, pixG);
            el('path', { class: 'trace t-word', d, 'stroke-width': sw }, symG);
        }
        const EDGE_IN = 44; // the fade starts just inside the bottom bar of the C
        const y0 = SHIFT + EDGE_IN - wordH; // the name starts tucked behind the centred icon

        const tag = tagRef.current;
        const draw = (t: number) => {
            const f = smooth(PLAN.fill[0], PLAN.fill[1], t);
            // the two pixels: the small one first, then the big one
            [1, 0].forEach((di, n) => {
                const p = dots[di], c = DOT_C[di], A = ARRIVE[n], span = A[1] - A[0];
                const u = (t - A[0]) / span;
                if (u <= 0) {
                    p.g.setAttribute('visibility', 'hidden');
                    p.trail.forEach((tr) => tr.setAttribute('visibility', 'hidden'));
                    return;
                }
                const s = ORBIT.grow + (1 - ORBIT.grow) * Math.pow(Math.min(u, 1), ORBIT.power);
                p.g.setAttribute('visibility', 'visible');
                p.g.setAttribute('transform', at(c, spiral(c, Math.min(u, 1)), s));
                p.fill.setAttribute('opacity', String(f));
                p.trail.forEach((tr, j) => {
                    const uk = u - ((j + 1) * ORBIT.gap) / span;
                    if (uk >= 1 || uk <= 0) {
                        tr.setAttribute('visibility', 'hidden');
                        return;
                    }
                    const sk = (ORBIT.grow + (1 - ORBIT.grow) * Math.pow(uk, ORBIT.power)) * (1 - (j + 1) * (0.5 / ORBIT.trail));
                    tr.setAttribute('visibility', 'visible');
                    tr.setAttribute('opacity', (0.5 * (1 - j / ORBIT.trail)).toFixed(2));
                    tr.setAttribute('transform', at(c, spiral(c, uk), sk));
                });
            });
            // the snake reveals the real outline of the C inside the cells it covers
            const step = t < B0 ? -1 : Math.min(STEPS - 1, Math.floor(snakeP(t) * STEPS));
            if (step >= 0) drawnPath.setAttribute('d', cells.filter((c) => c.step <= step).map(padD).join(''));
            outlineG.setAttribute('visibility', step >= 0 ? 'visible' : 'hidden');
            cells.forEach((c, i) => {
                const show = step >= 0 && t < ICON_END && (c.step === step || c.step === step - 1);
                heads[i].setAttribute('visibility', show ? 'visible' : 'hidden');
                if (show) heads[i].setAttribute('opacity', c.step === step ? '0.4' : '0.15');
            });
            iconFill.setAttribute('opacity', String(f));
            outlinePix.setAttribute('opacity', String(1 - f));
            outlineSym.setAttribute('opacity', String(f));
            // the icon rises while the name comes out downward from behind it
            const mv = easeInOut(clamp((t - PLAN.move[0]) / (PLAN.move[1] - PLAN.move[0]), 0, 1));
            const shift = SHIFT * (1 - mv);
            icon.setAttribute('transform', `translate(0 ${shift.toFixed(3)})`);
            const y = y0 + (wordY - y0) * mv;
            word.setAttribute('transform', `translate(${wordX.toFixed(3)} ${y.toFixed(3)}) scale(${ws.toFixed(4)})`);
            const edge = shift + EDGE_IN;
            grad.setAttribute('y1', edge.toFixed(3));
            grad.setAttribute('y2', (edge + 6).toFixed(3));
            const q = smooth(PLAN.wordFill[0], PLAN.wordFill[1], t);
            const out = t > PLAN.move[0];
            pixG.setAttribute('opacity', String(out ? 1 - q : 0));
            symG.setAttribute('opacity', String(out ? q : 0));
            fillG.setAttribute('opacity', String(q));
            // the tagline comes out from under the name with the same movement
            if (tag) {
                const m = easeInOut(clamp((t - PLAN.tag[0]) / (PLAN.tag[1] - PLAN.tag[0]), 0, 1));
                const c = smooth(PLAN.tagColor[0], PLAN.tagColor[1], t);
                tag.style.transform = `translateY(calc(${((m - 1) * 100).toFixed(2)}% - ${((1 - m) * FEATHER).toFixed(2)}px))`;
                tag.style.color = `color-mix(in oklch, var(--logo-pixel) ${((1 - c) * 100).toFixed(1)}%, var(--ec-gray-500))`;
            }
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            draw(LOGO_INTRO_S);
            return;
        }
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = (now - start) / 1000;
            draw(Math.min(t, LOGO_INTRO_S));
            if (t < LOGO_INTRO_S) raf = requestAnimationFrame(tick);
        };
        draw(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [SHIFT, wordH, wordX, wordY, ws]);

    return (
        <div role="img" aria-label={tagline ? `E-Cycle. ${tagline}` : 'E-Cycle'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg
                ref={svgRef}
                className="ec-alogo"
                aria-hidden="true"
                viewBox={`${x0} 0 ${w} ${h}`}
                width={w * k}
                height={h * k}
                style={{ overflow: 'visible', display: 'block' }}
            />
            {tagline && (
                <div
                    aria-hidden="true"
                    style={{
                        marginTop: gap - FEATHER,
                        paddingTop: FEATHER,
                        overflow: 'hidden',
                        WebkitMaskImage: `linear-gradient(to bottom, transparent 0, #000 ${FEATHER}px)`,
                        maskImage: `linear-gradient(to bottom, transparent 0, #000 ${FEATHER}px)`,
                    }}
                >
                    <p ref={tagRef} className={taglineClassName} style={{ lineHeight: `${tagLine}px`, transform: `translateY(calc(-100% - ${FEATHER}px))` }}>
                        {tagline}
                    </p>
                </div>
            )}
        </div>
    );
};
