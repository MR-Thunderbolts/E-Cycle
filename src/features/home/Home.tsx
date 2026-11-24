import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import type { CleanPoint, Merchant } from '@/types';
import { BottomSheet, Icon, IconButton, Skeleton } from '@/components/ui';
import { CAMPAIGN, MERCHANTS, USER_POSITION } from '@/constants/ciudadano';
import { SPRING_SHEET } from '@/constants/motion';
import { useCiudadano } from '@/hooks';
import { initials } from '@/utils/format';
import InteractiveMap, { type MapPlace } from './components/InteractiveMap';
import { SearchOverlay } from './components/SearchOverlay';
import { PointRow } from './components/PointRow';
import { PointDetail } from './components/PointDetail';
import { CampaignNotice } from './components/CampaignNotice';
import { FilterChips } from './components/FilterChips';
import { MerchantRow } from './components/MerchantRow';
import { MerchantDetail } from './components/MerchantDetail';
import { centroid, usePointFilter } from './usePointFilter';
import { useExploreFilters } from './useExploreFilters';

/** Bottom nav bar height; the collapsed list shows only its handle, title and chips above it. */
const NAV = 100;
/** Collapsed list: its top edge sits this far above the bottom of the screen (handle + title + chips). */
const PEEK = NAV + 108;
/** Expanded list stops just under the search bar. */
const FULL_TOP = 88;
/** Drag further than this to snap open or closed. */
const SNAP = 60;

export const placeOf = (p: CleanPoint): MapPlace => ({ id: p.id, name: p.name, x: p.x, y: p.y, kind: p.community === false ? 'privado' : 'punto' });
export const merchantPlace = (m: Merchant): MapPlace => ({ id: m.id, name: m.name, x: m.x, y: m.y, kind: 'beneficio' });

export const benefitsTitle = (count: number) => (count === 1 ? '1 lugar para canjear cerca' : `${count} lugares para canjear cerca`);

export const listTitle = (count: number, query: string) =>
    query
        ? `${count === 1 ? '1 punto' : `${count} puntos`} para «${query}»`
        : count === 1
          ? '1 punto cerca de ti'
          : `${count} puntos cerca de ti`;

