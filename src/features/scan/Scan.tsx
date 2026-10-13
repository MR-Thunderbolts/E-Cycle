import React, { useEffect, useRef, useState } from 'react';
import type { MaterialCategory } from '@/types';
import { Badge, Button, Counter, Enter, Icon, IconButton, screen } from '@/components/ui';
import { CLEAN_POINTS, MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { analytics } from '@/utils';
import { fmtNumber } from '@/utils/format';

type Stage = 'camera' | 'scanning' | 'declare' | 'done';

/** «Leyendo código…» stays for 1.4 s. */
const READ_MS = 1400;

const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'var(--ec-accent)',
    borderStyle: 'solid',
    borderWidth: 0,
    ...pos,
});

/** Escanear (mobile only): viewfinder → declare what you drop off → points earned. */
const Scan: React.FC = () => {
    const app = useCiudadano();
    const [stage, setStage] = useState<Stage>('camera');
    const [torch, setTorch] = useState(false);
    const [qty, setQty] = useState<Record<string, number>>({});
    const [earned, setEarned] = useState(0);
    const photo = useRef<HTMLInputElement>(null);

    // The QR identifies the clean point; the demo uses the first one.
    const point = CLEAN_POINTS[0];
    const accepted = MATERIAL_CATEGORIES.filter((c) => point.materials.includes(c.id));

    useEffect(() => {
        if (stage !== 'scanning') return;
        const t = setTimeout(() => setStage('declare'), READ_MS);
        return () => clearTimeout(t);
    }, [stage]);

    const total = accepted.reduce((s, c) => s + (qty[c.id] || 0) * c.pointsPerUnit, 0);
    const count = Object.values(qty).reduce((a, b) => a + b, 0);
    const [top] = accepted
        .filter((c) => qty[c.id])
        .sort((a, b) => qty[b.id] * b.pointsPerUnit - qty[a.id] * a.pointsPerUnit) as (MaterialCategory | undefined)[];

    const scan = () => {
        analytics.scanStarted();
        setStage('scanning');
    };

    const confirm = () => {
        const detail = accepted
            .filter((c) => qty[c.id])
            .map((c) => `${qty[c.id]} ${c.label.toLowerCase()}`)
            .join(', ');
        analytics.scanItemsEntered(qty, count, total);
        analytics.dropoffCompleted(total, count, 1);
        app.addPoints(total, point.name, detail);
        setEarned(total);
        setStage('done');
    };

    const reset = () => {
        setQty({});
        setStage('camera');
    };

    let body: React.ReactNode;

    if (stage === 'camera' || stage === 'scanning') {
        body = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
                <h1 style={screen.h1}>Escanear</h1>
                <div
                    style={{
                        width: '100%',
                        maxWidth: 360,
                        aspectRatio: '1',
                        borderRadius: 24,
                        background: torch ? '#2A2A2A' : '#000',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'background var(--dur-base)',
                    }}
                >
                    <div style={corner({ top: '18%', left: '18%', borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 })} />
                    <div style={corner({ top: '18%', right: '18%', borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 })} />
                    <div style={corner({ bottom: '18%', left: '18%', borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 })} />
                    <div style={corner({ bottom: '18%', right: '18%', borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 })} />
                    <div style={{ position: 'absolute', left: '18%', right: '18%', top: '18%', bottom: '18%' }}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: 2,
                                background: 'var(--ec-accent)',
                                boxShadow: '0 0 12px var(--ec-accent)',
                                animation: 'ec-scan 2s var(--ease-standard) infinite',
                            }}
                        />
                    </div>
                    {stage === 'scanning' && (
                        <Enter
                            role="status"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,.55)',
                                color: '#E2E2E2',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                        >
                            <Icon name="qr_code_2" size={48} style={{ color: 'var(--ec-accent)' }} />
                            <span style={{ fontSize: 14, fontWeight: 700 }}>Leyendo código…</span>
                        </Enter>
                    )}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        <IconButton
                            icon={torch ? 'flashlight_off' : 'flashlight_on'}
                            ariaLabel={torch ? 'Apagar linterna' : 'Prender linterna'}
                            aria-pressed={torch}
                            onClick={() => setTorch(!torch)}
                            style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}
                        />
                    </div>
                </div>
                <p style={{ ...screen.p, maxWidth: 300 }}>Apunta al código QR del punto limpio para declarar lo que entregas.</p>
                <Button size="lg" fullWidth icon="qr_code_scanner" iconPosition="left" disabled={stage === 'scanning'} onClick={scan}>
                    Simular escaneo
                </Button>
                <Button variant="neutral" size="lg" fullWidth icon="upload" iconPosition="left" onClick={() => photo.current?.click()}>
                    Subir una foto
                </Button>
                <input
                    ref={photo}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        if (e.target.files?.length) scan();
                        e.target.value = '';
                    }}
                />
            </div>
        );
    }

    if (stage === 'declare') {
        body = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44 }}>
                    <IconButton icon="arrow_back" variant="ghost" ariaLabel="Volver a la cámara" onClick={reset} />
                    <Badge variant="success" dot>
                        {point.name}
                    </Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h1 style={screen.h1}>¿Qué vas a depositar?</h1>
                    <p style={screen.p}>Cuenta cada aparato. Este punto recibe lo que ves abajo.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {accepted.map((c) => (
                        <div
                            key={c.id}
                            style={{
                                ...screen.card,
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 14,
                                borderColor: qty[c.id] ? 'var(--brand-fg)' : 'var(--border-card)',
                                transition: 'border-color var(--dur-base)',
                            }}
                        >
                            <div style={{ ...screen.ico('var(--brand-fg)'), background: 'color-mix(in oklch, var(--brand-fg) 12%, transparent)' }}>
                                <Icon name={c.iconName} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>{c.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.pointsPerUnit} puntos c/u</div>
                            </div>
                            <Counter value={qty[c.id] || 0} label={c.label} onChange={(v) => setQty({ ...qty, [c.id]: v })} />
                        </div>
                    ))}
                </div>
                <div style={{ ...screen.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{count === 1 ? '1 aparato' : `${count} aparatos`}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 18, fontWeight: 800 }}>
                        <Icon name="bolt" filled size={20} style={{ color: 'var(--ec-points)' }} />
                        {fmtNumber(total)} puntos
                    </span>
                </div>
                <Button size="lg" fullWidth disabled={!count} onClick={confirm}>
                    Confirmar entrega
                </Button>
            </div>
        );
    }

    if (stage === 'done') {
        body = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center', paddingTop: 12 }}>
                <div
                    style={{
                        ...screen.ico('var(--ec-points)', 72),
                        background: 'color-mix(in oklch, var(--ec-points) 18%, transparent)',
                        animation: 'ec-pop 450ms var(--ease-enter) both',
                    }}
                >
                    <Icon name="bolt" filled size={40} />
                </div>
                <Enter delay={0.12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}>¡Gracias por reciclar!</div>
                    {/* The «+» sits outside the flow so the number stays centred. */}
                    <div style={{ position: 'relative', fontSize: 56, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>
                        <span aria-hidden="true" style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-52%)', fontSize: 36, paddingRight: 2 }}>
                            +
                        </span>
                        {fmtNumber(earned)}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>puntos</div>
                </Enter>
                {!app.signedIn && (
                    <p style={{ ...screen.p, fontSize: 12 }}>Quedan guardados 30 días en este navegador. Crea tu cuenta para no perderlos.</p>
                )}
                {top && (
                    <Enter delay={0.24} style={{ ...screen.card, textAlign: 'left', width: '100%' }}>
                        <div style={{ ...screen.label, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-fg)' }}>
                            <Icon name="lightbulb" size={18} />
                            ¿Sabías que…?
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{top.fact}</p>
                    </Enter>
                )}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {!app.signedIn && (
                        <Button size="lg" fullWidth icon="smartphone" iconPosition="left" onClick={() => app.openRegister('signup')}>
                            Crear cuenta
                        </Button>
                    )}
                    <Button
                        variant={app.signedIn ? 'primary' : 'neutral'}
                        size="lg"
                        fullWidth
                        onClick={() => {
                            reset();
                            app.go('ehub');
                        }}
                    >
                        Ver mis beneficios
                    </Button>
                    <Button variant="ghost" fullWidth onClick={reset}>
                        Escanear otra vez
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="no-scrollbar" style={screen.wrap}>
            <Enter key={stage === 'scanning' ? 'camera' : stage}>{body}</Enter>
        </div>
    );
};

export default Scan;
