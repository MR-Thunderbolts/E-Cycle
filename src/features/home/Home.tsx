import React, { useEffect, useMemo, useState } from 'react';
import type { CleanPoint, MapPosition, Merchant } from '@/types';
import { BottomSheet, Icon, IconButton } from '@/components/ui';
import { CLEAN_POINTS, MERCHANTS, USER_POSITION } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { initials } from '@/utils/format';
import InteractiveMap, { type MapPlace } from './components/InteractiveMap';
import { SearchOverlay } from './components/SearchOverlay';
import { PointRow } from './components/PointRow';
import { PointDetail } from './components/PointDetail';
import { FilterChips } from './components/FilterChips';
import { MerchantRow } from './components/MerchantRow';
import { MerchantDetail } from './components/MerchantDetail';
import { centroid, usePointFilter } from './usePointFilter';
import { useExploreFilters } from './useExploreFilters';
import { useNearby } from './useNearby';

/** Zoom and «mi ubicación» float this far above the bottom edge (v2.1: above the nav bar, no drawer). */
const CONTROLS_BOTTOM = 210;
/** Search pill: 16 from the top, 56 tall; the filter chips sit 10 below it. */
const CHIPS_TOP = 82;

export const placeOf = (p: CleanPoint): MapPlace => ({ id: p.id, name: p.name, x: p.x, y: p.y, kind: p.community === false ? 'privado' : 'punto' });
export const merchantPlace = (m: Merchant): MapPlace => ({ id: m.id, name: m.name, x: m.x, y: m.y, kind: 'beneficio' });

export const benefitsTitle = (count: number) => (count === 1 ? '1 lugar para canjear cerca' : `${count} lugares para canjear cerca`);

export const listTitle = (count: number, query: string) =>
    query
        ? `${count === 1 ? '1 punto' : `${count} puntos`} para «${query}»`
        : count === 1
          ? '1 punto cerca de ti'
          : `${count} puntos cerca de ti`;

/**
 * Explorar (mobile, v2.1): full-screen map with the search pill and the filter chips floating on top.
 * No drawer: the search suggests the points near you (current location or the profile address).
 */
const Home: React.FC = () => {
    const app = useCiudadano();
    const filters = useExploreFilters();
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [selected, setSelected] = useState<CleanPoint | null>(null);
    const [shop, setShop] = useState<Merchant | null>(null);
    const [here, setHere] = useState<MapPosition | null>(null);
    const nearby = useNearby(filters.materials);
    const found = usePointFilter(filters.materials, query);
    // Without a search the map shows the same points the search suggests.
    const list = query ? found : nearby.points;
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
    // Re-centre when the search changes (not when a chip filters the list), or on «Usar mi ubicación actual».
    const searched = useMemo(() => (query ? centroid(list) : null), [query]); // eslint-disable-line react-hooks/exhaustive-deps
    // Near the profile address: frame those points instead of the «Tú» dot.
    const nearHome = useMemo(
        () => (nearby.fromAddress ? centroid(CLEAN_POINTS.filter((p) => p.address.includes(nearby.comuna))) : null),
        [nearby.fromAddress, nearby.comuna],
    );
    const focus = query ? searched : (here ?? nearHome);

    const selectPlace = (id: string) => {
        if (benefits) setShop(MERCHANTS.find((m) => m.id === id) ?? null);
        else {
            const p = list.find((x) => x.id === id);
            if (p) setSelected(p);
        }
    };

    const locate = () => {
        setQuery('');
        setSearchOpen(false);
        setHere({ ...USER_POSITION });
        if (app.located) return;
        if (!('geolocation' in navigator)) {
            app.say('Tu navegador no comparte la ubicación. Te mostramos los puntos de tu comuna.', 'info');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            () => app.setLocated(true),
            () => app.say('No pudimos usar tu ubicación. Te mostramos los puntos de tu comuna.', 'info'),
            { timeout: 8000, maximumAge: 60000 },
        );
    };

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <h1 className="sr-only">Explorar puntos limpios</h1>
            <InteractiveMap
                points={places}
                userPos={USER_POSITION}
                selected={selectedPlace}
                onSelect={selectPlace}
                loading={app.loading}
                focus={focus}
                controlsBottom={CONTROLS_BOTTOM}
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
                <div
                    role="group"
                    aria-label="Filtrar el mapa"
                    data-map-ui
                    className="no-scrollbar"
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: CHIPS_TOP,
                        left: 0,
                        right: 0,
                        zIndex: 4,
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        touchAction: 'pan-x',
                        overscrollBehavior: 'contain',
                        // Room for the chip shadow and the 44px touch area.
                        padding: '2px 16px 10px',
                    }}
                >
                    <FilterChips filters={filters} onMap />
                </div>
            </InteractiveMap>

            <SearchOverlay
                open={searchOpen}
                query={query}
                setQuery={setQuery}
                onClose={() => setSearchOpen(false)}
                onLocate={locate}
                onPick={(p) => {
                    setSearchOpen(false);
                    if (p) setSelected(p);
                }}
                nearbyTitle={benefits ? benefitsTitle(MERCHANTS.length) : nearby.title}
                nearby={
                    benefits ? (
                        MERCHANTS.map((m) => (
                            <MerchantRow
                                key={m.id}
                                merchant={m}
                                onClick={() => {
                                    setSearchOpen(false);
                                    setShop(m);
                                }}
                            />
                        ))
                    ) : nearby.points.length ? (
                        nearby.points.map((p) => (
                            <PointRow
                                key={p.id}
                                point={p}
                                onClick={() => {
                                    setSearchOpen(false);
                                    setSelected(p);
                                }}
                            />
                        ))
                    ) : (
                        <div style={{ padding: '4px 12px', fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                            No hay puntos cerca con ese filtro. Prueba con «Todos» o pide un retiro a domicilio.
                        </div>
                    )
                }
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
