import React from 'react';
import { motion } from 'framer-motion';
import { DUR, EASE } from '@/constants/motion';
import { AnimatedLogo } from './Brand';

export interface SplashScreenProps {
    tagline?: string;
}

/** Splash: the stacked logo builds itself (icon, then «e-cycle» and the tagline coming out downward). */
export const SplashScreen: React.FC<SplashScreenProps> = ({ tagline = 'Recicla. Gana. Repite.' }) => (
    <motion.div
        className="ec-splash"
        role="status"
        aria-label="Cargando E-Cycle"
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.exit }}
    >
        <div className="ec-splash__glow" />
        <div style={{ position: 'relative', zIndex: 10 }}>
            <AnimatedLogo iconHeight={84} wordHeight={36} gap={20} tagline={tagline} taglineClassName="ec-splash__tag" />
        </div>
    </motion.div>
);
