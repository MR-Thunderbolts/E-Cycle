
import React from 'react';
import { motion } from 'framer-motion';
import { RECYCLE_CATEGORIES } from '@/constants';

interface ScanInputProps {
    items: Record<string, number>;
    onUpdateQty: (id: string, delta: number) => void;
    onBack: () => void;
    onConfirm: () => void;
    totalPoints: number;
    multiplier?: number;
}

const ScanInput: React.FC<ScanInputProps> = ({ items, onUpdateQty, onBack, onConfirm, totalPoints, multiplier = 1 }) => {
    return (
        <motion.div
            key="input"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col h-full bg-background dark:bg-dark-bg absolute inset-0 z-50" // z-50 covers BottomNavBar
        >
            <div className="px-6 py-4 flex justify-between items-center sticky top-0 bg-background dark:bg-dark-bg z-30 shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-rounded text-gray-500">arrow_back</span>
                    </button>
                    <span className="font-bold text-lg text-text dark:text-dark-text">Depositar Items</span>
                </div>
                <div className="flex items-center gap-2">
                    {multiplier > 1 && (
                        <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                            <span className="material-symbols-rounded filled-icon text-primary text-sm">bolt</span>
                            <span className="text-xs font-black text-primary">{multiplier}x Activo</span>
                        </div>
                    )}
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400">
                        <span className="material-symbols-rounded">help</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-6 mb-4">
                    <h1 className="font-extrabold text-3xl text-text dark:text-dark-text leading-tight">Que y cuanto quieres depositar?</h1>
                </div>

                <div className="px-4 space-y-1.5 pb-6">
                    {RECYCLE_CATEGORIES.map(cat => (
                        <motion.div layout key={cat.id} className="bg-white dark:bg-dark-surface py-2 px-4 rounded-[28px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-none flex justify-between items-center border border-transparent dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-accent shrink-0">
                                    <span className="material-symbols-rounded filled-icon text-xl">{cat.iconName}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-base text-text dark:text-dark-text">{cat.label}</div>
                                    <div className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md inline-block">+{cat.pointsPerUnit} pts</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-full p-1 shadow-inner">
                                <button
                                    onClick={() => onUpdateQty(cat.id, -1)}
                                    disabled={!items[cat.id]}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 shadow-sm transition-all"
                                >
                                    <span className="material-symbols-rounded text-lg">remove</span>
                                </button>
                                <span className="w-4 text-center font-bold text-lg dark:text-dark-text">{items[cat.id] || 0}</span>
                                <button
                                    onClick={() => onUpdateQty(cat.id, 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white shadow-md active:scale-90 transition-transform"
                                >
                                    <span className="material-symbols-rounded text-lg">add</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer - Placed inside scrollable area to appear at the end */}
                <div className="p-6 bg-white dark:bg-dark-surface rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] pb-12 z-20 mx-2 mb-2 rounded-b-[40px]">
                    <div className="flex justify-between mb-6 items-center">
                        <div className="flex flex-col">
                            <div className="text-gray-500 font-bold text-sm">Puntos Totales:</div>
                            {multiplier > 1 && <div className="text-[10px] text-primary font-bold">Incluye {multiplier}x bonus</div>}
                        </div>
                        <div className="bg-[#D0EBE8] dark:bg-primary/20 text-primary-dark dark:text-accent font-black px-4 py-2 rounded-full text-xl flex items-center gap-1">
                            <span className="material-symbols-rounded filled-icon">bolt</span> {totalPoints}
                        </div>
                    </div>
                    <button
                        onClick={onConfirm}
                        disabled={totalPoints === 0}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none transition-all mb-3"
                    >
                        Confirmar y Ganar Puntos
                    </button>
                    <button onClick={onBack} className="w-full py-2 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors">
                        Cancelar
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ScanInput;
