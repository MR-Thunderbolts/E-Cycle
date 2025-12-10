import { Coupon } from '@/types';
import bottleImage from '@/assets/Bottle.png';
import headphonesImage from '@/assets/Headphones.png';

export const COUPONS: Coupon[] = [
    { id: 'c1', title: 'Botella reutilizable', cost: 1250, image: bottleImage, category: 'Producto' },
    { id: 'c2', title: 'Audífonos Bluetooth', cost: 2500, image: headphonesImage, category: 'Producto' },
    { id: 'c3', title: '20% Dscto Café', cost: 500, image: 'https://picsum.photos/200/200?random=3', category: 'Descuento' },
    { id: 'c4', title: 'Gift Card $5.000', cost: 5000, image: 'https://picsum.photos/200/200?random=4', category: 'Gift Card' },
    { id: 'c5', title: 'Donación Reforestemos', cost: 1000, image: 'https://picsum.photos/200/200?random=5', category: 'Donación' },
    { id: 'c6', title: 'Gift Card $10.000', cost: 9500, image: 'https://picsum.photos/200/200?random=6', category: 'Gift Card' }
];
