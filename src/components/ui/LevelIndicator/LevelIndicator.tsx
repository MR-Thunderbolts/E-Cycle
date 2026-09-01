import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types';
import { LEVEL_THRESHOLDS } from '@/constants';
import { Avatar } from '@/components/ui/Avatar/Avatar';

export interface LevelIndicatorProps {
    user: User;
    className?: string;
    showUserIdentity?: boolean;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ user, className = '', showUserIdentity = false }) => {
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

    const userLevelNumber = LEVEL_THRESHOLDS.length - currentThresholdIndex;

    return (
        <div className={`bg-white dark:bg-dark-surface rounded-[40px] p-6 shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden transition-all duration-300 group hover:shadow-md ${className}`}>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none" />

            <div className="flex items-center gap-5 mb-6 relative z-10">
                {showUserIdentity ? (
                    /* 1. Integrated Avatar Badge */
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 blur-xl rounded-full scale-125" />
                        <div className="relative z-10">
                            <Avatar size="lg" className="w-16 h-16 !border-4 !border-white dark:!border-gray-800 shadow-xl" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary dark:bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-gray-800 shadow-md"
                            >
                                {userLevelNumber}
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    /* 2. Traditional Level Badge */
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 blur-xl rounded-full scale-150" />
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-gray-700 shadow-lg relative z-10 transition-transform group-hover:scale-105">
                            <span className="material-symbols-rounded filled-icon text-3xl text-primary-dark dark:text-accent">workspace_premium</span>
                            {!isMaxLevel && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary text-primary-dark rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-700">
                                    {userLevelNumber}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 min-w-0 text-left">
                    {showUserIdentity ? (
                        /* Combined Header: Name + Level Tag */
                        <>
                            <h2 className="font-extrabold text-text dark:text-dark-text text-xl truncate leading-tight mb-1.5">{user.name}</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-primary/5">
                                    <span className="material-symbols-rounded filled-icon text-primary dark:text-accent text-[12px]">workspace_premium</span>
                                    <span className="text-[10px] font-black text-primary dark:text-accent uppercase tracking-widest">{user.level}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{requirementsText}</span>
                            </div>
                        </>
                    ) : (
                        /* Traditional Header */
                        <>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-text dark:text-dark-text text-lg pr-8 truncate">{user.level}</h4>
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="bg-gray-50 dark:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 transition-transform active:scale-90">
                                        <span className="material-symbols-rounded text-sm font-bold">arrow_forward_ios</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{requirementsText}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Compact Progress Grid (Always consistent) */}
            <div className={`grid grid-cols-2 gap-4 relative z-10 ${showUserIdentity ? 'pt-4 border-t border-gray-50 dark:border-white/5' : ''}`}>

                {/* 1. Global Balance (Hub Style) */}
                <div className="bg-primary/5 dark:bg-primary/10 p-3.5 rounded-2xl border border-primary/10 dark:border-primary/20 transition-all group/points overflow-hidden">
                    <div className="text-[8px] font-black text-primary/70 dark:text-accent/70 uppercase tracking-[0.2em] mb-3">Balance Actual</div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 flex items-center justify-center transition-transform group-hover/points:scale-110">
                            <span className="material-symbols-rounded filled-icon text-primary dark:text-accent text-[32px]">bolt</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-lg font-black text-text dark:text-dark-text leading-tight truncate">
                                {user.points.toLocaleString()}
                            </div>
                            <div className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">E-Points</div>
                        </div>
                    </div>
                </div>

                {/* 2. Last Achievements (Visual Badges) */}
                <div className="bg-gray-50/50 dark:bg-black/10 p-3.5 rounded-2xl border border-gray-100/30 dark:border-white/5 flex flex-col justify-between overflow-hidden">
                    <div className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Últimas Insignias</div>
                    <div className="flex items-center gap-2">
                        {user.achievements.filter(a => a.completed).length > 0 ? (
                            user.achievements
                                .filter(a => a.completed)
                                .slice(-3)
                                .reverse()
                                .map((ach, idx) => (
                                    <motion.div
                                        key={ach.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="relative group/badge"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center shadow-sm transition-all group-hover/badge:scale-110 group-hover/badge:shadow-md group-active/badge:scale-95">
                                            <span className="material-symbols-rounded filled-icon text-primary dark:text-accent text-lg">
                                                {ach.icon}
                                            </span>
                                        </div>
                                        {/* Tooltip hint on press/hover */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap pointer-events-none mb-1 shadow-lg">
                                            {ach.title}
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800/40 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center opacity-40">
                                        <span className="material-symbols-rounded text-lg">lock</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {user.achievements.filter(a => a.completed).length > 3 && (
                            <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 ml-1">
                                +{user.achievements.filter(a => a.completed).length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
