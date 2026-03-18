import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { IconButton } from '@/components';
import { ACHIEVEMENTS, MISSIONS, LEVEL_THRESHOLDS } from '@/constants';
import { Achievement, User } from '@/types';
import { Avatar } from '@/components/ui/Avatar/Avatar';

const LEVEL_COLORS: Record<string, { main: string; muted: string; text: string }> = {
    'Descubridor': { main: 'from-slate-500/20 to-slate-600/10', muted: 'bg-slate-100 dark:bg-slate-900/40', text: 'text-slate-500' },
    'Ensamblador': { main: 'from-primary/20 to-primary-dark/10', muted: 'bg-[#D0EBE8] dark:bg-primary/20', text: 'text-primary dark:text-accent' },
    'Recolector': { main: 'from-amber-500/20 to-amber-600/10', muted: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-500' },
    'Reactivador': { main: 'from-indigo-500/20 to-indigo-600/10', muted: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
};

interface ECyclerProfileBadgeOverlayProps {
    user: User;
    show: boolean;
    onClose: () => void;
}

interface BadgeCardProps {
    achievement: Achievement;
    isLocked: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ achievement, isLocked }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
        <div
            className="relative aspect-square w-full perspective-1000 cursor-pointer"
            onClick={() => isLocked && setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            >
                {/* Front Side */}
                <div className={`absolute inset-0 backface-hidden bg-white dark:bg-dark-surface p-5 rounded-[40px] border shadow-sm flex flex-col items-center justify-center text-center overflow-hidden group
                    ${isLocked ? 'border-gray-100 dark:border-dark-border opacity-70' : 'border-primary/20 dark:border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-dark-surface dark:to-primary/5'}`}>

                    {!isLocked && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent dark:from-primary/5 rounded-bl-[40px] pointer-events-none"></div>
                    )}

                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-transform ${isLocked ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600' : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent group-hover:scale-110 shadow-sm'}`}>
                        <span className="material-symbols-rounded filled-icon text-4xl leading-none">{achievement.icon}</span>
                    </div>

                    <h4 className={`font-bold text-[13px] mb-1 leading-tight px-2 ${isLocked ? 'text-gray-400 dark:text-gray-500' : 'text-text dark:text-dark-text'}`}>
                        {achievement.title}
                    </h4>

                    {isLocked ? (
                        <div className="w-full max-w-[80%] mt-3">
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-primary dark:bg-accent rounded-full transition-all duration-1000 opacity-60"
                                    style={{ width: `${(achievement.progress / achievement.max) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full inline-flex items-center gap-1">
                                <span className="material-symbols-rounded text-[10px]">lock</span>
                                {achievement.progress}/{achievement.max}
                            </div>
                        </div>
                    ) : (
                        <p className="text-[10px] font-medium text-text-secondary dark:text-dark-text-secondary leading-tight mt-1 px-4 line-clamp-2 min-h-[2.4em] flex items-center justify-center">
                            {achievement.description}
                        </p>
                    )}
                </div>

                {/* Back Side (Locked Only) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary/5 dark:bg-primary/10 p-6 rounded-[40px] border border-primary/20 dark:border-primary/20 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent flex items-center justify-center mb-3">
                        <span className="material-symbols-rounded text-2xl">help</span>
                    </div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-accent mb-2">Cómo desbloquear</h5>
                    <p className="text-[12px] font-semibold text-text dark:text-dark-text leading-tight px-3">
                        {achievement.description}
                    </p>
                    <div className="mt-6 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-rounded text-xs">flip</span>
                        Toca para volver
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const ECyclerProfileBadgeOverlay: React.FC<ECyclerProfileBadgeOverlayProps> = ({ user, show, onClose }) => {
    const sortedLevels = [...LEVEL_THRESHOLDS].reverse();
    const userLevelIndex = sortedLevels.findIndex(l => l.name === user.level);
    const [viewingIndex, setViewingIndex] = useState(userLevelIndex);

    const viewingLevel = sortedLevels[viewingIndex];
    const isCurrentUserLevel = viewingLevel.name === user.level;
    const colors = LEVEL_COLORS[viewingLevel.name as string] || LEVEL_COLORS['Descubridor'];

    const handleDragEnd = (_: any, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold && viewingIndex < sortedLevels.length - 1) {
            setViewingIndex(prev => prev + 1);
        } else if (info.offset.x > threshold && viewingIndex > 0) {
            setViewingIndex(prev => prev - 1);
        }
    };

    const completedBadgeIds = new Set(user.achievements.filter(a => a.completed).map(a => a.id));

    // Divide into Misiones (Weekly/Recurrent) and Logros (Unique)
    const activeMissions = MISSIONS; // In a real app, these would come from user state too
    const achievedLogros = ACHIEVEMENTS.filter(a => a.category === 'unica' && completedBadgeIds.has(a.id));
    const lockedLogros = ACHIEVEMENTS.filter(a => a.category === 'unica' && !completedBadgeIds.has(a.id));

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="fixed inset-0 z-[100] bg-background dark:bg-dark-bg flex flex-col"
                >
                    <header className="flex items-center p-4 pt-6 md:pt-8 bg-surface dark:bg-dark-surface sticky top-0 z-10 shadow-sm border-b border-border dark:border-dark-border">
                        <IconButton
                            icon="close"
                            onClick={onClose}
                            ariaLabel="Cerrar perfil"
                            variant="ghost"
                        />
                        <h2 className="text-xl font-bold text-text dark:text-dark-text ml-4 flex-1">Rango E-Cycler</h2>
                    </header>

                    <div className="flex-1 overflow-y-auto no-scrollbar pb-safe-bottom">
                        <section className="relative overflow-hidden pt-12 pb-14 px-6 flex flex-col items-center justify-center text-center">
                            {/* Dynamic Background Glow */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewingLevel.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`absolute inset-0 bg-gradient-to-b ${colors.main} to-transparent opacity-60 pointer-events-none`}
                                />
                            </AnimatePresence>

                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                className="relative z-10 w-full cursor-grab active:cursor-grabbing"
                            >
                                <div className="relative inline-block mb-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={viewingLevel.name}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`absolute inset-0 blur-3xl rounded-full scale-110 ${colors.muted} opacity-50`}
                                        />
                                    </AnimatePresence>

                                    <div className="relative">
                                        <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center relative z-10 shadow-2xl">
                                            <span className={`material-symbols-rounded filled-icon text-5xl text-primary-dark dark:text-accent`}>workspace_premium</span>
                                        </div>
                                        <div className={`absolute -bottom-1 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black border-4 border-white dark:border-dark-bg z-20 shadow-lg ${isCurrentUserLevel ? 'bg-primary dark:bg-accent' : 'bg-gray-400 dark:bg-gray-600'}`}>
                                            {viewingIndex + 1}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={viewingLevel.name}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                    >
                                        <h2 className="text-xl font-black text-text dark:text-dark-text mb-0.5">{isCurrentUserLevel ? user.name : 'Vistazo de Nivel'}</h2>
                                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-3">
                                            {isCurrentUserLevel ? 'Tu Rango Actual' : viewingIndex < userLevelIndex ? 'Rango Obtenido' : 'Próximo Objetivo'}
                                        </h3>
                                        <h1 className={`text-4xl font-black mb-4 tracking-tighter ${colors.text}`}>
                                            {viewingLevel.name}
                                        </h1>

                                        {/* Pagination Dots */}
                                        <div className="flex justify-center gap-1.5 pt-2">
                                            {sortedLevels.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 rounded-full transition-all duration-300 ${i === viewingIndex ? `w-6 ${colors.text.replace('text-', 'bg-')}` : 'w-1.5 bg-gray-300 dark:bg-gray-700'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Visual Swipe Hint */}
                                        <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 dark:text-gray-400 opacity-80">
                                            <span className="material-symbols-rounded text-sm animate-bounce-horizontal">chevron_left</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Desliza para explorar</span>
                                            <span className="material-symbols-rounded text-sm animate-bounce-horizontal">chevron_right</span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </section>

                        {/* Rewards Section */}
                        <div className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide flex items-center justify-between border-t border-gray-50 dark:border-white/5">
                            <span>Beneficios del Rango</span>
                            <span className="material-symbols-rounded text-primary dark:text-accent text-lg">redeem</span>
                        </div>

                        <section className="px-6 mb-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewingLevel.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white dark:bg-dark-surface rounded-[32px] p-6 border border-gray-100 dark:border-dark-border shadow-sm space-y-4"
                                >
                                    {(viewingLevel.rewards as any).map((reward: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCurrentUserLevel || viewingIndex < userLevelIndex ? 'bg-primary/10 text-primary dark:text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                <span className="material-symbols-rounded text-lg">check_circle</span>
                                            </div>
                                            <span className={`text-sm font-bold ${isCurrentUserLevel || viewingIndex < userLevelIndex ? 'text-text dark:text-dark-text' : 'text-gray-400'}`}>
                                                {reward}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </section>

                        <div className="px-6 py-6 font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
                            Misiones Semanales
                        </div>

                        <section className="px-6 space-y-4 mb-8">
                            {activeMissions.map((mission, i) => (
                                <motion.div
                                    key={mission.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="bg-white dark:bg-dark-surface p-5 rounded-[32px] border border-gray-100 dark:border-dark-border flex items-center gap-4 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary dark:text-accent flex items-center justify-center shrink-0">
                                        <span className="material-symbols-rounded text-3xl">{mission.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-sm text-text dark:text-dark-text truncate">{mission.title}</h4>
                                            <span className="text-[10px] font-bold text-primary dark:text-accent bg-primary/10 px-2 py-0.5 rounded-full">+{mission.reward} pts</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{mission.description}</p>
                                        <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary dark:bg-accent rounded-full opacity-60"
                                                style={{ width: `${(mission.progress / mission.max) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </section>

                        <div className="px-6 py-6 font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide border-t border-gray-50 dark:border-white/5">
                            Tus Insignias (Logros Unicos)
                        </div>

                        <section className="px-6 pb-6">
                            {achievedLogros.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {achievedLogros.map((achievement, i) => (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <BadgeCard achievement={achievement} isLocked={false} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-dark-surface p-6 rounded-[32px] border border-border dark:border-dark-border text-center flex flex-col items-center justify-center">
                                    <span className="material-symbols-rounded text-gray-300 dark:text-gray-600 text-4xl mb-2">military_tech</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Aún no tienes insignias.</p>
                                </div>
                            )}
                        </section>

                        <div className="px-6 py-4 font-bold text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wide">
                            Logros por Desbloquear
                        </div>

                        <section className="px-6 pb-12">
                            <div className="grid grid-cols-2 gap-4">
                                {lockedLogros.map((achievement, i) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.05 }}
                                    >
                                        <BadgeCard achievement={achievement} isLocked={true} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
