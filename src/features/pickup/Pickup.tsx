import React, { useState } from 'react';
import { Button, Chip, Counter, Enter, Icon, IconButton, Input, ProgressBar, screen } from '@/components/ui';
import { COMUNAS, FREE_PICKUP_KG, PICKUP_ITEMS, PICKUP_POINTS_PER_KG, SECTOR } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { trackEvent } from '@/utils/analytics';
import { fmtKg } from '@/utils/format';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SLOTS = ['9:00 – 13:00', '13:00 – 17:00', '17:00 – 20:00'];
const NUDGE_DELAY_MS = 700;

type Errors = Partial<Record<'street' | 'comuna' | 'when' | 'phone', boolean>>;

const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
const digits = (s: string) => s.replace(/\D/g, '').length;

/** Retiro a domicilio: what → where → when → review → tracking. */
const Pickup: React.FC = () => {
    const app = useCiudadano();
    const [step, setStep] = useState(0);
    const [qty, setQty] = useState<Record<string, number>>({});
    const [addr, setAddr] = useState({ street: '', comuna: '', extra: '' });
    const [days, setDays] = useState<string[]>([]);
    const [slots, setSlots] = useState<string[]>([]);
    const [phone, setPhone] = useState('');
    const [err, setErr] = useState<Errors>({});
    const [shake, setShake] = useState(0);

    const kg = PICKUP_ITEMS.reduce((s, i) => s + (qty[i.id] || 0) * i.kg, 0);
    const units = Object.values(qty).reduce((a, b) => a + b, 0);
    const fill = Math.min(100, Math.round(((SECTOR.kg + kg) / SECTOR.capacityKg) * 100));
    const free = kg >= FREE_PICKUP_KG;

    /** A missing field shakes its group (±8 px, 420 ms) and turns red. */
    const fail = (e: Errors) => {
        setErr(e);
        setShake((n) => n + 1);
    };

    const next = () => {
        if (step === 1) {
            const e = { street: !addr.street.trim(), comuna: !addr.comuna };
            if (e.street || e.comuna) return fail(e);
        }
        if (step === 2 && (!days.length || !slots.length)) return fail({ when: true });
        if (step === 3 && !app.signedIn && digits(phone) < 8) return fail({ phone: true });
        setErr({});
        setStep(step + 1);
        if (step === 3) {
            trackEvent('pickup_requested', { kg: +kg.toFixed(1), units, comuna: addr.comuna });
            if (!app.signedIn) setTimeout(() => app.openNudge(Math.round(kg * PICKUP_POINTS_PER_KG)), NUDGE_DELAY_MS);
        }
    };

    const reset = () => {
        setStep(0);
        setQty({});
        setDays([]);
        setSlots([]);
    };

    const shakeIf = (on?: boolean) => (on && shake ? 'ec-shake' : undefined);

    const head = (n: number, title: string, sub?: string) => (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44 }}>
                {n > 0 && <IconButton icon="arrow_back" variant="ghost" ariaLabel="Paso anterior" onClick={() => setStep(n - 1)} />}
                <span style={{ ...screen.label, color: 'var(--brand-fg)' }}>Paso {n + 1} de 4</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h1 style={screen.h1}>{title}</h1>
                {sub && <p style={screen.p}>{sub}</p>}
            </div>
        </>
    );

    let body: React.ReactNode;

    if (step === 0) {
        body = (
            <>
                {head(0, '¿Qué quieres reciclar?', 'Cuenta cuántos tienes de cada uno. Con eso calculamos el peso; no necesitas pesarlos.')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {PICKUP_ITEMS.map((it) => {
                        const n = qty[it.id] || 0;
                        return (
                            <div
                                key={it.id}
                                style={{
                                    ...screen.card,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 14,
                                    borderColor: n ? 'var(--brand-fg)' : 'var(--border-card)',
                                    transition: 'border-color var(--dur-base)',
                                }}
                            >
                                <Icon name={it.icon} size={28} style={{ color: n ? 'var(--brand-fg)' : 'var(--text-muted)', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>{it.label}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {it.hint ? `${it.hint} · ` : ''}~{fmtKg(it.kg)} kg c/u
                                    </div>
                                </div>
                                <Counter value={n} label={it.label} onChange={(v) => setQty({ ...qty, [it.id]: v })} />
                            </div>
                        );
                    })}
                </div>
                <div style={screen.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Peso estimado</span>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>{fmtKg(kg)} kg</span>
                    </div>
                    <ProgressBar value={Math.min(kg, FREE_PICKUP_KG)} max={FREE_PICKUP_KG} variant={free ? 'success' : 'primary'} size="sm" />
                    <p style={{ ...screen.p, fontSize: 12 }}>
                        {free
                            ? 'Tu retiro es gratis.'
                            : `El retiro es gratis desde ${FREE_PICKUP_KG} kg. Con menos, te conviene llevarlo a un punto limpio cercano.`}
                    </p>
                    {!free && units > 0 && (
                        <Button variant="ghost" size="md" icon="map" iconPosition="left" onClick={() => app.go('explorar')}>
                            Ver puntos cercanos
                        </Button>
                    )}
                </div>
                <Button size="lg" fullWidth disabled={!free} onClick={next}>
                    Continuar
                </Button>
            </>
        );
    }

    if (step === 1) {
        body = (
            <>
                {head(1, '¿Dónde lo retiramos?', 'Solo llegamos a las comunas con cobertura.')}
                <div key={shake} className={shakeIf(err.street || err.comuna)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="Calle y número"
                        icon="home"
                        placeholder="Av. Vicuña Mackenna 6100"
                        autoComplete="street-address"
                        value={addr.street}
                        error={err.street ? 'Falta este dato' : false}
                        onChange={(e) => setAddr({ ...addr, street: e.target.value })}
                    />
                    <div role="group" aria-label="Comuna" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ ...screen.label, color: err.comuna ? 'var(--error-fg)' : 'var(--text-muted)' }}>
                            Comuna{err.comuna ? ' · Elige una' : ''}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {COMUNAS.map((c) => (
                                <Chip key={c} active={addr.comuna === c} onClick={() => setAddr({ ...addr, comuna: c })}>
                                    {c}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <Input
                        label="Depto, casa o indicaciones (opcional)"
                        icon="info"
                        placeholder="Depto 402, timbre no funciona"
                        value={addr.extra}
                        onChange={(e) => setAddr({ ...addr, extra: e.target.value })}
                    />
                </div>
                <Button size="lg" fullWidth onClick={next}>
                    Continuar
                </Button>
            </>
        );
    }

    if (step === 2) {
        body = (
            <>
                {head(
                    2,
                    '¿Cuándo te acomoda?',
                    'El camión sale cuando tu sector junta suficiente e-waste. Marca los días y horarios en que hay alguien en casa.',
                )}
                <div style={screen.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{SECTOR.name}</span>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>{fill}%</span>
                    </div>
                    <ProgressBar value={fill} max={100} size="sm" />
                    <p style={{ ...screen.p, fontSize: 12 }}>
                        Con tu retiro el sector llega a {fill}% de la carga del camión. Te avisamos con 24 horas de anticipación cuando se programe
                        la ruta.
                    </p>
                </div>
                <div key={shake} className={shakeIf(err.when)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div role="group" aria-label="Días" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={screen.label}>Días</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {DAYS.map((d) => (
                                <Chip key={d} active={days.includes(d)} onClick={() => setDays(toggle(days, d))}>
                                    {d}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <div role="group" aria-label="Horarios" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={screen.label}>Horarios</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {SLOTS.map((s) => (
                                <Chip key={s} active={slots.includes(s)} onClick={() => setSlots(toggle(slots, s))}>
                                    {s}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    {err.when && <p style={{ ...screen.p, color: 'var(--error-fg)' }}>Marca al menos un día y un horario.</p>}
                </div>
                <Button size="lg" fullWidth onClick={next}>
                    Continuar
                </Button>
            </>
        );
    }

    if (step === 3) {
        const summary: [string, string][] = [
            ['inventory_2', PICKUP_ITEMS.filter((i) => qty[i.id]).map((i) => `${qty[i.id]} × ${i.label.toLowerCase()}`).join(', ')],
            ['home', `${addr.street}${addr.extra ? `, ${addr.extra}` : ''} · ${addr.comuna}`],
            ['event', `${days.join(', ')} · ${slots.join(', ')}`],
            ['payments', `Gratis · ${fmtKg(kg)} kg estimados`],
        ];
        body = (
            <>
                {head(3, 'Revisa tu retiro', 'Si algo no está bien, vuelve atrás y cámbialo.')}
                <div style={screen.card}>
                    {summary.map(([icon, text]) => (
                        <div key={icon} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.4 }}>
                            <Icon name={icon} size={20} style={{ color: 'var(--brand-fg)', flexShrink: 0 }} />
                            {text}
                        </div>
                    ))}
                </div>
                {!app.signedIn && (
                    <div key={shake} className={shakeIf(err.phone)}>
                        <Input
                            label="Teléfono de contacto"
                            type="tel"
                            icon="call"
                            autoComplete="tel"
                            placeholder="+56 9 1234 5678"
                            value={phone}
                            error={err.phone ? 'Revisa el número' : false}
                            onChange={(e) => setPhone(e.target.value)}
                            helperText="Lo usamos solo para avisarte del retiro."
                        />
                    </div>
                )}
                <Button size="lg" fullWidth icon="check" iconPosition="left" onClick={next}>
                    Pedir retiro
                </Button>
            </>
        );
    }

    if (step === 4) {
        const tracking: [string, string, boolean][] = [
            ['Solicitud recibida', 'Hoy', true],
            ['Tu sector junta e-waste', `${fill}% de la carga del camión`, false],
            ['Ruta programada', 'Te avisamos con 24 horas de anticipación', false],
            ['Retirado', 'Sumamos tus puntos', false],
        ];
        body = (
            <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, paddingTop: 12 }}>
                    <div
                        style={{
                            ...screen.ico('var(--ec-success)', 72),
                            background: 'color-mix(in oklch, var(--ec-success) 18%, transparent)',
                            animation: 'ec-pop 450ms var(--ease-enter) both',
                        }}
                    >
                        <Icon name="check" size={40} />
                    </div>
                    <h1 style={screen.h1}>¡Solicitud recibida!</h1>
                    <p style={screen.p}>Cuando tu sector complete la carga del camión, te avisamos por SMS con 24 horas de anticipación.</p>
                </div>
                <div style={screen.card}>
                    <div style={screen.label}>Seguimiento</div>
                    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {tracking.map(([title, sub, done], i) => (
                            <li key={title} style={{ display: 'flex', gap: 12 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 9999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: done ? 'var(--brand-solid)' : 'transparent',
                                            border: done ? 0 : '2px solid var(--border-strong)',
                                            color: 'var(--brand-on-solid)',
                                        }}
                                    >
                                        {done && <Icon name="check" size={16} />}
                                    </div>
                                    {i < tracking.length - 1 && (
                                        <div style={{ width: 2, flex: 1, minHeight: 20, background: done ? 'var(--brand-solid)' : 'var(--border-strong)' }} />
                                    )}
                                </div>
                                <div style={{ paddingBottom: 12 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: done ? 'var(--text-body)' : 'var(--text-muted)' }}>{title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <Button variant="neutral" size="lg" fullWidth onClick={reset}>
                    Pedir otro retiro
                </Button>
            </>
        );
    }

    return (
        <div className="no-scrollbar" style={screen.wrap}>
            <Enter key={step} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {body}
            </Enter>
        </div>
    );
};

export default Pickup;
