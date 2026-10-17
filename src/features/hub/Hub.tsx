import React, { useState } from 'react';
import type { Reward } from '@/types';
import { BottomSheet, Button, Enter, Icon, ProgressBar, Tabs, screen } from '@/components/ui';
import { REWARDS } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { fmtNumber } from '@/utils/format';

type HubTab = 'canjear' | 'historial';

const row: React.CSSProperties = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
};

/** Voucher code shown after a redemption, e.g. EC-7K2QF. Real codes come from the backend. */
const voucherCode = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    return `EC-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
};

/** Beneficios: balance, rewards to redeem and history. */
const Hub: React.FC = () => {
    const app = useCiudadano();
    const pts = app.points;
    const [tab, setTab] = useState<HubTab>('canjear');
    const [pick, setPick] = useState<Reward | null>(null);
    const [code, setCode] = useState<string | null>(null);

    const open = (r: Reward) => setPick(r);
    const redeem = () => {
        if (!pick) return;
        app.spend(pick.cost, pick.title);
        setCode(voucherCode());
    };
    const close = () => {
        setPick(null);
        setCode(null);
    };

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <div className="no-scrollbar" style={screen.wrap}>
                <Enter style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h1 style={screen.h1}>Beneficios</h1>
                    <div style={{ ...screen.card, alignItems: 'center', textAlign: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
                            <Icon name="bolt" filled size={18} style={{ color: 'var(--ec-points)' }} />
                            Tus puntos
                        </div>
                        <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{fmtNumber(pts)}</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                            {app.signedIn ? 'Guardados en tu cuenta' : 'Guardados 30 días en este navegador'}
                        </div>
                        {!app.signedIn && (
                            <div style={{ marginTop: 8, width: '100%' }}>
                                <Button size="md" fullWidth icon="smartphone" iconPosition="left" onClick={() => app.openRegister('signup')}>
                                    Crear cuenta para no perderlos
                                </Button>
                            </div>
                        )}
                    </div>
                    <Tabs
                        tabs={[
                            { id: 'canjear', label: 'Canjear' },
                            { id: 'historial', label: 'Historial' },
                        ]}
                        activeTab={tab}
                        onTabChange={(id) => setTab(id as HubTab)}
                    />
                    <Enter key={tab} role="tabpanel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {tab === 'canjear' &&
                            REWARDS.map((r) => {
                                const ok = pts >= r.cost;
                                return (
                                    <div key={r.id} style={{ ...row, flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={screen.ico(ok ? 'var(--brand-fg)' : 'var(--text-muted)')}>
                                                <Icon name={ok ? r.icon : 'lock'} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: ok ? 'var(--text-body)' : 'var(--text-muted)' }}>{r.title}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                    {r.partner} · {fmtNumber(r.cost)} puntos
                                                </div>
                                            </div>
                                            {ok && (
                                                <Button size="md" variant="neutral" onClick={() => open(r)}>
                                                    Canjear
                                                </Button>
                                            )}
                                        </div>
                                        {!ok && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <ProgressBar value={pts} max={r.cost} size="sm" />
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Te faltan {fmtNumber(r.cost - pts)} puntos</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        {tab === 'historial' && (
                            <>
                                {app.history.map((h) => (
                                    <div key={h.id} style={row}>
                                        <div style={screen.ico(h.points > 0 ? 'var(--brand-fg)' : 'var(--ec-points)')}>
                                            <Icon name={h.icon} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700 }}>{h.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.sub}</div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: h.points > 0 ? 'var(--ec-success)' : 'var(--text-muted)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {h.points > 0 ? '+' : '−'}
                                            {fmtNumber(Math.abs(h.points))}
                                        </span>
                                    </div>
                                ))}
                                {!app.history.length && (
                                    <p style={screen.p}>Aún no tienes movimientos. Escanea en un punto limpio o pide un retiro para sumar puntos.</p>
                                )}
                            </>
                        )}
                    </Enter>
                </Enter>
            </div>

            {/* Outside the scroll container so it covers the whole screen. */}
            <BottomSheet contained open={!!pick} onClose={close}>
                {pick &&
                    (code ? (
                        <Enter style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                            <div style={{ ...screen.ico('var(--ec-success)', 56), animation: 'ec-pop 450ms var(--ease-enter) both' }}>
                                <Icon name="check" size={32} />
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>¡Listo! Muestra este código</div>
                            <div
                                style={{
                                    fontSize: 28,
                                    fontWeight: 800,
                                    letterSpacing: '.12em',
                                    padding: '12px 20px',
                                    borderRadius: 16,
                                    border: '1px dashed var(--border-strong)',
                                }}
                            >
                                {code}
                            </div>
                            <p style={screen.p}>
                                {pick.title} en {pick.partner.toLowerCase()}. Vale por 30 días.
                            </p>
                            <Button fullWidth onClick={close}>
                                Entendido
                            </Button>
                        </Enter>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                            <div style={screen.ico('var(--brand-fg)', 56)}>
                                <Icon name={pick.icon} size={28} />
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{pick.title}</div>
                            <p style={screen.p}>
                                Usarás {fmtNumber(pick.cost)} de tus {fmtNumber(pts)} puntos.
                            </p>
                            {app.signedIn ? (
                                <Button fullWidth onClick={redeem}>
                                    Canjear
                                </Button>
                            ) : (
                                <>
                                    <p style={{ ...screen.p, fontSize: 12 }}>Para canjear necesitas una cuenta. Tus puntos se pasan solos.</p>
                                    <Button
                                        fullWidth
                                        icon="smartphone"
                                        iconPosition="left"
                                        onClick={() => {
                                            close();
                                            app.openRegister('signup');
                                        }}
                                    >
                                        Crear cuenta con mi teléfono
                                    </Button>
                                </>
                            )}
                            <Button variant="ghost" fullWidth onClick={close}>
                                Ahora no
                            </Button>
                        </div>
                    ))}
            </BottomSheet>
        </div>
    );
};

export default Hub;
