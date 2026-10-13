import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccountNudge, BottomSheet, ConfirmDialog, Modal, Toast } from '@/components/ui';
import { WelcomeCard } from '@/components/Welcome';
import { Profile } from '@/features/profile';
import { Register } from '@/features/auth';
import { useCiudadano } from '@/hooks';

interface PanelProps {
    desktop: boolean;
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/** BottomSheet on mobile, Modal on desktop. */
const Panel: React.FC<PanelProps> = ({ desktop, open, onClose, children }) =>
    desktop ? (
        <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
            <div style={{ padding: 8 }}>{children}</div>
        </Modal>
    ) : (
        <BottomSheet contained open={open} onClose={onClose}>
            {children}
        </BottomSheet>
    );

/** Layers shared by mobile and desktop: account, account nudge, welcome, confirmation, registration and toast. */
export const CiudadanoOverlays: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
    const app = useCiudadano();

    return (
        <>
            <Panel desktop={desktop} open={app.account} onClose={app.closeAccount}>
                <Profile />
            </Panel>
            <Panel desktop={desktop} open={app.nudge != null} onClose={app.closeNudge}>
                {app.nudge != null && (
                    <AccountNudge
                        points={app.nudge}
                        onCreate={() => app.openRegister('signup')}
                        onLogin={() => app.openRegister('login')}
                        onSkip={app.closeNudge}
                    />
                )}
            </Panel>

            <AnimatePresence>
                {app.showWelcome && <WelcomeCard onClose={app.closeWelcome} onRegister={() => app.openRegister('signup')} />}
            </AnimatePresence>

            <div style={{ position: 'relative', zIndex: 95 }}>
                <ConfirmDialog
                    open={!!app.confirm}
                    onClose={app.closeConfirm}
                    onConfirm={() => {
                        app.confirm?.run();
                        app.closeConfirm();
                    }}
                    title={app.confirm?.title ?? ''}
                    description={app.confirm?.description}
                    confirmLabel={app.confirm?.label ?? ''}
                    icon={app.confirm?.icon}
                    tone="danger"
                />
            </div>

            <AnimatePresence>
                {app.register &&
                    (desktop ? (
                        <div
                            key="register"
                            style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'var(--scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: 440,
                                    maxWidth: 'calc(100vw - 32px)',
                                    height: 'min(600px, calc(100vh - 32px))',
                                    borderRadius: 32,
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-card)',
                                }}
                            >
                                <Register />
                            </div>
                        </div>
                    ) : (
                        <Register key="register" />
                    ))}
            </AnimatePresence>

            <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 90, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: app.toast.open ? 'auto' : 'none' }}>
                    <Toast open={app.toast.open} message={app.toast.message || ' '} variant={app.toast.variant} />
                </div>
            </div>
        </>
    );
};
