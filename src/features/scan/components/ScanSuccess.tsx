import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components';

interface ScanSuccessProps {
    earnedPoints: number;
    onRedeem: () => void;
    onContinue: () => void;
}

const ScanSuccess: React.FC<ScanSuccessProps> = ({ earnedPoints, onRedeem, onContinue }) => {
    return (
        <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full flex flex-col items-center justify-center p-8 text-center bg-background dark:bg-dark-bg z-20"
        >
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-gentle">
                <span className="material-symbols-rounded filled-icon text-6xl text-green-600 dark:text-green-400">check_circle</span>
            </div>
            <h2 className="text-3xl font-extrabold text-text dark:text-dark-text mb-2">¡Felicitaciones!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Has depositado tus residuos correctamente.</p>

            <div className="bg-white dark:bg-dark-surface p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-dark-border w-full max-w-xs mb-8">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Ganaste</div>
                <div className="text-6xl font-black text-primary dark:text-accent mb-2 flex items-center justify-center gap-2">
                    <span className="material-symbols-rounded filled-icon text-4xl">bolt</span>
                    {earnedPoints}
                </div>
                <div className="text-sm font-bold text-text dark:text-dark-text bg-gray-50 dark:bg-white/5 py-2 px-4 rounded-full inline-block">
                    E-Points
                </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
                <Button
                    onClick={onRedeem}
                    variant="outline"
                    fullWidth
                    size="lg"
                    className="border-primary dark:border-accent text-primary dark:text-accent hover:bg-primary/5"
                >
                    Usar mis puntos
                </Button>
                <Button
                    onClick={onContinue}
                    fullWidth
                    size="lg"
                    className="shadow-lg shadow-primary/30"
                >
                    Continuar
                </Button>
            </div>
        </motion.div>
    );
};

export default ScanSuccess;
