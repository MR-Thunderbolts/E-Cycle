import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
    onNavigateToRegister?: () => void;
    onNavigateToLogin?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onNavigateToRegister, onNavigateToLogin }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);

    const handleComplete = () => {
        setIsVisible(false);
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!isVisible) return null;

    const steps = [
        {
            // Paso 1: El Propósito
            title: "Tu tecnología merece una segunda vida.",
            body: "¿Tienes cables y celulares guardados en un cajón? No es basura, es el futuro. Transforma tus residuos electrónicos en oportunidades reales para ti y para el planeta.",
            image: (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-surface rounded-t-3xl relative overflow-hidden">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {/* Recycling Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center relative z-10 border border-white/10 backdrop-blur-sm">
                                <span className="material-symbols-rounded text-6xl text-primary drop-shadow-[0_4px_8px_rgba(4,122,108,0.4)]">recycling</span>
                            </div>
                        </div>

                        {/* Leaf */}
                        <div className="absolute -top-2 -right-2 z-20">
                            <div className="absolute inset-0 bg-secondary/40 blur-md rounded-full scale-125 animate-pulse" />
                            <span className="relative material-symbols-rounded text-4xl text-secondary drop-shadow-[0_0_10px_rgba(166,248,242,0.8)]">eco</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            // Paso 2: El Mecanismo
            title: "Reciclar nunca fue tan simple.",
            body: "Olvídate de las complicaciones. Encuentra el punto más cercano en nuestro mapa inteligente o agenda un Retiro a Domicilio. Escanea, valida y ¡listo! El ciclo está cerrado.",
            image: (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-surface rounded-t-3xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('/map-bg-light.jpg')] bg-cover bg-center" />

                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        {/* Pin */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                            <span className="relative material-symbols-rounded text-7xl text-primary drop-shadow-[0_4px_8px_rgba(4,122,108,0.4)]">location_on</span>
                        </div>

                        {/* Validado Badge */}
                        <div className="bg-[#1E1E1E]/90 backdrop-blur-md border border-white/10 p-3 px-5 rounded-2xl shadow-2xl flex items-center gap-3 transform rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
                            <div className="bg-white/10 p-1.5 rounded-lg">
                                <span className="material-symbols-rounded text-2xl text-white">qr_code_2</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold leading-none mb-0.5">Estado</span>
                                <span className="text-base font-bold text-secondary tracking-wide">Validado</span>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            // Paso 3: Gamificación
            title: "Conviértete en un Minero Urbano.",
            body: "Cada acción suma. Gana E-Points por cada dispositivo reciclado y sube de nivel: de Ensamblador a Reactivador. Cuanto más alto llegues, mejores serán tus recompensas.",
            image: (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-surface rounded-t-3xl relative overflow-hidden">
                    {/* Ambient Background Glow (Gold) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD700]/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-end gap-6 relative z-10">
                        {/* Bronze */}
                        <div className="flex flex-col items-center gap-2 opacity-60 scale-90">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#CD7F32]/30 blur-lg rounded-full scale-150" />
                                <span className="relative material-symbols-rounded text-5xl text-[#CD7F32] drop-shadow-[0_2px_6px_rgba(205,127,50,0.4)]">military_tech</span>
                            </div>
                            <span className="text-xs font-bold text-[#CD7F32]">Bronce</span>
                        </div>
                        {/* Silver */}
                        <div className="flex flex-col items-center gap-2 opacity-80 scale-95">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#C0C0C0]/30 blur-lg rounded-full scale-150" />
                                <span className="relative material-symbols-rounded text-6xl text-[#C0C0C0] drop-shadow-[0_2px_6px_rgba(192,192,192,0.5)]">military_tech</span>
                            </div>
                            <span className="text-xs font-bold text-[#C0C0C0]">Plata</span>
                        </div>
                        {/* Gold */}
                        <div className="flex flex-col items-center gap-2 scale-110">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#FFD700]/40 blur-xl rounded-full scale-[2] animate-pulse" />
                                <span className="relative material-symbols-rounded text-7xl text-[#FFD700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.6)]">military_tech</span>
                            </div>
                            <span className="text-sm font-bold text-[#FFD700]">Oro</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            // Paso 4: La Invitación
            title: "Únete al cambio hoy.",
            body: "Ya somos miles recuperando valor. Empieza ahora, libera espacio en tu hogar y canjea tu primera recompensa. El futuro es circular y empieza contigo.",
            image: (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-surface rounded-t-3xl relative overflow-hidden">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                    {/* Background decorative icons */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="grid grid-cols-3 gap-6">
                            <span className="material-symbols-rounded text-5xl text-primary">sentiment_satisfied</span>
                            <span className="material-symbols-rounded text-5xl text-secondary">sentiment_very_satisfied</span>
                            <span className="material-symbols-rounded text-5xl text-primary">sentiment_satisfied_alt</span>
                            <span className="material-symbols-rounded text-5xl text-secondary">emoji_emotions</span>
                            <span className="material-symbols-rounded text-5xl text-primary">mood</span>
                            <span className="material-symbols-rounded text-5xl text-secondary">sentiment_content</span>
                        </div>
                    </div>

                    {/* Glowing Check Circle */}
                    <div className="relative z-10">
                        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                        <div className="bg-[#1E1E1E]/80 backdrop-blur-md border border-white/10 p-5 rounded-full relative z-10">
                            <span className="material-symbols-rounded text-6xl text-primary drop-shadow-[0_4px_12px_rgba(4,122,108,0.5)]">check_circle</span>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh] md:h-[600px] relative"
            >
                {/* Back Button */}
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="absolute top-4 left-4 z-20 p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-rounded text-2xl">arrow_back</span>
                    </button>
                )}

                {/* Skip Button */}
                {currentStep < 3 && (
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 z-20 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        Saltar
                    </button>
                )}

                {/* Image Section (Flexible height) */}
                <div className="flex-1 relative bg-gray-50 dark:bg-[#121212] min-h-[200px]">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full absolute inset-0"
                        >
                            {steps[currentStep].image}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Content Section (Auto height based on content) */}
                <div className="shrink-0 p-6 md:p-8 flex flex-col bg-white dark:bg-[#1E1E1E]">
                    <div className="text-center mb-4">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <h1 className="text-2xl font-bold text-text dark:text-white mb-3 leading-tight">
                                    {steps[currentStep].title}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    {steps[currentStep].body}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col items-center gap-6 mt-auto">
                        {/* Dots */}
                        <div className="flex gap-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                        ? 'w-6 bg-primary'
                                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Button */}
                        {currentStep === 3 ? (
                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        handleComplete();
                                        if (onNavigateToRegister) onNavigateToRegister();
                                    }}
                                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                                >
                                    Crear Cuenta Gratis
                                </button>
                                <button
                                    onClick={() => {
                                        handleComplete();
                                        if (onNavigateToLogin) onNavigateToLogin();
                                    }}
                                    className="w-full py-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                                >
                                    Ya tengo cuenta, Iniciar Sesión
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="w-full py-3.5 bg-text dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
