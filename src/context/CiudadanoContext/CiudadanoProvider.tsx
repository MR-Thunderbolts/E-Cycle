import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Address, HistoryEntry, Profile, TabType } from '@/types';
import type { ToastVariant } from '@/components/ui/Toast';
import { DEMO_ACCOUNT, GUEST_POINTS_TTL_MS } from '@/constants/ciudadano';
import { analytics } from '@/utils';
import { storage } from '@/utils/storage';
import { CiudadanoContext, ConfirmRequest, RegisterMode, ToastState } from './CiudadanoContext';

const KEY_THEME = 'theme';
const KEY_WELCOME = 'ec-welcome-seen';
const KEY_GUEST = 'ec-guest-points';

const LOADING_MS = 3200;
const WELCOME_MS = 3600;
const TOAST_MS = 3200;

interface GuestPoints {
    points: number;
    expiresAt: number;
}

const readGuestPoints = (): number => {
    const stored = storage.get<GuestPoints | null>(KEY_GUEST, null);
    if (!stored || stored.expiresAt < Date.now()) return 0;
    return stored.points;
};

const today = () => 'Hoy';

export const CiudadanoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tab, setTab] = useState<TabType>('explorar');
    const [dark, setDarkState] = useState(() => storage.get<string>(KEY_THEME, 'dark') !== 'light');

    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);

    const [signedIn, setSignedIn] = useState(false);
    const [profile, setProfile] = useState<Profile>({ name: '', phone: '' });
    const [guestPoints, setGuestPoints] = useState(readGuestPoints);
    const [accountPoints, setAccountPoints] = useState(0);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const [saved, setSaved] = useState<string[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [sms, setSmsState] = useState(true);

    const [account, setAccount] = useState(false);
    const [register, setRegister] = useState<RegisterMode | false>(false);
    const [nudge, setNudge] = useState<number | null>(null);
    const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

    const [toast, setToast] = useState<ToastState>({ open: false, message: '', variant: 'success' });
    const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Theme: dark by default, persisted.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        storage.set(KEY_THEME, dark ? 'dark' : 'light');
    }, [dark]);

    // Skeleton until 3.2 s; welcome card at 3.6 s, only on the first visit.
    useEffect(() => {
        const a = setTimeout(() => setLoading(false), LOADING_MS);
        const b = storage.get(KEY_WELCOME, false) ? undefined : setTimeout(() => setShowWelcome(true), WELCOME_MS);
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        };
    }, []);

    // Guest points stay 30 days in this browser.
    useEffect(() => {
        if (guestPoints > 0) storage.set(KEY_GUEST, { points: guestPoints, expiresAt: Date.now() + GUEST_POINTS_TTL_MS });
        else storage.remove(KEY_GUEST);
    }, [guestPoints]);

    useEffect(() => () => clearTimeout(toastTimer.current), []);

    const say = useCallback((message: string, variant: ToastVariant = 'success') => {
        setToast({ open: true, message, variant });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, open: false })), TOAST_MS);
    }, []);

    const go = useCallback((next: TabType) => {
        setTab((prev) => {
            if (prev !== next) analytics.tabChanged(prev, next);
            return next;
        });
    }, []);

    const setDark = (value: boolean) => {
        setDarkState(value);
        analytics.themeToggled(value);
    };

    const closeWelcome = () => {
        setShowWelcome(false);
        storage.set(KEY_WELCOME, true);
    };

    const openRegister = (mode: RegisterMode) => {
        setAccount(false);
        setNudge(null);
        setRegister(mode);
    };

    /** `name` is set on sign-up and null on log-in. Browser points move into the account. */
    const signIn = (name: string | null, phone: string) => {
        const isNew = name !== null;
        const base = isNew ? 0 : DEMO_ACCOUNT.points;
        setProfile({ name: isNew ? name.trim() : DEMO_ACCOUNT.name, phone: phone || DEMO_ACCOUNT.phone });
        setAccountPoints(base + guestPoints);
        if (!isNew) {
            setHistory((h) => [...h, ...DEMO_ACCOUNT.history]);
            setAddresses((a) => (a.length ? a : DEMO_ACCOUNT.addresses));
        }
        setSignedIn(true);
        setRegister(false);
        if (isNew) say(guestPoints ? `Cuenta creada. Sumamos tus ${guestPoints} puntos.` : 'Cuenta creada.');
        else say('Hola de nuevo.');
        setGuestPoints(0);
    };

    const signOut = () => {
        setSignedIn(false);
        setAccount(false);
        setAccountPoints(0);
        setHistory([]);
        setAddresses([]);
        setSaved([]);
        say('Cerraste sesión.', 'info');
    };

    const addPoints = (points: number, pointName: string, detail: string) => {
        (signedIn ? setAccountPoints : setGuestPoints)((p) => p + points);
        setHistory((h) => [
            { id: `n${Date.now()}`, title: `Entrega en ${pointName}`, sub: `${detail} · ${today()}`, points, icon: 'recycling' },
            ...h,
        ]);
    };

    const spend = (points: number, title: string) => {
        setAccountPoints((p) => p - points);
        setHistory((h) => [{ id: `s${Date.now()}`, title: `Canje: ${title}`, sub: today(), points: -points, icon: 'redeem' }, ...h]);
    };

    const toggleSaved = (id: string) => {
        const on = saved.includes(id);
        setSaved(on ? saved.filter((x) => x !== id) : [...saved, id]);
        say(on ? 'Quitaste el punto de tus guardados.' : 'Punto guardado.', on ? 'info' : 'success');
    };

    const removeSaved = (id: string) => {
        setSaved((x) => x.filter((y) => y !== id));
        say('Quitaste el punto de tus guardados.', 'info');
    };

    const addAddress = (address: Omit<Address, 'id'>) => {
        setAddresses((x) => [...x, { id: `a${Date.now()}`, ...address }]);
        say('Dirección guardada.');
    };

    const removeAddress = (id: string) => {
        setAddresses((x) => x.filter((y) => y.id !== id));
        say('Dirección eliminada.', 'info');
    };

    const setSms = (on: boolean) => {
        setSmsState(on);
        say(on ? 'Te avisaremos por SMS.' : 'Ya no te enviaremos SMS.', 'info');
    };

    return (
        <CiudadanoContext.Provider
            value={{
                tab,
                go,
                dark,
                setDark,
                loading,
                showWelcome,
                closeWelcome,
                signedIn,
                profile,
                points: signedIn ? accountPoints : guestPoints,
                history,
                signIn,
                signOut,
                addPoints,
                spend,
                saved,
                toggleSaved,
                removeSaved,
                addresses,
                addAddress,
                removeAddress,
                sms,
                setSms,
                account,
                openAccount: () => {
                    setAccount(true);
                    analytics.profileOpened();
                },
                closeAccount: () => setAccount(false),
                register,
                openRegister,
                closeRegister: () => setRegister(false),
                nudge,
                openNudge: setNudge,
                closeNudge: () => setNudge(null),
                confirm,
                ask: setConfirm,
                closeConfirm: () => setConfirm(null),
                toast,
                say,
            }}
        >
            {children}
        </CiudadanoContext.Provider>
    );
};
