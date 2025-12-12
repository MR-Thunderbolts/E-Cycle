import { Coupon } from '@/types';
import bottleImage from '@/assets/Bottle.png';
import headphonesImage from '@/assets/Headphones.png';
import descuentoImage from '@/assets/Descuento.png';
import arbolImage from '@/assets/Arbol.png';
import giftcard5Image from '@/assets/Giftcard5.png';
import giftcard10Image from '@/assets/Giftcard 10.png';

export const COUPONS: Coupon[] = [
    { id: 'c1', title: 'Botella reutilizable', cost: 1250, image: bottleImage, category: 'Producto' },
    { id: 'c2', title: 'Audífonos Bluetooth', cost: 2500, image: headphonesImage, category: 'Producto' },
    { id: 'c3', title: '20% Dscto Café', cost: 500, image: descuentoImage, category: 'Descuento' },
    { id: 'c4', title: 'Gift Card $5.000', cost: 5000, image: giftcard5Image, category: 'Gift Card' },
    { id: 'c5', title: 'Donación Reforestemos', cost: 1000, image: arbolImage, category: 'Donación' },
    { id: 'c6', title: 'Gift Card $10.000', cost: 9500, image: giftcard10Image, category: 'Gift Card' },
    // Special Perks (Monthly Rotating System)
    // Categories: flash (green), items_valor (purple), cantidades (orange)
    // Each month features one perk. Unlocked perks last 30 days from unlock date.
    {
        id: 'p1',
        title: 'Minero de Litio',
        cost: 0,
        image: 'battery_charging_full',
        category: 'Perk',
        isPerk: true,
        perkDuration: '30 días desde desbloqueo',
        description: 'Bonus +50 pts por cada batería reciclada.',
        unlockMission: 'Recicla 50 baterías.',
        perkColor: 'green',
        perkCategory: 'cantidades',
        isCurrentMonthPerk: false
    },
    {
        id: 'p2',
        title: 'Cazador de Circuitos',
        cost: 0,
        image: 'memory',
        category: 'Perk',
        isPerk: true,
        perkDuration: '30 días desde desbloqueo',
        description: 'Multiplicador x2 en residuos electrónicos.',
        unlockMission: 'Recicla 1 computador o 2 celulares.',
        perkColor: 'purple',
        perkCategory: 'items_valor',
        isCurrentMonthPerk: true
    },
    {
        id: 'p3',
        title: 'Guardián del Cobre',
        cost: 0,
        image: 'electrical_services',
        category: 'Perk',
        isPerk: true,
        perkDuration: '30 días desde desbloqueo',
        description: 'Acceso anticipado a eventos de reciclaje.',
        unlockMission: 'Recicla 15kg de cables.',
        perkColor: 'orange',
        perkCategory: 'cantidades',
        isCurrentMonthPerk: false
    }
];
