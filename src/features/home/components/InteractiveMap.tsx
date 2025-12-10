import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RecyclePoint } from '@/types';
import { useAuth } from '@/hooks';
import mapBg from '@/assets/map-bg.jpg';
import mapBgLight from '@/assets/map-bg-light.jpg';

interface InteractiveMapProps {
    points: RecyclePoint[];
    selectedPointId: string | null;
    onPointSelect: (point: RecyclePoint) => void;
    zoom: number;
    centerOnUser: boolean;
    onCenterComplete: () => void;
}

const MAP_SIZE = 2000;
const USER_POS = { x: 1000, y: 1000 };

const InteractiveMap: React.FC<InteractiveMapProps> = ({
    points,
    selectedPointId,
    onPointSelect,
    zoom,
    centerOnUser,
    onCenterComplete
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isDarkMode } = useAuth();

    // Calculate initial position to center user
    const getInitialPosition = () => {
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            return {
                x: (offsetWidth / 2) - USER_POS.x,
                y: (offsetHeight / 2) - USER_POS.y
            };
        }
        return { x: 0, y: 0 };
    };

    const [position, setPosition] = React.useState(getInitialPosition);

    // Initialize on mount
    useEffect(() => {
        setPosition(getInitialPosition());
    }, []);

    // Handle center on user
    useEffect(() => {
        if (centerOnUser && containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setPosition({
                x: (offsetWidth / 2) - USER_POS.x,
                y: (offsetHeight / 2) - USER_POS.y
            });
            // Small delay to let animation start before calling complete
            setTimeout(onCenterComplete, 100);
        }
    }, [centerOnUser, onCenterComplete]);

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden bg-[#1a1d21] relative touch-none">
            <motion.div
                drag
                dragElastic={0.05}
                dragMomentum={false}
                animate={{
                    x: position.x,
                    y: position.y,
                    scale: zoom
                }}
                onDragEnd={(_, info) => {
                    setPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{
                    width: MAP_SIZE,
                    height: MAP_SIZE,
                    transformOrigin: `${USER_POS.x}px ${USER_POS.y}px`
                }}
                className="absolute cursor-grab active:cursor-grabbing"
            >
                {/* Map Background Image - Dynamic based on theme */}
                <img
                    src={isDarkMode ? mapBg : mapBgLight}
                    alt="Map Background"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
                />

                {/* User Location Indicator */}
                <div
                    className="absolute z-20 flex items-center justify-center w-12 h-12 pointer-events-none"
                    style={{
                        left: USER_POS.x - 24,
                        top: USER_POS.y - 24
                    }}
                >
                    <div className="absolute w-full h-full bg-primary/30 rounded-full animate-ping" />
                    <div className="relative w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md" />
                    <div className="absolute w-32 h-32 bg-gradient-to-t from-primary/20 to-transparent rounded-full -z-10 transform -translate-y-1/2 rotate-45 opacity-50"
                        style={{ clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)' }}
                    />
                </div>

                {/* Recycle Points */}
                {points.map((point) => {
                    const px = 1000 + (point.coordinates.lng + 70.6) * 20000;
                    const py = 1000 - (point.coordinates.lat + 33.51) * 20000;
                    const isSelected = selectedPointId === point.id;

                    return (
                        <motion.button
                            key={point.id}
                            onClick={(e) => { e.stopPropagation(); onPointSelect(point); }}
                            className="absolute z-30 transform -translate-x-1/2 -translate-y-full"
                            style={{ left: px, top: py }}
                            whileHover={{ scale: 1.2 }}
                            animate={{ scale: isSelected ? 1.2 : 1 }}
                        >
                            <div className="relative flex flex-col items-center justify-center">
                                {/* Marker Icon - No background, relying on map contrast */}
                                <span className={`relative z-10 material-symbols-rounded text-5xl drop-shadow-xl filled-icon leading-none transition-colors ${point.type === 'Punto Limpio' ? 'text-[#00796B]' : 'text-[#FB8C00]'}`}>
                                    location_on
                                </span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full mt-1 bg-white dark:bg-dark-surface px-3 py-1 rounded-full shadow-md whitespace-nowrap text-xs font-bold text-text dark:text-dark-text z-20"
                                    >
                                        {point.name}
                                    </motion.div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default InteractiveMap;
