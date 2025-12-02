
import React from 'react';
import { motion } from 'framer-motion';

interface ScanCameraProps {
    onSimulate: () => void;
    onBack: () => void;
}

const ScanCamera: React.FC<ScanCameraProps> = ({ onSimulate, onBack }) => {
    return (
        <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full w-full bg-black flex flex-col z-10"
        >
            {/* Top Header */}
            <div className="p-6 pt-10 flex justify-between items-center z-20 shrink-0">
                <button onClick={onBack} className="material-symbols-rounded text-white p-2 bg-white/10 rounded-full active:scale-95 transition-transform">arrow_back</button>
                <h2 className="text-white font-semibold">Escanea el QR</h2>
                <span className="material-symbols-rounded text-white p-2 bg-white/10 rounded-full">flash_on</span>
            </div>

            {/* Scanner Content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                <div className="relative w-72 h-72 z-10 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 border-[6px] border-primary/80 rounded-[40px]"></div>
                    <div className="w-64 h-64 border-2 border-white/20 rounded-[32px]"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(4,122,108,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-white/80 mt-8 text-center max-w-xs px-4">Apunta al código QR del contenedor.</p>
            </div>

            {/* Bottom Action */}
            <div className="pb-28 pt-4 flex justify-center shrink-0 z-30">
                <button
                    onClick={onSimulate}
                    className="bg-secondary/20 backdrop-blur-lg border border-secondary/50 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 active:scale-95 transition-all"
                >
                    <span className="material-symbols-rounded filled-icon">qr_code_scanner</span>
                    <span className="whitespace-nowrap">Simular Escaneo</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ScanCamera;
