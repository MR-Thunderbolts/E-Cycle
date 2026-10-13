import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Icon, IconButton } from '@/components/ui';
import { DUR, EASE } from '@/constants/motion';

const STEPS: [string, string][] = [
    ['search', 'Busca un punto limpio cerca o pide un retiro a domicilio.'],
    ['qr_code_scanner', 'En el punto, escanea el código QR y cuenta lo que entregas.'],
    ['redeem', 'Suma puntos y canjéalos por descuentos en cargadores, cables y reparaciones.'],
];

export interface WelcomeCardProps {
    onClose: () => void;
    onRegister: () => void;
}

/** First-visit welcome: a short card instead of the old 5-step onboarding. */
export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onClose, onRegister }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                background: 'var(--scrim)',
                backdropFilter: 'var(--blur-backdrop)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE.standard }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-title"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE.enter, delay: 0.12 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: DUR.base, ease: EASE.exit } }}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 400,
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 32,
                    padding: '28px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,.4)',
                }}
            >
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={onClose} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                    <Icon name="recycling" filled size={40} style={{ color: 'var(--brand-fg)' }} />
                    <h2 id="welcome-title" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                        Tus aparatos viejos valen
                    </h2>
                    <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 }}>
                        E-Cycle te ayuda a reciclar celulares, cables y otros aparatos sin complicarte.
                    </p>
                </div>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {STEPS.map(([icon, text], i) => (
                        <li key={icon} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div
                                aria-hidden="true"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 9999,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'color-mix(in oklch, var(--brand-fg) 12%, transparent)',
                                    color: 'var(--brand-fg)',
                                    fontWeight: 800,
                                    fontSize: 14,
                                }}
                            >
                                {i + 1}
                            </div>
                            <span style={{ fontSize: 14, lineHeight: 1.4 }}>{text}</span>
                        </li>
                    ))}
                </ol>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Button size="lg" fullWidth onClick={onClose} autoFocus>
                        Empezar
                    </Button>
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => {
                            onClose();
                            onRegister();
                        }}
                    >
                        Crear cuenta
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};
