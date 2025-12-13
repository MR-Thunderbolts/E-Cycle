
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
                <Button
                    onClick={onSimulate}
                    icon="qr_code_scanner"
                    className="bg-secondary/20 backdrop-blur-lg border border-secondary/50 text-white hover:bg-secondary/30"
                >
                    Simular Escaneo
                </Button>
            </div>
        </motion.div>
    );
};

export default ScanCamera;
