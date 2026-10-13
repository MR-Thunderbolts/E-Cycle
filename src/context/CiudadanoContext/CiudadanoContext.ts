import { createContext } from 'react';
import type { Address, HistoryEntry, Profile, TabType } from '@/types';
import type { ToastVariant } from '@/components/ui/Toast';

export type RegisterMode = 'signup' | 'login';

/** A pending irreversible action, confirmed through a danger ConfirmDialog. */
export interface ConfirmRequest {
    title: string;
    description: string;
    label: string;
    icon: string;
    run: () => void;
}

export interface ToastState {
    open: boolean;
    message: string;
    variant: ToastVariant;
}

export interface CiudadanoContextValue {
    // Navigation and theme
    tab: TabType;
    go: (tab: TabType) => void;
    dark: boolean;
    setDark: (dark: boolean) => void;

    // Loading
    loading: boolean;
    showWelcome: boolean;
    closeWelcome: () => void;

    // Account and points
    signedIn: boolean;
    profile: Profile;
    /** Account points when signed in, browser (guest) points otherwise. */
    points: number;
    history: HistoryEntry[];
    signIn: (name: string | null, phone: string) => void;
    signOut: () => void;
    addPoints: (points: number, pointName: string, detail: string) => void;
    spend: (points: number, title: string) => void;

    // Saved data
    saved: string[];
    toggleSaved: (id: string) => void;
    removeSaved: (id: string) => void;
    addresses: Address[];
    addAddress: (address: Omit<Address, 'id'>) => void;
    removeAddress: (id: string) => void;
    sms: boolean;
    setSms: (on: boolean) => void;

    // Open layers
    account: boolean;
    openAccount: () => void;
    closeAccount: () => void;
    register: RegisterMode | false;
    openRegister: (mode: RegisterMode) => void;
    closeRegister: () => void;
    nudge: number | null;
    openNudge: (points: number) => void;
    closeNudge: () => void;
    confirm: ConfirmRequest | null;
    ask: (request: ConfirmRequest) => void;
    closeConfirm: () => void;

    // Feedback
    toast: ToastState;
    say: (message: string, variant?: ToastVariant) => void;
}

export const CiudadanoContext = createContext<CiudadanoContextValue | undefined>(undefined);
