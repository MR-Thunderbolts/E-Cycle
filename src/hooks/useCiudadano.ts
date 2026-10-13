import { useContext } from 'react';
import { CiudadanoContext, CiudadanoContextValue } from '@/context';

/** Shared state of the citizen layer (mobile and desktop). */
export const useCiudadano = (): CiudadanoContextValue => {
    const context = useContext(CiudadanoContext);
    if (!context) {
        throw new Error('useCiudadano must be used within a CiudadanoProvider');
    }
    return context;
};
