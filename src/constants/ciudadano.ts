import type {
    Address,
    Campaign,
    CleanPoint,
    Merchant,
    HistoryEntry,
    MapPosition,
    MaterialCategory,
    PickupItem,
    Reward,
    Sector,
} from '@/types';

// Demo data for the citizen layer. In production, clean points (per comuna, with their
// materials), the sector load, rewards, history, the SMS OTP and pickup requests come from
// the backend; these values keep the same shape so the swap is local to this file.

export const COMUNAS = ['Puente Alto', 'La Florida', 'La Cisterna', 'El Bosque', 'San Bernardo'] as const;

/** Without a search, the list shows only the points in the person's comuna. */
export const HOME_COMUNA = 'La Florida';

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
    { id: 'celulares', label: 'Celulares', pointsPerUnit: 150, iconName: 'smartphone', kg: 0.2, fact: 'Un celular tiene cerca de 0,03 g de oro y 9 g de cobre. Recuperarlos evita abrir roca nueva en una mina.' },
    { id: 'baterias', label: 'Baterías', pointsPerUnit: 50, iconName: 'battery_full', kg: 0.05, fact: 'El litio de una batería se puede recuperar y volver a usar. Si va a la basura, puede incendiarse en el camión.' },
    { id: 'laptops', label: 'Notebooks', pointsPerUnit: 300, iconName: 'laptop_mac', kg: 2.2, fact: 'Una placa de notebook concentra más oro por kilo que muchas vetas que se explotan en Chile.' },
    { id: 'cables', label: 'Cables', pointsPerUnit: 20, iconName: 'electrical_services', kg: 0.15, fact: 'Un kilo de cables tiene alrededor de 400 g de cobre, el mismo metal que sale de Chuquicamata.' },
];

export const PICKUP_ITEMS: PickupItem[] = [
    { id: 'tv', label: 'Televisores o monitores', icon: 'tv', kg: 8 },
    { id: 'notebook', label: 'Notebooks', icon: 'laptop_mac', kg: 2.2 },
    { id: 'pc', label: 'Computadores de escritorio', icon: 'desktop_windows', kg: 7 },
    { id: 'small', label: 'Electrodomésticos pequeños', hint: 'Hervidor, microondas, secador', icon: 'blender', kg: 3 },
    { id: 'large', label: 'Electrodomésticos grandes', hint: 'Lavadora, refrigerador', icon: 'kitchen', kg: 45 },
    { id: 'phone', label: 'Celulares', icon: 'smartphone', kg: 0.2 },
    { id: 'cables', label: 'Cables y cargadores', icon: 'electrical_services', kg: 0.15 },
];

/** From this weight on, home pickup is free. */
export const FREE_PICKUP_KG = 5;

export const SECTOR: Sector = { name: 'Sector Vicuña Mackenna, La Florida', kg: 1080, capacityKg: 1500 };

export const CAMPAIGN: Campaign = {
    icon: 'cable',
    title: 'Esta semana: junta tus cables viejos',
    body: 'Los puntos limpios reciben cables y cargadores con puntos dobles hasta el domingo.',
    chip: 'cables',
};

