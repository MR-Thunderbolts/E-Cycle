import React from 'react';
import { Icon } from '../Icon';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    open?: boolean;
    message: string;
    variant?: ToastVariant;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const ICONS: Record<ToastVariant, string> = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

/** Closed, it keeps pointer-events:none so it never swallows taps (see .ec-toast). */
export const Toast: React.FC<ToastProps> = ({ open = true, message, variant = 'success', actionLabel, onAction, className = '' }) => (
    <div
        role={variant === 'error' ? 'alert' : 'status'}
        aria-hidden={!open}
        className={['ec-toast', `ec-toast--${variant}`, open ? 'ec-toast--open' : '', className].filter(Boolean).join(' ')}
    >
        <Icon name={ICONS[variant]} filled className="ec-toast__icon" />
        <div className="ec-toast__msg">{message}</div>
        {actionLabel && (
            <button type="button" className="ec-toast__action" onClick={onAction}>
                {actionLabel}
            </button>
        )}
    </div>
);
