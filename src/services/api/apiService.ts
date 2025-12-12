import { User, Transaction } from '@/types';
import { RECYCLE_CATEGORIES } from '@/constants';
import { calculateLevel } from '@/utils';

// Mock initial user data
const MOCK_USER: User = {
    uid: 'user_123',
    name: 'Alexandra',
    email: 'fakemail@gmail.com',
    points: 0,
    level: 'Descubridor',
    itemsThisMonth: 4, // Starts close to unlocking 1.2x
    activeMultiplier: 1,
    // Recycling stats for perk completion
    computersRecycled: 0,
    phonesRecycled: 2, // Unlocks Cazador de Circuitos (needs 1 computer OR 2 phones)
    batteriesRecycled: 5,
    cablesRecycledKg: 2,
    impact: { co2: 85, trees: 4 },
    history: [
        { id: 'tx_init_1', type: 'deposit', title: 'Reciclaje Inicial', date: 'Oct 28, 2025', points: 50, icon: 'eco' }
    ],
    achievements: [
        { id: 'first_recycle', title: 'Recicla tu primer objeto', description: 'Escanea y deposita un ítem de e-waste en un punto designado', progress: 1, max: 1, completed: true, reward: 50, icon: 'bolt', category: 'unica' },
        { id: 'phone_expert', title: 'Llamado de Emergencia', description: 'Recicla 5 smartphones antiguos.', progress: 1, max: 5, completed: false, reward: 500, icon: 'workspace_premium', isMedal: true, category: 'mensual' },
        { id: 'battery_saver', title: 'Guardian de Energía', description: 'Recicla 10 baterías.', progress: 3, max: 10, completed: false, reward: 100, icon: 'battery_charging_full', category: 'semanal' },
        { id: 'recycle_master', title: 'Reciclador Experto', description: 'Completa 20 depósitos exitosos.', progress: 1, max: 20, completed: false, reward: 1000, icon: 'star', category: 'mensual' }
    ]
};

const getMultiplier = (items: number): number => {
    if (items >= 10) return 2;
    if (items >= 5) return 1.5;
    return 1;
};

/**
 * API Service for user and recycling operations
 */
export const apiService = {
    /**
     * Fetch user data from localStorage or return mock user
     */
    fetchUser: async (): Promise<User> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem('e-cycle-user');
                if (stored) {
                    const parsedUser = JSON.parse(stored);
                    // Recalc level ensures consistency
                    const completed = parsedUser.achievements.filter((a: any) => a.completed).length;
                    parsedUser.level = calculateLevel(parsedUser.points, completed);
                    // Ensure new fields exist
                    if (parsedUser.itemsThisMonth === undefined) parsedUser.itemsThisMonth = 4;
                    if (parsedUser.activeMultiplier === undefined) parsedUser.activeMultiplier = 1;

                    resolve(parsedUser);
                } else {
                    resolve(MOCK_USER);
                }
            }, 500);
        });
    },

    /**
     * Submit recycling dropoff and update user points
     */
    submitDropoff: async (currentUser: User, items: Record<string, number>, basePoints: number): Promise<User> => {
        return new Promise((resolve) => {
            const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const newTransactions: Transaction[] = [];

            const itemCount = Object.values(items).reduce((a, b) => a + b, 0);
            const newItemsThisMonth = (currentUser.itemsThisMonth || 0) + itemCount;
            const newMultiplier = getMultiplier(newItemsThisMonth);

            // Apply multiplier to points
            const finalPoints = Math.round(basePoints * newMultiplier);

            Object.entries(items).forEach(([catId, count]) => {
                if (count > 0) {
                    const category = RECYCLE_CATEGORIES.find(c => c.id === catId);
                    if (category) {
                        newTransactions.push({
                            id: `tx_${Date.now()}_${catId}`,
                            type: 'deposit',
                            title: `Reciclaste ${count} ${category.label}`,
                            date: date,
                            points: Math.round(category.pointsPerUnit * count * newMultiplier),
                            icon: category.iconName
                        });
                    }
                }
            });

            const updatedAchievements = currentUser.achievements.map(ach => {
                let newProgress = ach.progress;
                if (ach.id === 'phone_expert' && items['celulares']) newProgress += items['celulares'];
                if (ach.id === 'battery_saver' && items['baterias']) newProgress += items['baterias'];
                if (ach.id === 'recycle_master') newProgress += 1;
                return { ...ach, progress: newProgress, completed: newProgress >= ach.max };
            });

            const completedCount = updatedAchievements.filter(a => a.completed).length;
            const newTotalPoints = currentUser.points + finalPoints;
            const newLevel = calculateLevel(newTotalPoints, completedCount);

            // Update perk-related recycling stats
            const newPhonesRecycled = (currentUser.phonesRecycled || 0) + (items['celulares'] || 0);
            const newComputersRecycled = (currentUser.computersRecycled || 0) + (items['laptops'] || 0);
            const newBatteriesRecycled = (currentUser.batteriesRecycled || 0) + (items['baterias'] || 0);
            const newCablesRecycledKg = (currentUser.cablesRecycledKg || 0) + (items['cables'] || 0); // Assuming 1 cable = 1 kg estimate

            const updatedUser: User = {
                ...currentUser,
                points: newTotalPoints,
                level: newLevel,
                itemsThisMonth: newItemsThisMonth,
                activeMultiplier: newMultiplier,
                // Perk stats
                phonesRecycled: newPhonesRecycled,
                computersRecycled: newComputersRecycled,
                batteriesRecycled: newBatteriesRecycled,
                cablesRecycledKg: newCablesRecycledKg,
                history: [...newTransactions, ...currentUser.history],
                achievements: updatedAchievements,
                impact: {
                    co2: currentUser.impact.co2 + (itemCount * 0.5),
                    trees: currentUser.impact.trees + (finalPoints > 200 ? 1 : 0)
                }
            };

            localStorage.setItem('e-cycle-user', JSON.stringify(updatedUser));
            resolve(updatedUser);
        });
    },

    /**
     * Redeem a coupon and deduct points
     */
    redeemCoupon: async (currentUser: User, cost: number): Promise<User | null> => {
        return new Promise((resolve) => {
            if (currentUser.points >= cost) {
                const updatedUser = { ...currentUser, points: currentUser.points - cost };
                localStorage.setItem('e-cycle-user', JSON.stringify(updatedUser));
                resolve(updatedUser);
            } else {
                resolve(null);
            }
        });
    }
};
