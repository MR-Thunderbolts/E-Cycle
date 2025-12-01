import { UserLevel } from '@/types';
import { LEVEL_THRESHOLDS } from '@/constants';

/**
 * Calculate user level based on points and completed achievements
 */
export const calculateLevel = (points: number, completedAchievements: number): UserLevel => {
    for (const threshold of LEVEL_THRESHOLDS) {
        if (points >= threshold.points && completedAchievements >= threshold.achievements) {
            return threshold.name;
        }
    }
    return 'Descubridor';
};
