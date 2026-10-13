import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CleanPoint } from '@/types';
import { Icon, IconButton } from '@/components/ui';
import { CLEAN_POINTS, COMUNAS } from '@/constants/ciudadano';
import { DUR, EASE } from '@/constants/motion';
import { sectionLabel } from './exploreStyles';

interface SearchOverlayProps {
    open: boolean;
    query: string;
    setQuery: (q: string) => void;
    onClose: () => void;
    /** A point, or null when a comuna / «mi ubicación» was chosen. */
    onPick: (point: CleanPoint | null) => void;
}

interface Suggestion {
    key: string;
    icon: string;
    label: string;
    sub: string;
    pick: () => void;
}

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    padding: '6px 12px',
    borderRadius: 12,
    cursor: 'pointer',
    border: 0,
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
    font: 'inherit',
    color: 'inherit',
};

/** Full-screen search: comuna or address, «Usar mi ubicación actual», suggestions. */
export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, query, setQuery, onClose, onPick }) => {
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => input.current?.focus(), 200);
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    const q = query.trim().toLowerCase();
    const points: Suggestion[] = q
        ? CLEAN_POINTS.filter((p) => `${p.name} ${p.address}`.toLowerCase().includes(q)).map((p) => ({
              key: p.id,
              icon: 'recycling',
              label: p.name,
              sub: p.address,
              pick: () => onPick(p),
          }))
        : [];
    const comunas: Suggestion[] = COMUNAS.filter((c) => !q || c.toLowerCase().includes(q)).map((c) => ({
        key: c,
        icon: 'location_city',
        label: c,
        sub: 'Comuna con cobertura',
        pick: () => {
            setQuery(c);
            onPick(null);
        },
    }));
    const suggestions = [...points, ...comunas];
    const firstPoint = points.length ? CLEAN_POINTS.find((p) => p.id === points[0].key)! : null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-label="Buscar"
                    className="no-scrollbar"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: DUR.base, ease: EASE.standard }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 45,
                        background: 'var(--surface-page)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px 12px 120px',
                        gap: 4,
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <IconButton icon="arrow_back" variant="ghost" ariaLabel="Volver" onClick={onClose} />
                        <div
                            style={{
                                flex: 1,
                                minWidth: 0,
                                background: 'var(--surface-card)',
                                border: '1px solid var(--brand-fg)',
                                boxShadow: '0 0 0 3px var(--brand-glow)',
                                borderRadius: 16,
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Icon name="search" style={{ color: 'var(--text-muted)' }} />
                            <input
                                ref={input}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onPick(firstPoint)}
                                placeholder="Buscar comuna o dirección"
                                aria-label="Buscar comuna o dirección"
                                enterKeyHint="search"
                                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', fontSize: 14 }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    aria-label="Borrar búsqueda"
                                    onClick={() => setQuery('')}
                                    style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                                >
                                    <Icon name="close" size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        style={rowStyle}
                        onClick={() => {
                            setQuery('');
                            onPick(null);
                        }}
                    >
                        <Icon name="my_location" style={{ color: 'var(--brand-fg)' }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-fg)' }}>Usar mi ubicación actual</span>
                    </button>
                    <div style={{ ...sectionLabel, padding: '8px 12px 0' }}>{q ? 'Resultados' : 'Comunas con cobertura'}</div>
                    {suggestions.map((s) => (
                        <button type="button" key={s.key} style={rowStyle} onClick={s.pick}>
                            <Icon name={s.icon} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                                <span style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</span>
                            </span>
                        </button>
                    ))}
                    {!suggestions.length && (
                        <div style={{ padding: 12, fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                            No encontramos «{query}». Por ahora E-Cycle funciona en Puente Alto, La Florida, La Granja, El Bosque y San
                            Bernardo.
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
