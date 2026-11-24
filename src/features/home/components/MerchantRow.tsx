import React from 'react';
import { motion } from 'framer-motion';
import type { Merchant } from '@/types';
import { Icon } from '@/components/ui';
import { DUR } from '@/constants/motion';
import { dotStyle, rowStyle } from './exploreStyles';

export const MerchantRow: React.FC<{ merchant: Merchant; onClick: () => void }> = ({ merchant, onClick }) => (
    <motion.button type="button" onClick={onClick} style={rowStyle} whileTap={{ scale: 0.98 }} transition={{ duration: DUR.instant }}>
        <div style={dotStyle}>
            <Icon name="redeem" filled size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{merchant.name}</div>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                Canjea {merchant.benefit} · a {merchant.minutes} min
            </div>
        </div>
        <Icon name="chevron_right" style={{ color: 'var(--text-muted)' }} />
    </motion.button>
);
