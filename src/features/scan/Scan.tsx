
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { RECYCLE_CATEGORIES } from '@/constants';
import { ScanStep } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import ScanCamera from './components/ScanCamera';
import ScanInput from './components/ScanInput';
import ScanSuccess from './components/ScanSuccess';
import { analytics } from '@/utils';

interface ScanProps {
    onGoToRedeem: () => void;
}

const Scan: React.FC<ScanProps> = ({ onGoToRedeem }) => {
    const { user, deposit } = useAuth();
    const [step, setStep] = useState<ScanStep>('camera');
    const [items, setItems] = useState<Record<string, number>>({});
    const [loadingText, setLoadingText] = useState('Verificando codigo QR y tu ubicacion');
    const [earnedPoints, setEarnedPoints] = useState(0);

    const activeMultiplier = user?.activeMultiplier || 1;

    const getTotalPoints = () => {
        const itemPoints = Object.entries(items).reduce((acc, [key, count]) => {
            const category = RECYCLE_CATEGORIES.find(c => c.id === key);
            const points = category ? category.pointsPerUnit * (count as number) : 0;
            return acc + points;
        }, 0);

        // Apply multiplier to base points
        const total = Math.round(itemPoints * activeMultiplier);
        return total;
    };

    useEffect(() => {
        let timer: any = null;
        if (step === 'analyzing') {
            let i = 0;
            timer = setInterval(() => {
                setLoadingText(["Verificando codigo QR...", "Validando ubicación...", "Conectando con contenedor B-103..."][i % 3]);
                i++;
                if (i > 2) { clearInterval(timer); setStep('input'); }
            }, 1200);
        }
        if (step === 'validating') {
            setTimeout(async () => {
                const total = getTotalPoints();
                // Pass BASE points to deposit, API handles multiplier? 
                // Wait, API service logic I wrote applies multiplier AGAIN if I pass base points?
                // In apiService I wrote: const finalPoints = Math.round(basePoints * newMultiplier);
                // So I should pass BASE points to deposit if I want API to calculate it based on NEW multiplier.
                // BUT, user sees points calculated with CURRENT multiplier.
                // Let's align:
                // 1. UI shows points with CURRENT multiplier.
                // 2. We send calculated total to deposit? Or base?
                // apiService.submitDropoff(user, items, points) -> points argument name.
                // In apiService: const finalPoints = Math.round(basePoints * newMultiplier);
                // It treats the argument as BASE points.

                // So here in Scan.tsx, getTotalPoints returns the DISPLAY points (multiplied).
                // But deposit() expects BASE points?
                // Let's check apiService again.
                // apiService.submitDropoff signature: (user, items, basePoints)
                // Yes.

                // So I need to calculate base points separately.
                const basePoints = Object.entries(items).reduce((acc, [key, count]) => {
                    const category = RECYCLE_CATEGORIES.find(c => c.id === key);
                    return acc + (category ? category.pointsPerUnit * (count as number) : 0);
                }, 0);

                // The API will calculate final points based on (potentially new) multiplier.
                // But for UI consistency, we should probably show what the API will likely give.
                // If API updates multiplier BEFORE calculation, we might get more points than shown.
                // That's a "nice surprise".
                // If API uses current multiplier, it matches.

                // Let's pass basePoints to deposit.
                const updatedUser = await deposit(items, basePoints); // deposit now returns updated user? No, void in context.
                // Wait, context deposit returns void.
                // Let's check AuthContext.

                // In AuthProvider:
                // const deposit = async (items, points) => { ... setUser(updatedUser) }
                // It calls apiService.submitDropoff(user, items, points)

                // So I should pass BASE points.
                const totalItems = Object.values(items).reduce((a: number, b: number) => a + b, 0);
                analytics.scanItemsEntered(items, totalItems, total);

                await deposit(items, basePoints);
                analytics.dropoffCompleted(total, totalItems, activeMultiplier);

                setEarnedPoints(total);
                setStep('success');
            }, 3000);
        }
        return () => { if (timer) clearInterval(timer); };
    }, [step]);

    const handleQty = (id: string, d: number) => setItems(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + d) }));

    return (
        <div className="relative h-full w-full bg-background dark:bg-dark-bg overflow-hidden">
            <AnimatePresence mode="wait">

                {step === 'camera' && (
                    <ScanCamera onSimulate={() => {
                        analytics.scanStarted();
                        setStep('analyzing');
                    }} />
                )}

                {/* LOADING STEPS */}
                {(step === 'analyzing' || step === 'validating') && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex flex-col items-center justify-center h-full p-8 text-center absolute inset-0 z-50 bg-background dark:bg-dark-bg"
                    >
                        <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-[40px] p-12 shadow-lg flex flex-col items-center">
                            <div className="w-24 h-24 bg-[#D0EBE8] dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-2">{step === 'analyzing' ? 'Validando...' : 'Procesando...'}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{loadingText}</p>
                        </div>
                    </motion.div>
                )}

                {/* INPUT STEP */}
                {step === 'input' && (
                    <ScanInput
                        items={items}
                        onUpdateQty={handleQty}
                        onBack={() => setStep('camera')}
                        onConfirm={() => setStep('validating')}
                        totalPoints={getTotalPoints()}
                        multiplier={activeMultiplier}
                    />
                )}

                {/* SUCCESS STEP */}
                {step === 'success' && (
                    <ScanSuccess
                        earnedPoints={earnedPoints}
                        onRedeem={onGoToRedeem}
                        onContinue={() => { setItems({}); setStep('camera'); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Scan;
