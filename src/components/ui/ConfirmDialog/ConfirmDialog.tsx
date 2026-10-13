import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { DUR, EASE } from '@/constants/motion';

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmLabel: string;
    cancelLabel?: string;
    icon?: string;
    tone?: 'danger' | 'default';
}

/** Every irreversible action asks first. */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancelar',
    icon = 'delete',
    tone = 'danger',
}) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const danger = tone === 'danger';

    return (
        <AnimatePresence>
            {open && (
                <div className="ec-dialog ec-dialog--open">
                    <motion.div
                        className="ec-dialog__scrim"
                        style={{ transition: 'none' }}
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DUR.base, ease: EASE.standard }}
                    />
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-label={title}
                        className="ec-dialog__panel"
                        style={{ transition: 'none' }}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE.enter } }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: DUR.base * 0.7, ease: EASE.exit } }}
                    >
                        <div className={'ec-iconbox ec-iconbox--lg ' + (danger ? 'ec-iconbox--danger' : 'ec-iconbox--secondary')}>
                            <Icon name={icon} filled />
                        </div>
                        <h2 className="ec-dialog__title">{title}</h2>
                        {description && <p className="ec-dialog__desc">{description}</p>}
                        <div className="ec-dialog__actions">
                            <Button variant="ghost" size="md" onClick={onClose} autoFocus>
                                {cancelLabel}
                            </Button>
                            <Button variant={danger ? 'danger' : 'primary'} size="md" onClick={onConfirm}>
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
