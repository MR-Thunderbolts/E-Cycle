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
                        <svg
                            className="w-16 h-16 text-primary dark:text-accent"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M4.02 9.54l1.63-2.83C6.39 5.3 7.82 4.3 9.5 4.08V2.17c0-.45.54-.67.85-.35l3.25 3.25c.2.2.2.51 0 .71L10.35 9.03c-.31.31-.85.09-.85-.35V6.75c-1.36.19-2.48.96-3.08 2.01L5.3 10.7c-.2.35-.65.47-1 .27l-.01-.01c-.35-.2-.47-.65-.27-1.02zM21.72 13.97l-1.63 2.83c-.74 1.41-2.17 2.41-3.85 2.63v1.91c0 .45-.54.67-.85.35l-3.25-3.25c-.2-.2-.2-.51 0-.71l3.25-3.25c.31-.31.85-.09.85.35v1.93c1.36-.19 2.48-.96 3.08-2.01l1.12-1.94c.2-.35.65-.47 1-.27l.01.01c.35.2.47.65.27 1.01zM11.66 19.34l-1.12 1.94c-.2.35-.65.47-1 .27l-.01-.01c-.35-.2-.47-.65-.27-1.02l1.63-2.83c.74-1.41 2.17-2.41 3.85-2.63v-1.91c0-.45.54-.67.85-.35l3.25 3.25c.2.2.2.51 0 .71l-3.25 3.25c-.31.31-.85.09-.85-.35v-1.93c-1.36.19-2.48.96-3.08 2.01z" />
                        </svg>
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
