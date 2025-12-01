export interface RecyclePoint {
    id: string;
    name: string;
    address: string;
    distance: string;
    status: 'Abierto ahora' | 'Cerrado';
    hours: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: 'Punto Limpio' | 'Tienda Asociada';
    logo?: string;
    promoText?: string;
    materials?: string[];
}

export interface ItemCategory {
    id: string;
    label: string;
    pointsPerUnit: number;
    iconName: string;
}

export interface Coupon {
    id: string;
    title: string;
    cost: number;
    image: string;
    category: string;
}
