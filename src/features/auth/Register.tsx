import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Enter, IconButton, Input } from '@/components/ui';
import { DEMO_OTP } from '@/constants/ciudadano';
import { DUR, EASE } from '@/constants/motion';
import { useCiudadano } from '@/hooks';
import { trackEvent } from '@/utils/analytics';

type Errors = Partial<Record<'name' | 'phone' | 'code', boolean>>;

const muted: React.CSSProperties = { fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 };

/**
 * Sign-up (name + phone) or log-in (phone only), then a 4-digit SMS code.
 * No passwords. A wrong field shakes and turns red.
 */
export const Register: React.FC = () => {
    const app = useCiudadano();
    const login = app.register === 'login';
    const [step, setStep] = useState<0 | 1>(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [err, setErr] = useState<Errors>({});
    const [shake, setShake] = useState(0);

    const fail = (e: Errors) => {
        setErr(e);
        setShake((n) => n + 1);
    };

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        const x = { name: !login && !name.trim(), phone: phone.replace(/\D/g, '').length < 8 };
        if (x.name || x.phone) return fail(x);
        setErr({});
        setStep(1);
    };

    const verify = (e: React.FormEvent) => {
        e.preventDefault();
        if (code !== DEMO_OTP) return fail({ code: true });
        trackEvent(login ? 'login_completed' : 'signup_completed');
        app.signIn(login ? null : name, phone.trim());
    };

    const shakeIf = (on?: boolean) => (on ? 'ec-shake' : undefined);

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { duration: DUR.slow, ease: EASE.enter } }}
            exit={{ y: '100%', transition: { duration: DUR.slow * 0.7, ease: EASE.exit } }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-title"
            style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'var(--surface-page)', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 12px 0' }}>
                <IconButton
                    icon={step ? 'arrow_back' : 'close'}
                    variant="ghost"
                    ariaLabel={step ? 'Volver' : 'Cerrar'}
                    onClick={() => (step ? setStep(0) : app.closeRegister())}
                />
            </div>
            <Enter
                key={step}
                className="no-scrollbar"
                style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h1 id="register-title" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
                        {step ? 'Revisa tus mensajes' : login ? 'Ingresa a tu cuenta' : 'Crea tu cuenta'}
                    </h1>
                    <p style={muted}>
                        {step
                            ? `Te enviamos un código de 4 dígitos al ${phone}.`
                            : login
                              ? 'Escribe el teléfono con que creaste tu cuenta. Sin contraseñas.'
                              : 'Solo te pedimos tu nombre y tu teléfono. Sin contraseñas.'}
                    </p>
                </div>
                {step === 0 ? (
                    <form onSubmit={send} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {!login && (
                            <div key={`n${shake}`} className={shakeIf(err.name)}>
                                <Input
                                    label="Nombre"
                                    icon="person"
                                    placeholder="Trinidad Rojas"
                                    autoComplete="name"
                                    value={name}
                                    error={err.name ? 'Falta tu nombre' : false}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div key={`p${shake}`} className={shakeIf(err.phone)}>
                            <Input
                                label="Teléfono"
                                type="tel"
                                icon="smartphone"
                                placeholder="+56 9 1234 5678"
                                autoComplete="tel"
                                value={phone}
                                error={err.phone ? 'Revisa el número' : false}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <Button type="submit" size="lg" fullWidth icon="arrow_forward">
                                Enviar código
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={verify} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div key={`c${shake}`} className={shakeIf(err.code)}>
                            <Input
                                label="Código"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={4}
                                icon="pin"
                                placeholder="1234"
                                value={code}
                                error={err.code ? 'Código incorrecto' : false}
                                helperText="En esta maqueta el código es 1234."
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        <Button type="submit" size="lg" fullWidth>
                            {login ? 'Ingresar' : 'Crear cuenta'}
                        </Button>
                        <Button variant="ghost" fullWidth onClick={() => app.say('Te enviamos un código nuevo.', 'info')}>
                            Reenviar código
                        </Button>
                    </form>
                )}
            </Enter>
        </motion.div>
    );
};
