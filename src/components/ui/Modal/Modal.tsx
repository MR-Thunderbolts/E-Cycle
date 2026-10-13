import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '../IconButton';
import { DUR, EASE } from '@/constants/motion';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'fullscreen';
    showCloseButton?: boolean;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    className = '',
}) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const close = <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={onClose} />;

    return (
        <AnimatePresence>
            {open && (
                <div className="ec-modal">
                    <motion.div
                        className="ec-modal__scrim"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DUR.base, ease: EASE.standard }}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        className={['ec-modal__panel', `ec-modal__panel--${size}`, className].filter(Boolean).join(' ')}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE.enter } }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: DUR.base * 0.7, ease: EASE.exit } }}
                    >
                        {title ? (
                            <div className="ec-modal__head">
                                <h2 className="ec-modal__title">{title}</h2>
                                {showCloseButton && close}
                            </div>
                        ) : (
                            showCloseButton && <div className="ec-modal__x">{close}</div>
                        )}
                        <div className="ec-modal__body">{children}</div>
                        {footer && <div className="ec-modal__foot">{footer}</div>}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
