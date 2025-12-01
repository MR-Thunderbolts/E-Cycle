import { UserLevel } from '@/types';

export const LEVEL_THRESHOLDS: { name: UserLevel; points: number; achievements: number }[] = [
    { name: 'Reactivador', points: 5000, achievements: 4 },
    { name: 'Recolector', points: 2500, achievements: 3 },
    { name: 'Ensamblador', points: 1000, achievements: 2 },
    { name: 'Descubridor', points: 0, achievements: 0 }
];
