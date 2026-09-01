import { UserLevel } from '@/types';

export const LEVEL_THRESHOLDS = [
    {
        name: 'Reactivador',
        points: 5000,
        achievements: 4,
        rewards: [
            'Multiplicador x2.0 permanente',
            'Avatar Dorado Exclusivo',
            'Prioridad en retiros a domicilio',
            'Acceso a Eventos VIP'
        ]
    },
    {
        name: 'Recolector',
        points: 2500,
        achievements: 3,
        rewards: [
            'Multiplicador x1.5 permanente',
            'Badge de Plata en perfil',
            'Descuento 50% en Envios Eco',
            'Soporte Prioritario'
        ]
    },
    {
        name: 'Ensamblador',
        points: 1000,
        achievements: 2,
        rewards: [
            'Multiplicador x1.2 permanente',
            'Acceso a E-Hub (Completo)',
            'Notificaciones de Puntos Flash'
        ]
    },
    {
        name: 'Descubridor',
        points: 0,
        achievements: 0,
        rewards: [
            'Multiplicador x1.0 base',
            'Acceso al Mapa de Reciclaje',
            'Historial de Impacto'
        ]
    }
] as const;
