import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { enterMotion } from '@/constants/motion';

/** Screen and step entrance (scale .94 + 8 px → none, 350 ms). Give it a `key` to replay on change. */
export const Enter: React.FC<HTMLMotionProps<'div'> & { delay?: number }> = ({ delay = 0, ...props }) => (
    <motion.div
        initial={enterMotion.initial}
        animate={enterMotion.animate}
        transition={{ ...enterMotion.transition, delay }}
        {...props}
    />
);
