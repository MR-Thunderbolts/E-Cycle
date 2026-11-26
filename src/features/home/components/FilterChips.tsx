import React from 'react';
import { Chip } from '@/components/ui';
import { MATERIAL_CATEGORIES } from '@/constants/ciudadano';
import type { ExploreFilters } from '../useExploreFilters';

/**
 * Todos · Con beneficios (exclusive) and the materials (they add up).
 * `onMap`: the v2.1 row floating under the search bar, with a shadow so it reads over the map.
 */
export const FilterChips: React.FC<{ filters: ExploreFilters; onMap?: boolean }> = ({ filters, onMap }) => {
    const none = !filters.benefits && !filters.materials.length;
    const extra = onMap ? 'ec-chip--onmap' : '';
    return (
        <>
            <Chip active={none} className={extra} onClick={filters.all}>
                Todos
            </Chip>
            <Chip active={filters.benefits} icon="redeem" className={`ec-chip--keepcase ${extra}`} onClick={filters.withBenefits}>
                Con beneficios
            </Chip>
            {MATERIAL_CATEGORIES.map((c) => (
                <Chip key={c.id} active={filters.materials.includes(c.id)} className={extra} onClick={() => filters.toggleMaterial(c.id)}>
                    {c.label}
                </Chip>
            ))}
        </>
    );
};