// Real points from the Figma V2.1 frames (Explorar · Punto · …). Distances are demo values: there is
// no geolocation yet. Map positions (x, y) are demo too. «Horario por confirmar» has no schedule.
export const CLEAN_POINTS: CleanPoint[] = [
    {
        id: '4',
        name: 'Dir. de Medio Ambiente La Florida',
        address: 'Calle 3 N° 10050, La Florida',
        hours: 'Abierto de lunes a sábado',
        schedule: ['Lunes a jueves: 08:30 a 17:30', 'Viernes: 08:30 a 16:00', 'Sábado: 08:30 a 14:00'],
        type: 'Punto municipal',
        dist: 'A 6 min a pie',
        materials: ['celulares', 'baterias', 'cables'],
        x: 40,
        y: 78,
    },
    {
        id: '3',
        name: 'Dir. de Tránsito La Florida',
        address: 'Av. Vicuña Mackenna 10777, La Florida',
        hours: 'Abierto de lunes a sábado',
        schedule: ['Lunes a jueves: 08:30 a 17:30', 'Viernes: 08:30 a 16:00', 'Sábado: 08:30 a 14:00'],
        type: 'Tienda asociada',
        dist: 'A 12 min a pie',
        materials: ['celulares', 'laptops'],
        x: 72,
        y: 60,
    },
    {
        id: '1',
        name: 'Cesfam Los Castaños',
        address: 'Diagonal Los Castaños 5820, La Florida',
        hours: 'Abierto de lunes a sábado',
        schedule: ['Lunes a jueves: 08:00 a 20:00', 'Viernes: 08:00 a 19:00', 'Sábado: 09:00 a 13:00'],
        type: 'Centro de salud',
        dist: 'A 9 min a pie',
        materials: ['baterias', 'cables'],
        x: 54,
        y: 34,
    },
    {
        id: '2',
        name: 'DUOC UC Plaza Vespucio',
        address: 'Froilán Roa 731, La Florida',
        hours: 'Solo comunidad de la sede',
        schedule: ['Lunes a viernes: 09:00 a 21:00', 'Sábado: 09:00 a 14:00'],
        community: false,
        type: 'Punto limpio',
        dist: 'A 15 min a pie',
        materials: ['celulares', 'baterias', 'laptops', 'cables'],
        x: 22,
        y: 58,
    },
    {
        id: '5',
        name: 'DUOC UC Puente Alto',
        address: 'Av. Concha y Toro 1340, Puente Alto',
        hours: 'Solo comunidad de la sede',
        schedule: ['Lunes a viernes: 09:00 a 21:00', 'Sábado: 09:00 a 14:00'],
        community: false,
        type: 'Punto limpio',
        dist: 'A 18 min en auto',
        materials: ['celulares', 'baterias', 'laptops', 'cables'],
        x: 78,
        y: 92,
    },
    {
        id: '7',
        name: 'Edificio Consistorial La Cisterna',
        address: 'Av. Pedro Aguirre Cerda 0101, La Cisterna',
        hours: 'Abierto de lunes a viernes',
        schedule: ['Lunes a viernes: 09:00 a 14:00'],
        type: 'Tienda asociada',
        dist: 'A 14 min en auto',
        materials: ['celulares', 'baterias', 'cables'],
        x: 8,
        y: 34,
    },
    {
        id: '8',
        name: 'Centro Cívico Cultural El Bosque',
        address: 'Eleuterio Ramírez 10264, El Bosque',
        hours: 'Horario por confirmar',
        type: 'Punto municipal',
        dist: 'A 25 min en auto',
        materials: ['baterias', 'laptops', 'cables'],
        x: 10,
        y: 82,
    },
    {
        id: '10',
        name: 'Estadio Lo Blanco',
        address: 'Av. Lo Blanco 550, El Bosque',
        hours: 'Horario por confirmar',
        type: 'Punto municipal',
        dist: 'A 27 min en auto',
        materials: ['baterias', 'laptops', 'cables'],
        x: 16,
        y: 94,
    },
    {
        id: '9',
        name: 'DIMAO San Bernardo',
        address: 'América 281, San Bernardo',
        hours: 'Abierto de lunes a viernes',
        schedule: ['Lunes a viernes: 09:00 a 17:00'],
        type: 'Punto municipal',
        dist: 'A 32 min en auto',
        materials: ['celulares', 'baterias', 'laptops', 'cables'],
        x: -4,
        y: 104,
    },
    {
        id: '11',
        name: 'Edificio Consistorial San Bernardo',
        address: 'Dirección por confirmar, San Bernardo',
        hours: 'Horario por confirmar',
        type: 'Punto municipal',
        dist: 'A 33 min en auto',
        materials: ['celulares', 'baterias', 'laptops', 'cables'],
        x: -10,
        y: 98,
    },
    {
        id: '12',
        name: 'DUOC UC San Bernardo',
        address: 'Freire 857, San Bernardo',
        hours: 'Solo comunidad de la sede',
        schedule: ['Lunes a viernes: 08:30 a 20:30', 'Sábado: 09:00 a 14:00'],
        community: false,
        type: 'Punto limpio',
        dist: 'A 35 min en auto',
        materials: ['celulares', 'baterias', 'laptops', 'cables'],
        x: -14,
        y: 110,
    },
];

/** «Con beneficios»: example shops that honour the rewards. Real partners replace these. */
export const MERCHANTS: Merchant[] = [
    { id: 'm1', name: 'Tienda de accesorios (ejemplo)', category: 'Accesorios para celular', benefit: '20% en un cable USB-C', minutes: 5, hours: 'Lunes a sábado: 10:00 a 20:00', address: 'Dirección de ejemplo, La Florida', x: 46, y: 44 },
    { id: 'm2', name: 'Servicio técnico (ejemplo)', category: 'Servicio técnico', benefit: '$5.000 en reparación de celular', minutes: 8, hours: 'Lunes a sábado: 10:00 a 20:00', address: 'Dirección de ejemplo, La Florida', x: 28, y: 58 },
    { id: 'm3', name: 'Tienda de tecnología (ejemplo)', category: 'Tecnología', benefit: '15% en un cargador nuevo', minutes: 12, hours: 'Lunes a sábado: 10:00 a 20:00', address: 'Dirección de ejemplo, La Florida', x: 52, y: 63 },
];

export const USER_POSITION: MapPosition = { x: 38, y: 50 };

export const REWARDS: Reward[] = [
    { id: 'r1', title: '20% en un cable USB-C', partner: 'Tienda asociada', cost: 500, icon: 'cable' },
    { id: 'r2', title: '15% en un cargador nuevo', partner: 'Tienda asociada', cost: 800, icon: 'power' },
    { id: 'r3', title: '$5.000 en reparación de celular', partner: 'Servicio técnico asociado', cost: 1500, icon: 'build' },
    { id: 'r4', title: '10% en reparación de notebook', partner: 'Servicio técnico asociado', cost: 2500, icon: 'laptop_mac' },
];

/** Demo account returned on «Ingresar» (login). New accounts start from the guest balance. */
export const DEMO_ACCOUNT: { name: string; phone: string; points: number; addresses: Address[]; history: HistoryEntry[] } = {
    name: 'Trinidad Rojas',
    phone: '+56 9 8765 4321',
    points: 1850,
    addresses: [{ id: 'a1', label: 'Casa', line: 'Av. Vicuña Mackenna 6.100, depto 402', comuna: 'La Florida' }],
    history: [
        { id: 't1', title: 'Entrega en Dir. de Medio Ambiente La Florida', sub: '2 celulares · 12 ago', points: 300, icon: 'recycling' },
        { id: 't2', title: 'Canje: 20% en un cable USB-C', sub: '3 ago', points: -500, icon: 'redeem' },
        { id: 't3', title: 'Retiro a domicilio', sub: 'Notebook y cables · 28 jul', points: 450, icon: 'local_shipping' },
    ],
};

/** OTP accepted by the demo until the SMS backend is connected. */
export const DEMO_OTP = '1234';

/** Points per estimated kg on a home pickup (shown in the account nudge). */
export const PICKUP_POINTS_PER_KG = 60;

/** Guest points live in this browser for 30 days. */
export const GUEST_POINTS_TTL_MS = 30 * 24 * 60 * 60 * 1000;
