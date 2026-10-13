import React from 'react';
import type { CleanPoint } from '@/types';
import { Button, Chip, Icon, IconButton } from '@/components/ui';
import { MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { sectionLabel } from './exploreStyles';

const directionsUrl = (p: CleanPoint) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;

export const PointDetail: React.FC<{ point: CleanPoint; onClose: () => void }> = ({ point, onClose }) => {
    const { saved, toggleSaved } = useCiudadano();
    const isSaved = saved.includes(point.id);
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {line('directions_walk', point.dist)}
                {line('schedule', point.hours)}
                {line('location_on', point.address)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={sectionLabel}>Recibe</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {point.materials.map((m) => {
                        const c = MATERIAL_CATEGORIES.find((x) => x.id === m)!;
                        return (
                            <Chip key={m} icon={c.iconName}>
                                {c.label}
                            </Chip>
                        );
                    })}
                </div>
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
