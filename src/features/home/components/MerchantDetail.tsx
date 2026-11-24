import React from 'react';
import type { Merchant } from '@/types';
import { Button, Icon, IconButton } from '@/components/ui';
import { useCiudadano } from '@/hooks';

const directionsUrl = (m: Merchant) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(m.address)}`;

/** Preview of a shop with a benefit: what it sells, where, and what you can redeem there. */
export const MerchantDetail: React.FC<{ merchant: Merchant; onClose: () => void }> = ({ merchant, onClose }) => {
    const app = useCiudadano();
    const line = (icon: string, text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, lineHeight: 1.5 }}>
            <Icon name={icon} size={20} style={{ color: 'var(--brand-fg)' }} />
            {text}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.15, margin: 0 }}>{merchant.name}</h2>
                    <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)' }}>Comercio adherido · ejemplo</div>
                </div>
                <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={onClose} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {line('storefront', merchant.category)}
                {line('directions_walk', `A ${merchant.minutes} min a pie`)}
                {line('schedule', merchant.hours)}
                {line('location_on', merchant.address)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.5, color: 'var(--text-muted)' }}>Canjea aquí</span>
                {line('redeem', merchant.benefit)}
            </div>
            <Button fullWidth icon="directions" iconPosition="left" onClick={() => window.open(directionsUrl(merchant), '_blank', 'noopener')}>
                Cómo llegar
            </Button>
            <Button
                variant="ghost"
                fullWidth
                icon="redeem"
                iconPosition="left"
                onClick={() => {
                    onClose();
                    app.go('ehub');
                }}
            >
                Ver beneficio
            </Button>
        </div>
    );
};
