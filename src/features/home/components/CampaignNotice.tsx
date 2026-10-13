import React from 'react';
import type { Campaign } from '@/types';
import { Icon } from '@/components/ui';
import { dotStyle, rowStyle } from './exploreStyles';

/** Weekly campaign. Tapping it turns on its material chip. */
export const CampaignNotice: React.FC<{ campaign: Campaign; onClick: () => void }> = ({ campaign, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            ...rowStyle,
            alignItems: 'flex-start',
            background: 'color-mix(in oklch, var(--ec-points) 10%, var(--surface-card))',
            borderColor: 'color-mix(in oklch, var(--ec-points) 40%, transparent)',
        }}
    >
        <div style={{ ...dotStyle, background: 'color-mix(in oklch, var(--ec-points) 18%, transparent)', color: 'var(--ec-points)' }}>
            <Icon name={campaign.icon} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{campaign.title}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-muted)' }}>{campaign.body}</div>
        </div>
    </button>
);