/** Explorar (mobile): full-screen map, Google Maps-style search, draggable list. */
const Home: React.FC = () => {
    const app = useCiudadano();
    const filters = useExploreFilters();
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [selected, setSelected] = useState<CleanPoint | null>(null);
    const [shop, setShop] = useState<Merchant | null>(null);
    const [open, setOpen] = useState(false);
    const list = usePointFilter(filters.materials, query);
    const benefits = filters.benefits;
    const places = useMemo(() => (benefits ? MERCHANTS.map(merchantPlace) : list.map(placeOf)), [benefits, list]);
    const selectedPlace = benefits ? (shop ? merchantPlace(shop) : null) : selected ? placeOf(selected) : null;

    // «Ver dónde canjear en el mapa» (Beneficios) lands here with the benefits chip on.
    const { benefitsMap, clearBenefitsMap } = app;
    const { withBenefits } = filters;
    useEffect(() => {
        if (!benefitsMap) return;
        withBenefits();
        clearBenefitsMap();
    }, [benefitsMap, withBenefits, clearBenefitsMap]);

    // Leaving the benefits view drops the shop that was open.
    useEffect(() => {
        if (!benefits) setShop(null);
    }, [benefits]);
    // Re-centre only when the search changes, not when a chip filters the list.
    const focus = useMemo(() => (query ? centroid(list) : null), [query]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sheet geometry: collapsed at h − PEEK, expanded at FULL_TOP (just under the search bar).
    const root = useRef<HTMLDivElement>(null);
    const [h, setH] = useState(800);
    useLayoutEffect(() => {
        const el = root.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setH(el.clientHeight));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const minTop = FULL_TOP;
    const maxTop = h - PEEK;
    const top = useMotionValue(maxTop);
    useEffect(() => {
        animate(top, open ? minTop : maxTop, SPRING_SHEET);
    }, [open, minTop, maxTop, top]);

    const drag = useRef<{ y: number; start: number; moved: boolean } | null>(null);
    const onDown = (e: React.PointerEvent) => {
        top.stop();
        drag.current = { y: e.clientY, start: top.get(), moved: false };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d) return;
        const dy = e.clientY - d.y;
        if (Math.abs(dy) > 4) d.moved = true;
        top.set(Math.min(maxTop, Math.max(minTop, d.start + dy)));
    };
    const onUp = (e: React.PointerEvent) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const dy = e.clientY - d.y;
        const next = !d.moved ? !open : dy < -SNAP ? true : dy > SNAP ? false : open;
        if (next === open) animate(top, open ? minTop : maxTop, SPRING_SHEET);
        else setOpen(next);
    };

    // Swiping or scrolling up on the list opens the sheet; pulling down at the top closes it.
    const scroller = useRef<HTMLDivElement>(null);
    const swipe = useRef<{ x: number; y: number; done: boolean } | null>(null);
    const swipeStart = (x: number, y: number) => {
        swipe.current = { x, y, done: false };
    };
    const swipeMove = (x: number, y: number) => {
        const g = swipe.current;
        if (!g || g.done) return;
        const dy = g.y - y;
        if (Math.abs(dy) < 24 || Math.abs(dy) < Math.abs(g.x - x)) return;
        const atTop = (scroller.current?.scrollTop ?? 0) <= 0;
        if (!open && dy > 0) {
            g.done = true;
            setOpen(true);
        } else if (open && dy < 0 && atTop) {
            g.done = true;
            setOpen(false);
        }
    };
    const swipeEnd = () => {
        swipe.current = null;
    };
    const onWheel = (e: React.WheelEvent) => {
        const atTop = (scroller.current?.scrollTop ?? 0) <= 0;
        if (!open && e.deltaY > 8) setOpen(true);
        else if (open && e.deltaY < -8 && atTop) setOpen(false);
    };

    const select = (p: CleanPoint) => setSelected(p);
    const selectPlace = (id: string) => {
        if (benefits) setShop(MERCHANTS.find((m) => m.id === id) ?? null);
        else {
            const p = list.find((x) => x.id === id);
            if (p) setSelected(p);
        }
    };

    return (
        <div ref={root} style={{ position: 'absolute', inset: 0 }}>
            <InteractiveMap
                points={places}
                userPos={USER_POSITION}
                selected={selectedPlace}
                onSelect={selectPlace}
                loading={app.loading}
                focus={focus}
                controlsBottom={PEEK + 16}
                hideControls={open}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        zIndex: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        height: 56,
                        padding: '0 6px 0 18px',
                        borderRadius: 9999,
                        background: 'var(--surface-card)',
                        border: '1px solid var(--border-card)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: 0,
                            background: 'transparent',
                            cursor: 'text',
                            font: 'inherit',
                            color: 'inherit',
                            textAlign: 'left',
                            padding: 0,
                        }}
                    >
                        <Icon name="search" style={{ color: 'var(--text-muted)' }} />
                        <span
                            style={{
                                flex: 1,
                                minWidth: 0,
                                fontSize: 14,
                                color: query ? 'var(--text-body)' : 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {query || 'Buscar comuna o dirección'}
                        </span>
                    </button>
                    {query && <IconButton icon="close" variant="ghost" ariaLabel="Borrar búsqueda" onClick={() => setQuery('')} />}
                    <button
                        type="button"
                        onClick={app.openAccount}
                        aria-label="Tu cuenta"
                        style={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: 9999,
                            border: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            background: app.signedIn ? 'color-mix(in oklch, var(--brand-fg) 16%, transparent)' : 'var(--surface-inset)',
                            color: app.signedIn ? 'var(--brand-fg)' : 'var(--text-body)',
                        }}
                    >
                        {app.signedIn ? <span style={{ fontSize: 14, fontWeight: 800 }}>{initials(app.profile.name)}</span> : <Icon name="person" />}
                    </button>
                </div>
            </InteractiveMap>

            <motion.section
                aria-label="Puntos limpios"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top,
                    background: 'var(--surface-page)',
                    borderTop: '1px solid var(--border-card)',
                    borderRadius: '32px 32px 0 0',
                    boxShadow: '0 -10px 30px rgba(0,0,0,.25)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(!open))}
                    role="button"
                    tabIndex={0}
                    aria-label={open ? 'Bajar lista' : 'Ver lista completa'}
                    aria-expanded={open}
                    style={{
                        flexShrink: 0,
                        padding: '12px 20px 4px',
                        cursor: 'grab',
                        touchAction: 'none',
                        userSelect: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <div style={{ width: 40, height: 4, borderRadius: 9999, background: 'var(--border-strong)', alignSelf: 'center' }} />
                    {app.loading ? (
                        <Skeleton style={{ height: 22, width: 180, borderRadius: 8 }} />
                    ) : (
                        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{benefits ? benefitsTitle(MERCHANTS.length) : listTitle(list.length, query)}</h1>
                    )}
                </div>
                <div
                    ref={scroller}
                    className="no-scrollbar"
                    onWheel={onWheel}
                    onTouchStart={(e) => swipeStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={(e) => swipeMove(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchEnd={swipeEnd}
                    onTouchCancel={swipeEnd}
                    onPointerDown={(e) => e.pointerType === 'mouse' && swipeStart(e.clientX, e.clientY)}
                    onPointerMove={(e) => e.pointerType === 'mouse' && e.buttons === 1 && swipeMove(e.clientX, e.clientY)}
                    onPointerUp={swipeEnd}
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: open ? 'auto' : 'hidden',
                        overflowX: 'hidden',
                        overscrollBehavior: 'contain',
                        padding: `8px 20px ${NAV + 28}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    {app.loading ? (
                        [0, 1, 2].map((i) => <Skeleton key={i} style={{ height: 70, borderRadius: 16, flexShrink: 0 }} />)
                    ) : (
                        <>
                            <div
                                className="no-scrollbar"
                                style={{
                                    display: 'flex',
                                    gap: 8,
                                    overflowX: 'auto',
                                    overflowY: 'hidden',
                                    touchAction: 'pan-x',
                                    overscrollBehavior: 'contain',
                                    flexShrink: 0,
                                    margin: '0 -20px',
                                    padding: '2px 20px',
                                }}
                            >
                                <FilterChips filters={filters} />
                            </div>
                            {benefits ? (
                                MERCHANTS.map((m) => <MerchantRow key={m.id} merchant={m} onClick={() => setShop(m)} />)
                            ) : (
                                <>
                                    {list.map((p) => (
                                        <PointRow key={p.id} point={p} onClick={() => select(p)} />
                                    ))}
                                    {!list.length && (
                                        <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                            No hay puntos con ese filtro. Prueba con «Todos» o pide un retiro a domicilio.
                                        </div>
                                    )}
                                    <CampaignNotice campaign={CAMPAIGN} onClick={() => filters.only(CAMPAIGN.chip)} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </motion.section>

            <SearchOverlay
                open={searchOpen}
                query={query}
                setQuery={setQuery}
                onClose={() => setSearchOpen(false)}
                onPick={(p) => {
                    setSearchOpen(false);
                    if (p) select(p);
                }}
            />
            <BottomSheet contained open={!!selected} onClose={() => setSelected(null)}>
                {selected && <PointDetail point={selected} onClose={() => setSelected(null)} />}
            </BottomSheet>
            <BottomSheet contained open={!!shop} onClose={() => setShop(null)}>
                {shop && <MerchantDetail merchant={shop} onClose={() => setShop(null)} />}
            </BottomSheet>
        </div>
    );
};

export default Home;
