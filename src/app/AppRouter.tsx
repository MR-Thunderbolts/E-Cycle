import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { TabType } from '@/types';
import { Button, Enter, SplashScreen } from '@/components/ui';
import { MobileLayout, NAV_TABS, TopBar } from '@/components/layout';
import { DesktopExplore, Home } from '@/features/home';
import { Pickup } from '@/features/pickup';
import { Scan } from '@/features/scan';
import { Hub } from '@/features/hub';
import { useCanScan, useCiudadano, useIsDesktop } from '@/hooks';
import { initials } from '@/utils/format';
import { CiudadanoOverlays } from './CiudadanoOverlays';

const SPLASH_MS = 2300;

const SCREENS: Record<TabType, React.FC> = { explorar: Home, retiro: Pickup, escaner: Scan, ehub: Hub };

/** Escanear needs a camera: it is only offered on touch devices with media devices, never on desktop. */
const DESKTOP_TABS = NAV_TABS.filter((t) => t.id !== 'escaner');

const MobileApp: React.FC<{ canScan: boolean }> = ({ canScan }) => {
    const app = useCiudadano();
    const Screen = SCREENS[app.tab];
    return (
        <>
            <MobileLayout
                currentTab={app.tab}
                onTabChange={app.go}
                showNav={!app.register}
                tabs={canScan ? NAV_TABS : DESKTOP_TABS}
            >
                <Enter key={app.tab} style={{ position: 'absolute', inset: 0 }}>
                    <Screen />
                </Enter>
            </MobileLayout>
            <CiudadanoOverlays />
        </>
    );
};

const DesktopApp: React.FC = () => {
    const app = useCiudadano();
    const Screen = SCREENS[app.tab];
    const actions = app.signedIn ? (
        <button
            type="button"
            onClick={app.openAccount}
            aria-label="Tu cuenta"
            style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                border: '1px solid var(--border-card)',
                background: 'var(--surface-card)',
                color: 'var(--brand-fg)',
                fontWeight: 800,
                cursor: 'pointer',
            }}
        >
            {initials(app.profile.name)}
        </button>
    ) : (
        <>
            <Button variant="ghost" size="sm" onClick={() => app.openRegister('login')}>
                Ingresar
            </Button>
            <Button variant="primary" size="sm" onClick={() => app.openRegister('signup')}>
                Crear cuenta
            </Button>
        </>
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--surface-page)' }}>
            <TopBar items={DESKTOP_TABS} active={app.tab} onChange={app.go} actions={actions} />
            <main style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                {app.tab === 'explorar' ? (
                    <DesktopExplore />
                ) : (
                    <Enter key={app.tab} style={{ position: 'relative', height: '100%', maxWidth: 560, margin: '0 auto' }}>
                        <Screen />
                    </Enter>
                )}
            </main>
            <CiudadanoOverlays desktop />
        </div>
    );
};

export const AppRouter: React.FC = () => {
    const app = useCiudadano();
    const desktop = useIsDesktop();
    const canScan = useCanScan() && !desktop;
    const [splash, setSplash] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setSplash(false), SPLASH_MS);
        return () => clearTimeout(t);
    }, []);

    // Leaving a layout where Escanear is not offered.
    useEffect(() => {
        if (app.tab === 'escaner' && !canScan) app.go('explorar');
    }, [app.tab, canScan, app]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
            {desktop ? <DesktopApp /> : <MobileApp canScan={canScan} />}
            <AnimatePresence>{splash && <SplashScreen key="splash" />}</AnimatePresence>
        </div>
    );
};
