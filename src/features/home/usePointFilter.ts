import { useMemo } from 'react';
import type { CleanPoint, MapPosition, MaterialId } from '@/types';
import { CLEAN_POINTS, HOME_COMUNA } from '@/constants/ciudadano';

export type ChipId = 'todos' | MaterialId;

/** No search: the points in the person's comuna. With a search: matches by name, address or comuna. */
export const usePointFilter = (chip: ChipId, query: string): CleanPoint[] =>
    useMemo(() => {
        const q = query.trim().toLowerCase();
        const home = HOME_COMUNA.toLowerCase();
        return CLEAN_POINTS.filter(
            (p) =>
                (chip === 'todos' || p.materials.includes(chip)) &&
                (q ? `${p.name} ${p.address}`.toLowerCase().includes(q) : p.address.toLowerCase().includes(home)),
        );
    }, [chip, query]);

export const centroid = (list: CleanPoint[]): MapPosition | null =>
    list.length
        ? {
              x: list.reduce((s, p) => s + p.x, 0) / list.length,
              y: list.reduce((s, p) => s + p.y, 0) / list.length,
          }
        : null;
