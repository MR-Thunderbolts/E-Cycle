import React, { useEffect, useRef, useState } from 'react';
import type { MaterialCategory } from '@/types';
import { Badge, Button, Counter, Enter, Icon, IconButton, screen } from '@/components/ui';
import { CLEAN_POINTS, MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { fmtNumber } from '@/utils/format';

type Stage = 'camera' | 'scanning' | 'declare' | 'validating' | 'done';
type Cam = 'idle' | 'on' | 'denied' | 'unsupported';

/** «Leyendo código…» stays for 1.4 s. */
const READ_MS = 1400;

/** The container «checks» the delivery in these steps, one every STEP_MS. */
const VALIDATION_STEPS = ['Conectando con el contenedor', 'Pesando lo que depositaste', 'Validando tu entrega'];
const STEP_MS = 1100;

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
    const [vstep, setVstep] = useState(0);

    const video = useRef<HTMLVideoElement>(null);
    const stream = useRef<MediaStream | null>(null);
    const [cam, setCam] = useState<Cam>('idle');
    const [torchOk, setTorchOk] = useState(false);

    // The QR identifies the clean point; the demo uses the first one.
    const point = CLEAN_POINTS[0];
    const accepted = MATERIAL_CATEGORIES.filter((c) => point.materials.includes(c.id));

    useEffect(() => {
        if (stage !== 'scanning') return;
        const t = setTimeout(() => setStage('declare'), READ_MS);
        return () => clearTimeout(t);
    }, [stage]);

    // Rear camera while the viewfinder is on screen; released as soon as it is not.
    const viewing = stage === 'camera' || stage === 'scanning';
    useEffect(() => {
        if (!viewing) return;
        if (!navigator.mediaDevices?.getUserMedia) {
            setCam('unsupported');
            return;
        }
        let cancelled = false;
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
            .then((s) => {
                if (cancelled) return s.getTracks().forEach((t) => t.stop());
                stream.current = s;
                const caps = s.getVideoTracks()[0]?.getCapabilities?.() as { torch?: boolean } | undefined;
                setTorchOk(!!caps?.torch);
                setCam('on');
            })
            .catch(() => !cancelled && setCam('denied'));
        return () => {
            cancelled = true;
            stream.current?.getTracks().forEach((t) => t.stop());
            stream.current = null;
            setCam('idle');
            setTorch(false);
            setTorchOk(false);
        };
    }, [viewing]);

    // Attach the stream once the <video> exists.
    useEffect(() => {
        if (cam === 'on' && video.current && stream.current) {
            video.current.srcObject = stream.current;
            video.current.play().catch(() => {});
        }
    }, [cam, stage]);

    // A real QR in front of the camera counts as a scan (where the browser can detect barcodes).
    useEffect(() => {
        const Detector = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<unknown[]> } }).BarcodeDetector;
        if (cam !== 'on' || stage !== 'camera' || !Detector) return;
        const det = new Detector({ formats: ['qr_code'] });
        const t = setInterval(() => {
            const v = video.current;
            if (v && v.readyState >= 2) det.detect(v).then((r) => r.length && setStage('scanning')).catch(() => {});
        }, 500);
        return () => clearInterval(t);
    }, [cam, stage]);

    const toggleTorch = () => {
        const next = !torch;
        stream.current
            ?.getVideoTracks()[0]
            ?.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] })
            .then(() => setTorch(next))
            .catch(() => {});
    };

    // Validation screen: the container «checks» the delivery, then the points land.
    useEffect(() => {
        if (stage !== 'validating') return;
        setVstep(0);
        const timers = VALIDATION_STEPS.map((_, i) => setTimeout(() => setVstep(i + 1), (i + 1) * STEP_MS));
        const end = setTimeout(finish, VALIDATION_STEPS.length * STEP_MS + 500);
        return () => [...timers, end].forEach(clearTimeout);
    }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

    const total = accepted.reduce((s, c) => s + (qty[c.id] || 0) * c.pointsPerUnit, 0);
    const count = Object.values(qty).reduce((a, b) => a + b, 0);
    const [top] = accepted
        .filter((c) => qty[c.id])
        .sort((a, b) => qty[b.id] * b.pointsPerUnit - qty[a.id] * a.pointsPerUnit) as (MaterialCategory | undefined)[];

    const scan = () => setStage('scanning');

    const confirm = () => setStage('validating');

    const finish = () => {
        const detail = accepted
            .filter((c) => qty[c.id])
            .map((c) => `${qty[c.id]} ${c.label.toLowerCase()}`)
            .join(', ');
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
                        background: '#000',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <video
                        ref={video}
                        muted
                        playsInline
                        autoPlay
                        aria-hidden="true"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: cam === 'on' ? 1 : 0, transition: 'opacity var(--dur-base)' }}
                    />
                    <div style={corner({ top: '18%', left: '18%', borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 })} />
                    <div style={corner({ top: '18%', right: '18%', borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 })} />
                    <div style={corner({ bottom: '18%', left: '18%', borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 })} />
                    <div style={corner({ bottom: '18%', right: '18%', borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 })} />
                    <div style={{ position: 'absolute', left: '18%', right: '18%', top: '18%', bottom: '18%' }}>
                        <div
                            className="ec-keep-motion"
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
                    {torchOk && (
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                            <IconButton
                                icon={torch ? 'flashlight_off' : 'flashlight_on'}
                                ariaLabel={torch ? 'Apagar linterna' : 'Prender linterna'}
                                aria-pressed={torch}
                                onClick={toggleTorch}
                                style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}
                            />
                        </div>
                    )}
                </div>
                <p style={{ ...screen.p, maxWidth: 300 }}>
                    {cam === 'denied'
                        ? 'No pudimos usar la cámara. Permite el acceso en tu navegador o simula el escaneo.'
                        : cam === 'unsupported'
                          ? 'Este navegador no permite usar la cámara. Puedes simular el escaneo.'
                          : 'Apunta al código QR del punto limpio para declarar lo que entregas.'}
                </p>
                <Button size="lg" fullWidth icon="qr_code_scanner" iconPosition="left" disabled={stage === 'scanning'} onClick={scan}>
                    Simular escaneo
                </Button>
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

    if (stage === 'validating') {
        body = (
            <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center', paddingTop: 48 }}>
                <div style={{ position: 'relative', width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                        className="ec-keep-motion"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 9999,
                            border: '4px solid color-mix(in oklch, var(--brand-fg) 18%, transparent)',
                            borderTopColor: 'var(--brand-fg)',
                            animation: 'ec-spin 1.1s linear infinite',
                        }}
                    />
                    <div style={screen.ico('var(--brand-fg)', 72)}>
                        <Icon name="recycling" size={36} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h1 style={screen.h1}>Validando tu entrega</h1>
                    <p style={{ ...screen.p, maxWidth: 300 }}>El contenedor está verificando que dejaste lo que declaraste. Solo toma unos segundos.</p>
                </div>
                <div style={{ ...screen.card, width: '100%', textAlign: 'left', gap: 14 }}>
                    {VALIDATION_STEPS.map((label, i) => {
                        const state = i < vstep ? 'done' : i === vstep ? 'active' : 'todo';
                        return (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: state === 'todo' ? 0.45 : 1, transition: 'opacity var(--dur-base)' }}>
                                {state === 'done' ? (
                                    <Icon name="check_circle" filled style={{ color: 'var(--brand-fg)' }} />
                                ) : state === 'active' ? (
                                    <Icon name="progress_activity" className="ec-keep-motion" style={{ color: 'var(--brand-fg)', animation: 'ec-spin 1s linear infinite' }} />
                                ) : (
                                    <Icon name="radio_button_unchecked" style={{ color: 'var(--text-muted)' }} />
                                )}
                                <span style={{ fontSize: 14, fontWeight: state === 'active' ? 700 : 500 }}>{label}</span>
                            </div>
                        );
                    })}
                </div>
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
