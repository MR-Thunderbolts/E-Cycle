import { Achievement } from '@/types';

// --- MISIONES (Recurrent/Weekly) ---
export const MISSIONS: Achievement[] = [
    {
        id: 'daily_scan',
        title: 'Escaneo del Día',
        description: 'Escanea al menos un objeto hoy.',
        progress: 0,
        max: 1,
        completed: false,
        reward: 25,
        icon: 'qr_code_scanner',
        category: 'diaria'
    },
    {
        id: 'daily_checkin',
        title: 'Conexión Eco',
        description: 'Abre la app para mantener tu racha.',
        progress: 1,
        max: 1,
        completed: true,
        reward: 10,
        icon: 'calendar_today',
        category: 'diaria'
    },
    {
        id: 'weekly_recycled_kg',
        title: 'Héroe Semanal',
        description: 'Recicla 5kg de e-waste esta semana.',
        progress: 0,
        max: 5,
        completed: false,
        reward: 200,
        icon: 'weight',
        category: 'semanal'
    },
    {
        id: 'weekly_explorer',
        title: 'Viajero Verde',
        description: 'Visita 2 puntos de reciclaje distintos esta semana.',
        progress: 0,
        max: 2,
        completed: false,
        reward: 300,
        icon: 'explore',
        category: 'semanal'
    },
    {
        id: 'weekly_variety',
        title: 'Responsabilidad Total',
        description: 'Recicla 3 categorías de materiales distintos.',
        progress: 0,
        max: 3,
        completed: false,
        reward: 400,
        icon: 'category',
        category: 'semanal'
    }
];

// --- LOGROS (Unique / Badges) ---
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_recycle',
        title: 'Primer Paso',
        description: 'Realiza tu primer reciclaje con E-Cycle.',
        progress: 0,
        max: 1,
        completed: false,
        reward: 50,
        icon: 'eco',
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
        icon: 'smartphone',
        isMedal: true,
        category: 'unica'
    },
    {
        id: 'energy_guardian',
        title: 'Guardián de Energía',
        description: 'Recicla 10 baterías de litio.',
        progress: 0,
        max: 10,
        completed: false,
        reward: 250,
        icon: 'battery_charging_full',
        isMedal: true,
        category: 'unica'
    },
    {
        id: 'cable_master',
        title: 'Adiós Enredos',
        description: 'Recicla 2 kilos de cables.',
        progress: 0,
        max: 2,
        completed: false,
        reward: 150,
        icon: 'cable',
        category: 'unica'
    },
    {
        id: 'urban_explorer',
        title: 'Explorador Urbano',
        description: 'Visita 3 puntos de reciclaje distintos.',
        progress: 0,
        max: 3,
        completed: false,
        reward: 300,
        icon: 'map',
        category: 'unica'
    },
    {
        id: 'green_ambassador',
        title: 'Embajador Verde',
        description: 'Invita a un amigo a unirse a E-Cycle.',
        progress: 0,
        max: 1,
        completed: false,
        reward: 1000,
        icon: 'group_add',
        isMedal: true,
        category: 'unica'
    }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = MISSIONS.slice(0, 4);
