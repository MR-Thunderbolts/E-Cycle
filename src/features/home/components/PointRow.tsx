import React from 'react';
import { motion } from 'framer-motion';
import type { CleanPoint } from '@/types';
import { Icon } from '@/components/ui';
import { DUR } from '@/constants/motion';
import { dotStyle, rowStyle } from './exploreStyles';

export const PointRow: React.FC<{ point: CleanPoint; onClick: () => void }> = ({ point, onClick }) => (
    <motion.button
        type="button"
        onClick={onClick}
        style={rowStyle}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: DUR.instant }}
    >
        <div style={dotStyle}>
            <Icon name="recycling" filled size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{point.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {point.dist} · {point.hours}
            </div>
        </div>
        <Icon name="chevron_right" style={{ color: 'var(--text-muted)' }} />
    </motion.button>
);
