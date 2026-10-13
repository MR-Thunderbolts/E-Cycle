import React, { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion, useDragControls, PanInfo } from 'framer-motion';
import { IconButton } from '../IconButton';
import { DUR, EASE, SPRING_SHEET } from '@/constants/motion';

export interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    /** Position inside the nearest positioned ancestor instead of the viewport. */
    contained?: boolean;
    className?: string;
}

// The CSS transitions on .ec-sheet/.ec-dialog are turned off inline so Framer Motion drives every frame.
const DISMISS_DISTANCE = 120; // px
const DISMISS_VELOCITY = 500; // px/s

/** Closes with the X, the scrim, Escape, or dragging the handle down >120px or faster than 500px/s. */
export const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, title, children, contained = false, className = '' }) => {
    const drag = useDragControls();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    className={['ec-sheet-root', 'ec-sheet-root--open', contained ? 'ec-sheet-root--contained' : '', className]
                        .filter(Boolean)
                        .join(' ')}
                >
                    <motion.div
                        className="ec-sheet__scrim"
                        style={{ transition: 'none' }}
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DUR.slow, ease: EASE.standard }}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        className="ec-sheet"
                        style={{ transition: 'none' }}
                        initial={{ y: '105%' }}
                        animate={{ y: 0, transition: SPRING_SHEET }}
                        exit={{ y: '105%', transition: { duration: DUR.slow * 0.7, ease: EASE.exit } }}
                        drag="y"
                        dragListener={false}
                        dragControls={drag}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0.05, bottom: 1 }}
                        onDragEnd={onDragEnd}
                    >
                        <div
                            className="ec-sheet__handle"
                            onPointerDown={(e) => drag.start(e)}
                            aria-label="Arrastra hacia abajo para cerrar"
                        >
                            <span />
                        </div>
                        <div className="ec-sheet__body">
                            {title && (
                                <div className="ec-sheet__head">
                                    <h2 className="ec-sheet__title">{title}</h2>
                                    <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={onClose} />
                                </div>
                            )}
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
