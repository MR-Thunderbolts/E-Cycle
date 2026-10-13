import React, { useCallback, useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import type { CleanPoint, MapPosition } from '@/types';
import { IconButton, LocationDot, MapPin, Skeleton } from '@/components/ui';
import { DUR, EASE } from '@/constants/motion';
import mapBg from '@/assets/map-bg.jpg';
import mapBgLight from '@/assets/map-bg-light.jpg';

interface InteractiveMapProps {
    points: CleanPoint[];
    userPos: MapPosition;
    selected: CleanPoint | null;
    onSelect: (point: CleanPoint) => void;
    dark: boolean;
    loading?: boolean;
    /** Re-centres on this position when it changes (e.g. the centroid of a search). */
    focus?: MapPosition | null;
    /** Distance of the zoom controls from the bottom edge. */
    controlsBottom?: number;
    hideControls?: boolean;
    children?: React.ReactNode;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.2;
const START_ZOOM = 1.6;
const STEP = 1.35;
const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
const glide = { duration: DUR.slow, ease: EASE.standard };

const panelStyle: React.CSSProperties = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 9999,
};

/**
 * Drag to pan, + / − (or pinch / wheel) to zoom between 1 and 3.2, «mi ubicación» to re-centre.
 * Pins and the «Tú» dot keep their size at any zoom; choosing a point centres on it and draws
 * a dashed line from the user.
 */
const InteractiveMap: React.FC<InteractiveMapProps> = ({
    points,
    userPos,
    selected,
    onSelect,
    dark,
    loading,
    focus,
    controlsBottom = 40,
    hideControls,
    children,
}) => {
    const box = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const z = useMotionValue(START_ZOOM);
    const inverse = useTransform(z, (v) => 1 / v);

    const pointers = useRef(new Map<number, { x: number; y: number }>());
    const gesture = useRef<{ x: number; y: number; px: number; py: number; dist: number; z: number } | null>(null);

    const stop = () => [x, y, z].forEach((v) => v.stop());

    /** Places a map position (in %) at the horizontal centre, 42% from the top. */
    const center = useCallback(
        (pos: MapPosition, instant = false) => {
            const el = box.current;
            if (!el) return;
            const w = el.clientWidth;
            const h = el.clientHeight;
            const zz = z.get();
            const tx = w / 2 - (pos.x / 100) * w * zz;
            const ty = h * 0.42 - (pos.y / 100) * h * zz;
            if (instant) {
                x.set(tx);
                y.set(ty);
            } else {
                animate(x, tx, glide);
                animate(y, ty, glide);
            }
        },
        [x, y, z],
    );

    /** Zooms by `factor` keeping the screen point (cx, cy) fixed. */
    const zoomAt = useCallback(
        (factor: number, cx: number, cy: number, animated: boolean, from = { x: x.get(), y: y.get(), z: z.get() }) => {
            const nz = clampZoom(from.z * factor);
            const k = nz / from.z;
            const nx = cx - (cx - from.x) * k;
            const ny = cy - (cy - from.y) * k;
            if (animated) {
                animate(z, nz, glide);
                animate(x, nx, glide);
                animate(y, ny, glide);
            } else {
                z.set(nz);
                x.set(nx);
                y.set(ny);
            }
        },
        [x, y, z],
    );

    const zoomButton = (factor: number) => {
        const el = box.current;
        if (el) zoomAt(factor, el.clientWidth / 2, el.clientHeight / 2, true);
    };

    useEffect(() => {
        center(userPos, true);
    }, []);

    useEffect(() => {
        if (selected) center(selected);
    }, [selected, center]);

    useEffect(() => {
        if (focus) center(focus);
    }, [focus, center]);

    // Wheel zoom (desktop). Non-passive so the page itself does not scroll.
    useEffect(() => {
        const el = box.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            stop();
            const r = el.getBoundingClientRect();
            zoomAt(e.deltaY > 0 ? 1 / 1.1 : 1.1, e.clientX - r.left, e.clientY - r.top, false);
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [zoomAt]);

    const startGesture = () => {
        const list = [...pointers.current.values()];
        const r = box.current!.getBoundingClientRect();
        const mid = list.length === 2
            ? { x: (list[0].x + list[1].x) / 2, y: (list[0].y + list[1].y) / 2 }
            : list[0];
        gesture.current = {
            x: x.get(),
            y: y.get(),
            z: z.get(),
            px: mid.x - r.left,
            py: mid.y - r.top,
            dist: list.length === 2 ? Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y) : 0,
        };
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        stop();
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        e.currentTarget.setPointerCapture(e.pointerId);
        startGesture();
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const g = gesture.current;
        if (!g || !pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const list = [...pointers.current.values()];
        const r = box.current!.getBoundingClientRect();
        if (list.length === 2) {
            const dist = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
            const mx = (list[0].x + list[1].x) / 2 - r.left;
            const my = (list[0].y + list[1].y) / 2 - r.top;
            zoomAt(dist / g.dist, g.px, g.py, false, { x: g.x + (mx - g.px), y: g.y + (my - g.py), z: g.z });
        } else {
            x.set(g.x + (e.clientX - r.left - g.px));
            y.set(g.y + (e.clientY - r.top - g.py));
        }
    };

    const onPointerUp = (e: React.PointerEvent) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size) startGesture();
        else gesture.current = null;
    };

    return (
        <div
            ref={box}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            // Focusing an off-screen pin would scroll this overflow:hidden box and shift the whole map.
            onScroll={(e) => {
                e.currentTarget.scrollLeft = 0;
                e.currentTarget.scrollTop = 0;
            }}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                touchAction: 'none',
                cursor: 'grab',
                background: dark ? 'var(--ec-dark-bg)' : 'var(--ec-map-canvas)',
            }}
        >
            <motion.div
                style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', x, y, scale: z, originX: 0, originY: 0 }}
            >
                <img
                    src={dark ? mapBg : mapBgLight}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    style={{ position: 'absolute', left: '-50%', top: '-50%', width: '200%', height: '200%', maxWidth: 'none', objectFit: 'cover', pointerEvents: 'none', opacity: 0.9 }}
                />
                {selected && (
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
                    >
                        <line
                            x1={userPos.x}
                            y1={userPos.y}
                            x2={selected.x}
                            y2={selected.y}
                            vectorEffect="non-scaling-stroke"
                            style={{ stroke: 'var(--brand-fg)', strokeWidth: 2, strokeDasharray: '6 6' }}
                        />
                    </svg>
                )}
                <motion.div
                    style={{ position: 'absolute', left: `${userPos.x}%`, top: `${userPos.y}%`, x: '-50%', y: '-50%', scale: inverse }}
                >
                    <LocationDot />
                </motion.div>
                {points.map((p) => {
                    const isSel = selected?.id === p.id;
                    return (
                        <motion.div
                            key={p.id}
                            style={{
                                position: 'absolute',
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                x: '-50%',
                                y: '-100%',
                                scale: inverse,
                                originX: 0.5,
                                originY: 1,
                                zIndex: isSel ? 2 : 1,
                            }}
                        >
                            <MapPin label={p.name} selected={isSel} dimmed={!!selected && !isSel} onClick={() => onSelect(p)} />
                        </motion.div>
                    );
                })}
            </motion.div>
            {loading && <Skeleton style={{ position: 'absolute', inset: 0, opacity: 0.5, zIndex: 2, borderRadius: 0 }} />}
            {children}
            <div
                style={{
                    position: 'absolute',
                    right: 16,
                    bottom: controlsBottom,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    zIndex: 3,
                    opacity: hideControls ? 0 : 1,
                    pointerEvents: hideControls ? 'none' : 'auto',
                    transition: 'bottom var(--dur-slow) var(--ease-standard), opacity var(--dur-base)',
                }}
                aria-hidden={hideControls}
            >
                <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column' }}>
                    <IconButton icon="add" variant="ghost" ariaLabel="Acercar" onClick={() => zoomButton(STEP)} />
                    <IconButton icon="remove" variant="ghost" ariaLabel="Alejar" onClick={() => zoomButton(1 / STEP)} />
                </div>
                <div style={panelStyle}>
                    <IconButton icon="my_location" variant="ghost" ariaLabel="Centrar en mi ubicación" onClick={() => center(userPos)} />
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
