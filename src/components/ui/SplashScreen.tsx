import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DUR, EASE } from '@/constants/motion';
import { AnimatedLogo } from './Brand';
import { bootLoader } from './Brand/AnimatedLogo';

export interface SplashScreenProps {
    tagline?: string;
    /** The logo finished building (plus a short beat). */
    onDone?: () => void;
}

/** Splash: the stacked logo builds itself (icon, then «e-cycle» and the tagline coming out downward). */
export const SplashScreen: React.FC<SplashScreenProps> = ({ tagline = 'Recicla. Gana. Repite.', onDone }) => {
    // Read once: re-renders after the loader is gone must not restart the pulse.
    const [glowDelay] = useState(() => Math.round((bootLoader()?.elapsed() ?? 0) % 2000));
    return (
        <motion.div
            className="ec-splash"
            role="status"
            aria-label="Cargando E-Cycle"
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.slow, ease: EASE.exit }}
        >
            {/* Continues the loading spiral's glow pulse instead of restarting it. */}
            <div className="ec-splash__glow" style={{ animationDelay: `-${glowDelay}ms` }} />
            <div style={{ position: 'relative', zIndex: 10 }}>
                <AnimatedLogo iconHeight={84} wordHeight={36} gap={20} tagline={tagline} taglineClassName="ec-splash__tag" onDone={onDone} />
            </div>
        </motion.div>
    );
};
