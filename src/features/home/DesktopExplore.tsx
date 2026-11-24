import React, { useEffect, useMemo, useState } from 'react';
import type { CleanPoint, Merchant } from '@/types';
import { Enter, SearchBar } from '@/components/ui';
import { CAMPAIGN, COMUNAS, MERCHANTS, USER_POSITION } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import InteractiveMap from './components/InteractiveMap';
import { PointRow } from './components/PointRow';
import { PointDetail } from './components/PointDetail';
import { CampaignNotice } from './components/CampaignNotice';
import { FilterChips } from './components/FilterChips';
import { MerchantRow } from './components/MerchantRow';
import { MerchantDetail } from './components/MerchantDetail';
import { centroid, usePointFilter } from './usePointFilter';
import { useExploreFilters } from './useExploreFilters';
import { benefitsTitle, listTitle, merchantPlace, placeOf } from './Home';

/** Explorar (desktop ≥1024): side panel of 340–420 px with search, notice, chips and list; the map takes the rest. */
const DesktopExplore: React.FC = () => {
    const app = useCiudadano();
    const filters = useExploreFilters();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<CleanPoint | null>(null);
    const [shop, setShop] = useState<Merchant | null>(null);
    const list = usePointFilter(filters.materials, query);
    const benefits = filters.benefits;
    const places = useMemo(() => (benefits ? MERCHANTS.map(merchantPlace) : list.map(placeOf)), [benefits, list]);
    const selectedPlace = benefits ? (shop ? merchantPlace(shop) : null) : selected ? placeOf(selected) : null;
    const focus = useMemo(() => (query ? centroid(list) : null), [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const select = (p: CleanPoint) => setSelected(p);
    const selectPlace = (id: string) => {
        if (benefits) setShop(MERCHANTS.find((m) => m.id === id) ?? null);
        else {
            const p = list.find((x) => x.id === id);
            if (p) setSelected(p);
        }
    };
    // Leaving the benefits view drops the shop that was open.
    useEffect(() => {
        if (!benefits) setShop(null);
    }, [benefits]);

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'minmax(340px,420px) minmax(0,1fr)' }}>
            <aside
                className="no-scrollbar"
                style={{ overflowY: 'auto', borderRight: '1px solid var(--border-card)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
                {benefits && shop ? (
                    <Enter key={shop.id}>
                        <MerchantDetail merchant={shop} onClose={() => setShop(null)} />
                    </Enter>
                ) : !benefits && selected ? (
                    <Enter key={selected.id}>
                        <PointDetail point={selected} onClose={() => setSelected(null)} />
                    </Enter>
                ) : (
                    <Enter style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <SearchBar value={query} onChange={setQuery} placeholder="Buscar comuna o dirección" />
                        {!benefits && <CampaignNotice campaign={CAMPAIGN} onClick={() => filters.only(CAMPAIGN.chip)} />}
                        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{benefits ? benefitsTitle(MERCHANTS.length) : listTitle(list.length, query)}</h1>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                                        No encontramos puntos. Por ahora E-Cycle funciona en {COMUNAS.join(', ')}.
                                    </div>
                                )}
                            </>
                        )}
                    </Enter>
                )}
            </aside>
            <div style={{ position: 'relative', minWidth: 0 }}>
                <InteractiveMap
                    points={places}
                    userPos={USER_POSITION}
                    selected={selectedPlace}
                    onSelect={selectPlace}
                    loading={app.loading}
                    focus={focus}
                    controlsBottom={24}
                />
            </div>
        </div>
    );
};

export default DesktopExplore;
