import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, IconButton } from './ui';

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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/20 dark:bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {/* Recycling Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 dark:bg-accent/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                            <div className="w-24 h-24 bg-white dark:bg-secondary/10 rounded-full flex items-center justify-center relative z-10 border border-gray-100 dark:border-white/10 backdrop-blur-sm shadow-xl dark:shadow-none">
                                <span className="material-symbols-rounded text-6xl text-primary dark:text-accent drop-shadow-[0_4px_8px_rgba(4,122,108,0.4)]">recycling</span>
                            </div>
                        </div>

                        {/* Leaf */}
                        <div className="absolute -top-2 -right-2 z-20">
                            <div className="absolute inset-0 bg-primary/40 dark:bg-accent/40 blur-md rounded-full scale-125 animate-pulse" />
                            <span className="relative material-symbols-rounded text-4xl text-primary dark:text-accent drop-shadow-[0_0_10px_rgba(4,122,108,0.8)]">eco</span>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/20 dark:bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        {/* Pin */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 dark:bg-accent/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                            <span className="relative material-symbols-rounded text-7xl text-primary dark:text-accent drop-shadow-[0_4px_8px_rgba(4,122,108,0.4)]">location_on</span>
                        </div>

                        {/* Validado Badge */}
                        <div className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-3 px-5 rounded-2xl shadow-xl dark:shadow-2xl flex items-center gap-3 transform rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
                            <div className="bg-gray-100 dark:bg-white/10 p-1.5 rounded-lg">
                                <span className="material-symbols-rounded text-2xl text-gray-800 dark:text-white">qr_code_2</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold leading-none mb-0.5">Estado</span>
                                <span className="text-base font-bold text-primary dark:text-accent tracking-wide">Validado</span>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/20 dark:bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

                    {/* Background decorative icons pattern */}
                    <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
                        <div className="absolute -top-10 -left-10 right-0 bottom-0 grid grid-cols-6 gap-8 transform rotate-12 scale-125">
                            {/* Row 1 */}
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">devices</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">smartphone</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">laptop</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">headphones</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">memory</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">router</span>

                            {/* Row 2 */}
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">mouse</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">keyboard</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">tablet</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">watch</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">print</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">speaker</span>

                            {/* Row 3 */}
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">tv</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">videogame_asset</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">battery_charging_full</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">cable</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">sim_card</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">hard_drive</span>

                            {/* Row 4 */}
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">developer_board</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">monitor</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">earbuds</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">power</span>
                            <span className="material-symbols-rounded text-4xl text-gray-400 dark:text-secondary">usb</span>
                            <span className="material-symbols-rounded text-4xl text-primary dark:text-accent">wifi</span>
                        </div>
                    </div>

                    {/* Glowing Check Circle */}
                    <div className="relative z-10">
                        <div className="absolute inset-0 bg-primary/30 dark:bg-accent/30 blur-2xl rounded-full scale-[2] animate-pulse" />
                        <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 p-5 rounded-full relative z-10 shadow-xl dark:shadow-none">
                            <span className="material-symbols-rounded text-6xl text-primary dark:text-accent drop-shadow-[0_4px_12px_rgba(4,122,108,0.5)]">check_circle</span>
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
                className="w-full max-w-md bg-surface dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh] md:h-[600px] relative"
            >
                {/* Back Button */}
                {currentStep > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                        <IconButton
                            icon="arrow_back"
                            onClick={handleBack}
                            ariaLabel="Volver"
                            variant="ghost"
                        />
                    </div>
                )}

                {/* Skip Button */}
                {currentStep < 3 && (
                    <div className="absolute top-4 right-4 z-20">
                        <Button
                            onClick={handleSkip}
                            variant="ghost"
                            size="sm"
                        >
                            Saltar
                        </Button>
                    </div>
                )}

                {/* Image Section (Flexible height) */}
                <div className="flex-1 relative bg-background dark:bg-dark-bg min-h-[200px]">
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
                <div className="shrink-0 p-6 md:p-8 flex flex-col bg-surface dark:bg-dark-surface">
                    <div className="text-center mb-4">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <h1 className="text-2xl font-bold text-text dark:text-dark-text mb-3 leading-tight">
                                    {steps[currentStep].title}
                                </h1>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">
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
                                        : 'w-2 bg-border dark:bg-dark-border'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Button */}
                        {currentStep === 3 ? (
                            <div className="w-full flex flex-col gap-3">
                                <Button
                                    onClick={() => {
                                        handleComplete();
                                        if (onNavigateToRegister) onNavigateToRegister();
                                    }}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                >
                                    Crear Cuenta Gratis
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleComplete();
                                        if (onNavigateToLogin) onNavigateToLogin();
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                >
                                    Ya tengo cuenta, Iniciar Sesión
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleNext}
                                variant="primary"
                                size="lg"
                                fullWidth
                            >
                                Siguiente
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
