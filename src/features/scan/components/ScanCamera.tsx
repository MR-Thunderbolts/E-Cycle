
import React from 'react';
import { motion } from 'framer-motion';
import { Button, IconButton } from '@/components';

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
                <IconButton
                    icon="arrow_back"
                    onClick={onBack}
                    ariaLabel="Regresar"
                    className="bg-white/10 text-white hover:bg-white/20"
                />
                <h2 className="text-white font-semibold">Escanea el QR</h2>
                <IconButton
                    icon="flash_on"
                    onClick={() => { }}
                    ariaLabel="Flash"
                    className="bg-white/10 text-white hover:bg-white/20"
                />
            </div>

            {/* Scanner Content */}
            <div className="flex-1 flex flex-col items-center justify-start min-h-0 px-6 pt-4 sm:pt-8 pb-32 overflow-y-auto no-scrollbar">
                <div className="relative w-[60vw] sm:w-[50vw] max-w-[260px] aspect-square z-10 flex items-center justify-center shrink-0 max-h-[35vh] max-w-[35vh]">
                    <div className="absolute inset-0 border-[4px] sm:border-[6px] border-primary/80 rounded-[20%]"></div>
                    <div className="w-[85%] h-[85%] border-2 border-white/20 rounded-[18%]"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(4,122,108,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>

                <div className="mt-6 sm:mt-10 flex flex-col items-center gap-6 sm:gap-8 w-full max-w-xs shrink-0">
                    <p className="text-white/80 text-center leading-relaxed text-sm sm:text-base font-medium">
                        Apunta al código QR del contenedor.
                    </p>

                    <Button
                        onClick={onSimulate}
                        icon="qr_code_scanner"
                        className="bg-secondary/20 backdrop-blur-md border border-secondary/40 text-white hover:bg-secondary/30 py-3 sm:py-4 px-8 shadow-xl"
                    >
                        Simular Escaneo
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ScanCamera;
