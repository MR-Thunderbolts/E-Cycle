import { useMemo } from 'react';
import type { CleanPoint, MaterialId } from '@/types';
import { CLEAN_POINTS, COMUNAS, HOME_COMUNA } from '@/constants/ciudadano';
import { useCiudadano } from '@/hooks';

export interface Nearby {
    points: CleanPoint[];
    /** Section title in the search, e.g. «4 puntos cerca de ti» or «3 puntos cerca de Casa». */
    title: string;
    /** True when «near» is the profile address rather than where the person is. */
    fromAddress: boolean;
    comuna: string;
}

const inComuna = (p: CleanPoint, comuna: string) => p.address.toLowerCase().includes(comuna.toLowerCase());

/**
 * Points suggested when the search opens (v2.1, no drawer). Where «near» is:
 * 1. the current location, once the person turns it on («Usar mi ubicación actual»);
 * 2. otherwise the first address saved in their profile, if it is in a comuna with coverage;
 * 3. otherwise the demo position (the «Tú» dot on the map).
 * The material chips still apply.
 */
export const useNearby = (materials: MaterialId[]): Nearby => {
    const { located, signedIn, addresses } = useCiudadano();
    return useMemo(() => {
        const home = signedIn && !located ? addresses.find((a) => COMUNAS.some((c) => c === a.comuna)) : undefined;
        const comuna = home?.comuna ?? HOME_COMUNA;
        const points = CLEAN_POINTS.filter(
            (p) => inComuna(p, comuna) && (!materials.length || materials.some((m) => p.materials.includes(m))),
        );
        const count = points.length === 1 ? '1 punto' : `${points.length} puntos`;
        return { points, title: `${count} cerca de ${home ? home.label : 'ti'}`, fromAddress: !!home, comuna };
    }, [located, signedIn, addresses, materials]);
};
