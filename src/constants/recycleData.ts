import { ItemCategory, RecyclePoint } from '@/types';

export const RECYCLE_CATEGORIES: ItemCategory[] = [
    { id: 'celulares', label: 'Celulares', pointsPerUnit: 150, iconName: 'smartphone' },
    { id: 'baterias', label: 'Baterías', pointsPerUnit: 50, iconName: 'battery_full' },
    { id: 'laptops', label: 'Laptops', pointsPerUnit: 300, iconName: 'laptop_mac' },
    { id: 'cables', label: 'Cables', pointsPerUnit: 20, iconName: 'electrical_services' },
];

export const RECYCLE_POINTS: RecyclePoint[] = [
    {
        id: '1',
        name: 'Copec',
        address: '123 Vicuña Mackena, La Florida',
        distance: '2.5 km',
        status: 'Abierto ahora',
        hours: '9:00 AM - 8:30 PM',
        coordinates: { lat: -33.505, lng: -70.61 },
        type: 'Punto Limpio',
        promoText: 'Obtén 500 puntos',
        materials: ['celulares', 'baterias', 'cables'],
        specialMission: {
            multiplier: 1.5,
            bonusPoints: 2000,
            logo: 'https://ui-avatars.com/api/?name=Copec&background=00796B&color=fff&size=128',
            title: 'Obten 2000 puntos',
            subtitle: 'Por reciclar con Copec'
        }
    },
    {
        id: '2',
        name: 'Metro Vicente Valdés',
        address: 'Av. Vicuña Mackenna 7890',
        distance: '1.2 km',
        status: 'Abierto ahora',
        hours: '6:00 AM - 11:00 PM',
        coordinates: { lat: -33.52, lng: -70.58 },
        type: 'Tienda Asociada',
        promoText: 'Gana 200 puntos',
        materials: ['celulares', 'laptops']
    },
    {
        id: '3',
        name: 'Santuario Schoenstatt',
        address: 'La Concepcion 123',
        distance: '3.8 km',
        status: 'Cerrado',
        hours: '10:00 AM - 6:00 PM',
        coordinates: { lat: -33.51, lng: -70.59 },
        type: 'Punto Limpio',
        promoText: 'Obtén 100 puntos',
        materials: ['baterias', 'cables']
    }
];
