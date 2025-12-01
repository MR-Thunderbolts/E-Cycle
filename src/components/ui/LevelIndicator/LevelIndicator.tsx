import React from 'react';
import { User } from '@/types';
import { LEVEL_THRESHOLDS } from '@/constants';

export interface LevelIndicatorProps {
    user: User;
    className?: string;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ user, className = '' }) => {
    const currentThresholdIndex = LEVEL_THRESHOLDS.findIndex(l => l.name === user.level);
    const nextThreshold = LEVEL_THRESHOLDS[currentThresholdIndex - 1]; // Array is ordered high to low
    const prevThreshold = LEVEL_THRESHOLDS[currentThresholdIndex];

    const completedAchievements = user.achievements.filter(a => a.completed).length;

    let pointsPercent = 100;
    let achievementsPercent = 100;
    let requirementsText = "¡Has alcanzado el nivel máximo!";
    let isMaxLevel = !nextThreshold;

    if (!isMaxLevel) {
        // Calculate Points Progress
        const pointsRange = nextThreshold.points - prevThreshold.points;
        const pointsProgress = user.points - prevThreshold.points;
        pointsPercent = Math.max(0, Math.min(100, (pointsProgress / pointsRange) * 100));

        // Calculate Achievements Progress
        const achRange = nextThreshold.achievements - prevThreshold.achievements;
        const achProgress = completedAchievements - prevThreshold.achievements;
        // Handle case where range is 0 (e.g. going from level A to B doesn't require extra achievements)
        achievementsPercent = achRange === 0 ? 100 : Math.max(0, Math.min(100, (achProgress / achRange) * 100));

        // Generate Text
        const pointsNeeded = Math.max(0, nextThreshold.points - user.points);
        const achNeeded = Math.max(0, nextThreshold.achievements - completedAchievements);

        const parts = [];
        if (pointsNeeded > 0) parts.push(`${pointsNeeded.toLocaleString()} puntos`);
        if (achNeeded > 0) parts.push(`${achNeeded} logros`);

        if (parts.length > 0) {
            requirementsText = `Faltan ${parts.join(' y ')} para ${nextThreshold.name}`;
        } else {
            requirementsText = `¡Listo para ascender a ${nextThreshold.name}!`;
        }
    }

    return (
        <div className={`bg-white dark:bg-dark-surface rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden transition-colors duration-300 ${className}`}>
            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-gray-700 shadow-lg shrink-0 relative">
                    <span className="material-symbols-rounded filled-icon text-3xl text-primary-dark dark:text-primary">workspace_premium</span>
                    {!isMaxLevel && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary text-primary-dark rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-700">
                            {currentThresholdIndex}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-text dark:text-dark-text text-lg truncate">{user.level}</h4>
                        <div className="bg-[#D0EBE8] dark:bg-primary/20 px-2.5 py-1 rounded-full text-xs font-bold text-primary-dark dark:text-primary-light flex items-center gap-1 shrink-0">
                            <span className="material-symbols-rounded filled-icon text-sm">bolt</span> {user.points.toLocaleString()}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{requirementsText}</p>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {/* Points Bar */}
                <div>
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <span>Puntos</span>
                        <span>{Math.round(pointsPercent)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full shadow-sm transition-all duration-1000 ease-out"
                            style={{ width: `${pointsPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* Achievements Bar */}
                <div>
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <span>Logros</span>
                        <span>{Math.round(achievementsPercent)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 rounded-full shadow-sm transition-all duration-1000 ease-out"
                            style={{ width: `${achievementsPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/0 rounded-full opacity-50 z-0"></div>
        </div>
    );
};
