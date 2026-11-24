import { useCallback, useState } from 'react';
import type { MaterialId } from '@/types';

/**
 * Chips of the drawer. «Todos» and «Con beneficios» exclude each other and everything else;
 * the materials add up (a point matches if it takes any of them). With none picked it is «Todos».
 */
export const useExploreFilters = () => {
    const [benefits, setBenefits] = useState(false);
    const [materials, setMaterials] = useState<MaterialId[]>([]);

    const all = () => {
        setBenefits(false);
        setMaterials([]);
    };
    const withBenefits = useCallback(() => {
        setBenefits(true);
        setMaterials([]);
    }, []);
    const toggleMaterial = (id: MaterialId) => {
        setBenefits(false);
        setMaterials((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
    };
    /** The campaign notice jumps to a single material. */
    const only = (id: MaterialId) => {
        setBenefits(false);
        setMaterials([id]);
    };

    return { benefits, materials, all, withBenefits, toggleMaterial, only };
};

export type ExploreFilters = ReturnType<typeof useExploreFilters>;
