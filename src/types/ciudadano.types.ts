export type MaterialId = 'celulares' | 'baterias' | 'laptops' | 'cables';

/** What a clean point accepts and what each unit is worth when scanned. */
export interface MaterialCategory {
    id: MaterialId;
    label: string;
    pointsPerUnit: number;
    iconName: string;
    /** Average weight per unit, kg. */
    kg: number;
    /** «¿Sabías que…?» fact shown after a drop-off. */
    fact: string;
}

export interface CleanPoint {
    id: string;
    name: string;
    address: string;
    hours: string;
    type: 'Punto limpio' | 'Tienda asociada';
    dist: string;
    materials: MaterialId[];
    /** Position on the map canvas, in % of its width/height. */
    x: number;
    y: number;
}

export interface MapPosition {
    x: number;
    y: number;
}

/** Home pickup: weight is estimated from an average per unit, no scale needed. */
export interface PickupItem {
    id: string;
    label: string;
    hint?: string;
    icon: string;
    kg: number;
}

/** The truck leaves when the sector (the manager's clean points in a comuna) completes its load. */
export interface Sector {
    name: string;
    kg: number;
    capacityKg: number;
}

export interface Campaign {
    icon: string;
    title: string;
    body: string;
    /** Material chip that tapping the notice turns on. */
    chip: MaterialId;
}

export interface Reward {
    id: string;
    title: string;
    partner: string;
    cost: number;
    icon: string;
}

export interface HistoryEntry {
    id: string;
    title: string;
    sub: string;
    /** Positive for drop-offs, negative for redemptions. */
    points: number;
    icon: string;
}

export interface Address {
    id: string;
    label: string;
    line: string;
    comuna: string;
}

export interface Profile {
    name: string;
    phone: string;
}
