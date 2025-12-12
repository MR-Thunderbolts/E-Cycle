import { Achievement } from '@/types';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_recycle',
        title: 'Recicla tu primer objeto',
        description: 'Escanea y deposita un ítem de e-waste en un punto designado',
        progress: 0,
        max: 1,
        completed: false,
        reward: 50,
        icon: 'bolt',
        category: 'unica'
    },
    {
        id: 'phone_expert',
        title: 'Llamado de Emergencia',
        description: 'Recicla 5 smartphones antiguos.',
        progress: 0,
        max: 5,
        completed: false,
        reward: 500,
        icon: 'workspace_premium',
        isMedal: true,
        category: 'mensual'
    },
    {
        id: 'battery_saver',
        title: 'Guardian de Energía',
        description: 'Recicla 10 baterías.',
        progress: 0,
        max: 10,
        completed: false,
        reward: 100,
        icon: 'battery_charging_full',
        category: 'semanal'
    },
    {
        id: 'recycle_master',
        title: 'Reciclador Experto',
        description: 'Completa 20 depósitos exitosos.',
        progress: 0,
        max: 20,
        completed: false,
        reward: 1000,
        icon: 'star',
        category: 'mensual'
    }
];
