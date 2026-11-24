import React from 'react';
import { motion } from 'framer-motion';
import { DUR, EASE } from '@/constants/motion';
import { Isotipo, Logotipo } from './Brand';

export interface SplashScreenProps {
    tagline?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ tagline = 'Recicla. Gana. Repite.' }) => (
    <motion.div
        className="ec-splash"
        role="status"
        aria-label="Cargando E-Cycle"
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.exit }}
    >
        <div className="ec-splash__glow" />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div className="ec-splash__brand">
                <Isotipo height={84} />
                <Logotipo height={36} style={{ marginTop: 20 }} />
            </div>
            <p className="ec-splash__tag">{tagline}</p>
        </div>
    </motion.div>
);
