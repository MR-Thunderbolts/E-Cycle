export interface Transaction {
  id: string;
  type: 'deposit' | 'redemption';
  title: string;
  date: string; // ISO string or formatted date
  points: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  max: number;
  completed: boolean;
  reward: number;
  icon: string;
  isMedal?: boolean; // For "Phone Recycling Expert" visual style
  category: 'diaria' | 'semanal' | 'mensual' | 'unica'; // For filters
}

export type UserLevel = 'Descubridor' | 'Ensamblador' | 'Recolector' | 'Reactivador';

export interface User {
  uid: string;
  name: string;
  email: string;
  points: number;
  level: UserLevel;
  itemsThisMonth: number; // Track items deposited this month for multipliers
  activeMultiplier: number; // Current active multiplier (1, 1.2, 1.5, or 2)
  // Recycling stats for perk completion
  computersRecycled?: number;
  phonesRecycled?: number;
  batteriesRecycled?: number;
  cablesRecycledKg?: number;
  impact: {
    co2: number; // kg
    trees: number;
  };
  history: Transaction[];
  achievements: Achievement[];
}
