import React, { useMemo, useState } from 'react';
import type { CleanPoint } from '@/types';
import { Chip, Enter, SearchBar } from '@/components/ui';
import { CAMPAIGN, COMUNAS, USER_POSITION } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { analytics } from '@/utils';
import InteractiveMap from './components/InteractiveMap';
import { PointRow } from './components/PointRow';
import { PointDetail } from './components/PointDetail';
import { CampaignNotice } from './components/CampaignNotice';
import { ChipId, centroid, usePointFilter } from './usePointFilter';
import { MATERIAL_CHIPS, listTitle } from './Home';

/** Explorar (desktop ≥1024): side panel of 340–420 px with search, notice, chips and list; the map takes the rest. */
const DesktopExplore: React.FC = () => {
    const app = useCiudadano();
    const [chip, setChip] = useState<ChipId>('todos');
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<CleanPoint | null>(null);
    const list = usePointFilter(chip, query);
    const focus = useMemo(() => (query ? centroid(list) : null), [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const select = (p: CleanPoint) => {
        setSelected(p);
        analytics.recyclingPointClicked(p.id, p.name);
    };
    const pickChip = (id: ChipId) => {
        setChip(id);
        analytics.materialFilterApplied([id], list.length);
    };

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'minmax(340px,420px) minmax(0,1fr)' }}>
            <aside
                className="no-scrollbar"
                style={{ overflowY: 'auto', borderRight: '1px solid var(--border-card)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
                {selected ? (
                    <Enter key={selected.id}>
                        <PointDetail point={selected} onClose={() => setSelected(null)} />
                    </Enter>
                ) : (
                    <Enter style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <SearchBar value={query} onChange={setQuery} placeholder="Buscar comuna o dirección" />
                        <CampaignNotice campaign={CAMPAIGN} onClick={() => pickChip(CAMPAIGN.chip)} />
                        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{listTitle(list.length, query)}</h1>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {MATERIAL_CHIPS.map((c) => (
                                <Chip key={c.id} active={chip === c.id} onClick={() => pickChip(c.id)}>
                                    {c.label}
                                </Chip>
                            ))}
                        </div>
                        {list.map((p) => (
                            <PointRow key={p.id} point={p} onClick={() => select(p)} />
                        ))}
                        {!list.length && (
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                No encontramos puntos. Por ahora E-Cycle funciona en {COMUNAS.join(', ')}.
                            </div>
                        )}
                    </Enter>
                )}
            </aside>
            <div style={{ position: 'relative', minWidth: 0 }}>
                <InteractiveMap
                    points={list}
                    userPos={USER_POSITION}
                    selected={selected}
                    onSelect={select}
                    dark={app.dark}
                    loading={app.loading}
                    focus={focus}
                    controlsBottom={24}
                />
            </div>
        </div>
    );
};

export default DesktopExplore;
