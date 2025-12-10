import React from 'react';
import { motion } from 'framer-motion';

export const SplashScreen: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#121212]"
        >
            {/* Large Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />

            <div className="relative flex flex-col items-center z-10">
                {/* Logo Container */}
                <div className="relative w-32 h-32 mb-6">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full animate-pulse" />

                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                        className="relative z-10 w-full h-full bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100 dark:border-white/5"
                    >
                        <span className="material-symbols-rounded text-6xl text-primary">recycling</span>
                    </motion.div>
                </div>

                {/* Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-bold text-text dark:text-white mb-2 tracking-tight">
                        e-cycle
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">
                        Recicla. Gana. Repite.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};
