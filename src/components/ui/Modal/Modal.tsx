import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Size styles
    const sizeStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        fullscreen: 'max-w-full w-full h-full rounded-none',
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`relative w-full ${sizeStyles[size]} bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col ${size === 'fullscreen' ? '' : 'max-h-[90vh]'} ${className}`}
                    >
                        {/* Header */}
                        {title ? (
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border shrink-0">
                                <h2 className="text-xl font-bold text-text dark:text-dark-text">
                                    {title}
                                </h2>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                        aria-label="Close"
                                    >
                                        <span className="material-symbols-rounded">close</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors z-10"
                                    aria-label="Close"
                                >
                                    <span className="material-symbols-rounded">close</span>
                                </button>
                            )
                        )}

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="p-6 border-t border-gray-100 dark:border-dark-border shrink-0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
