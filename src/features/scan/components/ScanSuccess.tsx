
import React from 'react';
import { motion } from 'framer-motion';

interface ScanSuccessProps {
    earnedPoints: number;
    onRedeem: () => void;
    onContinue: () => void;
}

const ScanSuccess: React.FC<ScanSuccessProps> = ({ earnedPoints, onRedeem, onContinue }) => {
    console.log('ScanSuccess rendered with earnedPoints:', earnedPoints, 'type:', typeof earnedPoints);

    return (
        <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full overflow-y-auto bg-background dark:bg-dark-bg p-8 pb-8 flex flex-col items-center justify-center absolute inset-0 z-50"
        >
            <div className="w-32 h-32 aspect-square shrink-0 bg-[#D0EBE8] dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <div className="w-20 h-20 aspect-square shrink-0 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="material-symbols-rounded text-white text-5xl font-bold">check</span>
                </div>
            </div>
            <h1 className="text-3xl font-extrabold text-text dark:text-dark-text mb-2 text-center">¡Depósito Exitoso!</h1>
            <p className="text-gray-500 text-center mb-8 max-w-xs">Has reciclado correctamente tus residuos.</p>

            {/* ULTRA SIMPLIFIED POINTS DISPLAY */}
            {/* ULTRA SIMPLIFIED POINTS DISPLAY */}
            <div className="w-full bg-white dark:bg-dark-surface rounded-[20px] p-5 mb-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="text-xs font-bold text-[#999] dark:text-gray-400 mb-2.5 uppercase tracking-[1.5px]">
                    Has ganado
                </div>

                <div className="flex items-center justify-center gap-1.5 my-2.5">
                    <span className="material-symbols-rounded filled-icon text-4xl text-[#00796B] dark:text-secondary">
                        bolt
                    </span>

                    <div className="text-[40px] font-black text-[#00796B] dark:text-secondary leading-none font-sans">
                        {earnedPoints || 0}
                    </div>
                </div>

                <div className="text-sm font-bold text-[#00796B] dark:text-secondary uppercase tracking-[1px]">
                    E-Points
                </div>
            </div>

            <button
                onClick={onRedeem}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 active:scale-[0.98] mb-3 transition-all"
            >
                Usar mis puntos
            </button>
            <button
                onClick={onContinue}
                className="w-full text-gray-500 dark:text-gray-400 font-bold py-4 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
                Continuar
            </button>
        </motion.div>
    );
};

export default ScanSuccess;
