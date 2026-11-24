import React from 'react';
import { Chip } from '@/components/ui';
import { MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import type { ExploreFilters } from '../useExploreFilters';

/** Drawer chips: Todos · Con beneficios (exclusive) and the materials (they add up). */
export const FilterChips: React.FC<{ filters: ExploreFilters }> = ({ filters }) => {
    const none = !filters.benefits && !filters.materials.length;
    return (
        <>
            <Chip active={none} onClick={filters.all}>
                Todos
            </Chip>
            <Chip active={filters.benefits} icon="redeem" className="ec-chip--keepcase" onClick={filters.withBenefits}>
                Con beneficios
            </Chip>
            {MATERIAL_CATEGORIES.map((c) => (
                <Chip key={c.id} active={filters.materials.includes(c.id)} onClick={() => filters.toggleMaterial(c.id)}>
                    {c.label}
                </Chip>
            ))}
        </>
    );
};
