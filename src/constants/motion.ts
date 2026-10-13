import type { Transition } from 'framer-motion';

/** Motion tokens (src/styles/motion.css) expressed for Framer Motion. */
export const DUR = { instant: 0.1, fast: 0.15, base: 0.25, slow: 0.35 } as const;

export const EASE = {
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0, 1],
    exit: [0.3, 0, 1, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const SPRING_SHEET: Transition = { type: 'spring', stiffness: 400, damping: 40 };

/** Screen and step entrance: scale(.94) translateY(8px) → none. */
export const enterMotion = {
    initial: { opacity: 0, scale: 0.94, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: DUR.slow, ease: EASE.enter },
} as const;
