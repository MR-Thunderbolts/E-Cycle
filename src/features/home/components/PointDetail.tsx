import React from 'react';
import type { CleanPoint } from '@/types';
import { Button, Icon, IconButton } from '@/components/ui';
import { MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';

const directionsUrl = (p: CleanPoint) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;

/** «Lunes a jueves: 08:30 a 17:30» → [day, hours], plus the closed days so nobody has to guess. */
const scheduleLines = (p: CleanPoint): [string, string][] => {
    if (!p.schedule) return [[p.hours, '']];
    const lines = p.schedule.map((l): [string, string] => {
        const i = l.indexOf(': ');
        return i < 0 ? [l, ''] : [l.slice(0, i), l.slice(i + 2)];
    });
    const all = p.schedule.join(' ').toLowerCase();
    const closed = all.includes('sábado') ? 'Domingo' : 'Sábado y domingo';
    return [...lines, [closed, 'cerrado']];
};

export const PointDetail: React.FC<{ point: CleanPoint; onClose: () => void }> = ({ point, onClose }) => {
    const { saved, toggleSaved } = useCiudadano();
    const isSaved = saved.includes(point.id);
    const open = point.community !== false;
    const line = (icon: string, text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <Icon name={icon} size={20} style={{ color: 'var(--brand-fg)' }} />
            {text}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>{point.name}</h2>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{point.type}</div>
                </div>
                <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={onClose} />
            </div>
            {/* 1 · Who can use it: the first thing to know. */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                    padding: '6px 12px 6px 10px',
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 700,
                    background: open ? 'var(--brand-tint)' : 'var(--surface-inset)',
                    color: open ? 'var(--brand-fg)' : 'var(--text-body)',
                    border: open ? '1px solid transparent' : '1px solid var(--border-strong)',
                }}
            >
                <Icon name={open ? 'public' : 'lock'} size={18} filled={!open} />
                {open ? 'Abierto a todo público' : 'Solo para la comunidad de la sede'}
            </div>
            {/* 2 · What it takes, large enough to read at a glance. */}
            <section aria-label="Qué recibe" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Aquí puedes dejar</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 8 }}>
                    {point.materials.map((m) => {
                        const c = MATERIAL_CATEGORIES.find((x) => x.id === m)!;
                        return (
                            <div
                                key={m}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '12px 14px',
                                    borderRadius: 14,
                                    background: 'var(--brand-tint)',
                                    color: 'var(--text-body)',
                                    fontSize: 15,
                                    fontWeight: 700,
                                }}
                            >
                                <Icon name={c.iconName} size={24} style={{ color: 'var(--brand-fg)' }} />
                                {c.label}
                            </div>
                        );
                    })}
                </div>
            </section>
            {/* 3 · How to get there and when. Days spelled out, closed days said explicitly. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {line('directions_walk', point.dist)}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <Icon name="schedule" size={20} style={{ color: 'var(--brand-fg)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {scheduleLines(point).map(([day, hours]) => (
                            <span key={day}>
                                <strong style={{ fontWeight: 700 }}>{day}</strong>
                                {hours && `: ${hours}`}
                            </span>
                        ))}
                    </div>
                </div>
                {line('location_on', point.address)}
            </div>
            <Button fullWidth icon="directions" iconPosition="left" onClick={() => window.open(directionsUrl(point), '_blank', 'noopener')}>
                Cómo llegar
            </Button>
            <Button variant="ghost" fullWidth icon={isSaved ? 'bookmark_added' : 'bookmark'} iconPosition="left" onClick={() => toggleSaved(point.id)}>
                {isSaved ? 'Punto guardado' : 'Guardar punto'}
            </Button>
        </div>
    );
};
