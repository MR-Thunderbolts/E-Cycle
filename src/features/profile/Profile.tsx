import React, { useEffect, useState } from 'react';
import { Button, Chip, Enter, Icon, IconButton, Input, MenuItem, Toggle } from '@/components/ui';
import { CLEAN_POINTS, COMUNAS } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';
import { fmtNumber, initials, plural } from '@/utils/format';

type View = 'main' | 'dirs' | 'saved';

const box: React.CSSProperties = { background: 'var(--surface-page)', borderRadius: 16, overflow: 'hidden', width: '100%' };
const muted: React.CSSProperties = { fontSize: 14, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 };
const itemRow: React.CSSProperties = { ...box, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px 12px 16px' };

/** Cuenta: a BottomSheet on mobile, a Modal on desktop. */
const Profile: React.FC = () => {
    const app = useCiudadano();
    const [view, setView] = useState<View>('main');
    const [draft, setDraft] = useState({ line: '', comuna: '' });

    // Start from the main view every time the panel opens.
    useEffect(() => {
        if (!app.account) {
            setView('main');
            setDraft({ line: '', comuna: '' });
        }
    }, [app.account]);

    const themeToggle = <Toggle checked={app.dark} onChange={() => app.setDark(!app.dark)} label="Tema oscuro" />;

    if (!app.signedIn) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 9999,
                        background: 'color-mix(in oklch, var(--ec-points) 15%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name="redeem" filled size={28} style={{ color: 'var(--ec-points)' }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Crea tu cuenta y suma puntos</h2>
                <p style={muted}>
                    Cada aparato que entregas suma puntos para canjear por descuentos en cargadores, cables y reparaciones. Sin cuenta puedes
                    buscar puntos y agendar retiros igual.
                </p>
                {app.points > 0 && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ec-points)' }}>
                        Tienes {fmtNumber(app.points)} puntos guardados en este navegador por 30 días
                    </div>
                )}
                <Button fullWidth icon="smartphone" iconPosition="left" onClick={() => app.openRegister('signup')}>
                    Crear cuenta con mi teléfono
                </Button>
                <Button variant="neutral" fullWidth onClick={() => app.openRegister('login')}>
                    {'Ya tengo cuenta · Ingresar'}
                </Button>
                <div style={box}>
                    <MenuItem icon="dark_mode" label="Tema oscuro" iconVariant="neutral" rightElement={themeToggle} border={false} />
                </div>
                <Button variant="ghost" fullWidth onClick={app.closeAccount}>
                    Ahora no
                </Button>
            </div>
        );
    }

    const sub = (title: string, children: React.ReactNode) => (
        <Enter style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconButton icon="arrow_back" variant="ghost" ariaLabel="Volver" onClick={() => setView('main')} />
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
            </div>
            {children}
        </Enter>
    );

    if (view === 'dirs') {
        return sub(
            'Mis direcciones',
            <>
                {app.addresses.map((a) => (
                    <div key={a.id} style={itemRow}>
                        <Icon name="home" style={{ color: 'var(--brand-fg)' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{a.label || 'Dirección'}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {a.line} · {a.comuna}
                            </div>
                        </div>
                        <IconButton
                            icon="delete"
                            variant="ghost"
                            ariaLabel={`Eliminar ${a.label || a.line}`}
                            onClick={() =>
                                app.ask({
                                    title: '¿Eliminar esta dirección?',
                                    description: `${a.line}, ${a.comuna}. Tendrás que escribirla de nuevo para tus próximos retiros.`,
                                    label: 'Eliminar dirección',
                                    icon: 'delete',
                                    run: () => app.removeAddress(a.id),
                                })
                            }
                        />
                    </div>
                ))}
                {!app.addresses.length && <p style={muted}>Aún no guardas direcciones.</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
                    <Input
                        label="Nueva dirección"
                        icon="add_location"
                        placeholder="Calle y número"
                        autoComplete="street-address"
                        value={draft.line}
                        onChange={(e) => setDraft({ ...draft, line: e.target.value })}
                    />
                    <div role="group" aria-label="Comuna" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {COMUNAS.map((c) => (
                            <Chip key={c} active={draft.comuna === c} onClick={() => setDraft({ ...draft, comuna: c })}>
                                {c}
                            </Chip>
                        ))}
                    </div>
                    <Button
                        variant="neutral"
                        fullWidth
                        icon="add"
                        iconPosition="left"
                        disabled={!draft.line.trim() || !draft.comuna}
                        onClick={() => {
                            app.addAddress({ label: `Dirección ${app.addresses.length + 1}`, line: draft.line.trim(), comuna: draft.comuna });
                            setDraft({ line: '', comuna: '' });
                        }}
                    >
                        Guardar dirección
                    </Button>
                </div>
            </>,
        );
    }

    if (view === 'saved') {
        const points = CLEAN_POINTS.filter((p) => app.saved.includes(p.id));
        return sub(
            'Puntos guardados',
            <>
                {points.map((p) => (
                    <div key={p.id} style={itemRow}>
                        <Icon name="recycling" filled style={{ color: 'var(--brand-fg)' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.address}</div>
                        </div>
                        <IconButton
                            icon="bookmark_remove"
                            variant="ghost"
                            ariaLabel={`Quitar ${p.name}`}
                            onClick={() =>
                                app.ask({
                                    title: '¿Quitar este punto?',
                                    description: `${p.name} dejará de aparecer en tus guardados. Puedes volver a guardarlo desde el mapa.`,
                                    label: 'Quitar punto',
                                    icon: 'bookmark_remove',
                                    run: () => app.removeSaved(p.id),
                                })
                            }
                        />
                    </div>
                ))}
                {!points.length && <p style={muted}>Aún no guardas puntos. Toca «Guardar punto» en el detalle de cualquier punto del mapa.</p>}
            </>,
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                    aria-hidden="true"
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 9999,
                        background: 'color-mix(in oklch, var(--brand-fg) 14%, transparent)',
                        color: 'var(--brand-fg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 18,
                    }}
                >
                    {initials(app.profile.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{app.profile.name}</h2>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{app.profile.phone}</div>
                </div>
                <IconButton icon="close" variant="ghost" ariaLabel="Cerrar" onClick={app.closeAccount} />
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderRadius: 16,
                    background: 'var(--surface-page)',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
                    <Icon name="bolt" filled size={18} style={{ color: 'var(--ec-points)' }} />
                    Tus puntos
                </span>
                <span style={{ fontSize: 20, fontWeight: 800 }}>{fmtNumber(app.points)}</span>
            </div>
            <div style={box}>
                <MenuItem
                    icon="home"
                    label="Mis direcciones"
                    description={plural(app.addresses.length, 'dirección', 'direcciones')}
                    onClick={() => setView('dirs')}
                />
                <MenuItem
                    icon="bookmark"
                    label="Puntos guardados"
                    description={plural(app.saved.length, 'punto', 'puntos')}
                    onClick={() => setView('saved')}
                />
                <MenuItem
                    icon="notifications"
                    label="Avisos por SMS"
                    description="Retiros y campañas"
                    rightElement={<Toggle checked={app.sms} onChange={() => app.setSms(!app.sms)} label="Avisos por SMS" />}
                />
                <MenuItem icon="dark_mode" label="Tema oscuro" rightElement={themeToggle} border={false} />
            </div>
            <Button
                variant="danger-ghost"
                fullWidth
                icon="logout"
                iconPosition="left"
                onClick={() =>
                    app.ask({
                        title: '¿Cerrar sesión?',
                        description: 'Tus puntos quedan guardados en tu cuenta. Para volver a entrar te pediremos un código por SMS.',
                        label: 'Cerrar sesión',
                        icon: 'logout',
                        run: app.signOut,
                    })
                }
            >
                Cerrar sesión
            </Button>
        </div>
    );
};

export default Profile;
