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
    /** One-line summary for lists. */
    hours: string;
    /** Full schedule, one line per group of days; shown in the point detail. */
    schedule?: string[];
    /** False when the point only serves its own community (e.g. a campus). Defaults to open. */
    community?: boolean;
    type: 'Punto limpio' | 'Punto municipal' | 'Tienda asociada' | 'Centro de salud';
    dist: string;
    materials: MaterialId[];
    /** Position on the map canvas, in % of its width/height. */
    x: number;
    y: number;
}

/** A shop that gives a discount in exchange for points. Example data until partners are signed. */
export interface Merchant {
    id: string;
    name: string;
    /** What it sells, e.g. «Accesorios para celular». */
    category: string;
    /** The reward it honours, e.g. «20% en un cable USB-C». */
    benefit: string;
    /** «5 min» in the list, «A 5 min a pie» in the detail. */
    minutes: number;
    hours: string;
    address: string;
    /** Position on the map canvas, in %. */
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
