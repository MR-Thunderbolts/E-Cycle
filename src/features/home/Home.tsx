import React, { useState } from 'react';
import { RECYCLE_POINTS, RECYCLE_CATEGORIES } from '@/constants';
import { RecyclePoint } from '@/types';
import { Avatar, SpecialMissionCard } from '@/components';
import { useAuth } from '@/hooks';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import InteractiveMap from './components/InteractiveMap';
import { analytics } from '@/utils';

interface HomeProps {
    onOpenProfile: () => void;
    onNavigateToHub: (tab: 'beneficios' | 'usar' | 'progreso') => void;
}

const Home: React.FC<HomeProps> = ({ onOpenProfile, onNavigateToHub }) => {
    const { isDarkMode } = useAuth();
    const [selectedPoint, setSelectedPoint] = useState<RecyclePoint | null>(null);
    const [mapZoom, setMapZoom] = useState(1.5);
    const [centerMapOnUser, setCenterMapOnUser] = useState(true);

    // Search Overlay State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeSearchTab, setActiveSearchTab] = useState<'donde' | 'materiales'>('donde');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Close if dragged down more than 150px or with high velocity
        if (info.offset.y > 150 || info.velocity.y > 200) {
            setSelectedPoint(null);
        }
    };

    const toggleMaterial = (id: string) => {
        const newMaterials = selectedMaterials.includes(id) ? selectedMaterials.filter(m => m !== id) : [...selectedMaterials, id];
        setSelectedMaterials(newMaterials);
        analytics.materialFilterApplied(newMaterials, RECYCLE_POINTS.filter(p => p.materials?.some(m => newMaterials.includes(m))).length);
    };

    // Filter Points Logic
    const filteredPoints = RECYCLE_POINTS.filter(point => {
        // 1. Search Filter (Name or Address)
        const matchesSearch = searchQuery === '' ||
            point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            point.address.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Material Filter (OR logic - if point has ANY of the selected materials)
        // If no materials selected, show all.
        const matchesMaterials = selectedMaterials.length === 0 ||
            (point.materials && point.materials.some(m => selectedMaterials.includes(m)));

        return matchesSearch && matchesMaterials;
    });

    // Find a special mission to display (e.g., Copec)
    const specialMissionPoint = filteredPoints.find(p => p.specialMission);

    return (
        <div className="relative w-full h-full bg-[#F2F1ED] dark:bg-dark-bg overflow-hidden font-sans">

            {/* Search Overlay Implementation */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex flex-col bg-[#F7F7F7] dark:bg-dark-bg"
                    >
                        <div className="px-6 pt-6 pb-2 flex justify-between items-center bg-transparent shrink-0">
                            <button onClick={() => setIsSearchOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark-surface shadow-sm text-text dark:text-white">
                                <span className="material-symbols-rounded text-lg">close</span>
                            </button>
                            <div className="text-sm font-bold underline decoration-text dark:decoration-dark-text underline-offset-4 text-text dark:text-dark-text">Búsqueda</div>
                            <div className="w-10"></div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            {/* Where Section */}
                            <motion.div
                                layout
                                onClick={() => setActiveSearchTab('donde')}
                                className={`bg-white dark:bg-dark-surface rounded-[32px] p-6 mb-4 overflow-hidden ${activeSearchTab === 'donde' ? 'shadow-lg z-10' : 'opacity-70'}`}
                                animate={{ scale: activeSearchTab === 'donde' ? 1.01 : 0.95 }}
                            >
                                {activeSearchTab === 'donde' ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="text-2xl font-extrabold text-text dark:text-dark-text mb-6">¿Dónde?</h2>
                                        <div className="bg-gray-50 dark:bg-black/20 rounded-full flex items-center px-4 py-4 mb-6 shadow-inner border border-transparent focus-within:border-primary">
                                            <span className="material-symbols-rounded text-text dark:text-dark-text mr-3">search</span>
                                            <input type="text" placeholder="Explorar destinos" className="flex-1 outline-none text-sm font-bold bg-transparent text-text dark:text-dark-text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div className="text-sm font-bold text-gray-400">¿Dónde?</motion.div>
                                )}
                            </motion.div>

                            {/* Materials Section */}
                            <motion.div
                                layout
                                onClick={() => setActiveSearchTab('materiales')}
                                className={`bg-white dark:bg-dark-surface rounded-[32px] p-6 overflow-hidden ${activeSearchTab === 'materiales' ? 'shadow-lg z-10' : 'opacity-70'}`}
                                animate={{ scale: activeSearchTab === 'materiales' ? 1.01 : 0.95 }}
                            >
                                {activeSearchTab === 'materiales' ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="text-2xl font-extrabold text-text dark:text-dark-text mb-6">Materiales</h2>
                                        <div className="grid grid-cols-4 gap-3">
                                            {RECYCLE_CATEGORIES.map(cat => (
                                                <button key={cat.id} onClick={(e) => { e.stopPropagation(); toggleMaterial(cat.id); }} className={`flex flex-col items-center gap-3 p-3 rounded-3xl transition-all ${selectedMaterials.includes(cat.id) ? 'bg-[#E0F2F1] dark:bg-primary/20 ring-1 ring-primary' : 'bg-white dark:bg-dark-surface shadow-sm'}`}>
                                                    <span className={`material-symbols-rounded text-2xl ${selectedMaterials.includes(cat.id) ? 'filled-icon text-primary dark:text-accent' : 'text-gray-400'}`}>{cat.iconName}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-400">Materiales</span>
                                        {selectedMaterials.length > 0 && <span className="text-xs font-bold text-primary">{selectedMaterials.length} seleccionados</span>}
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* Footer Search Button */}
                        <div className="p-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border flex justify-between items-center shrink-0 pb-safe-bottom">
                            <button onClick={() => { setSearchQuery(''); setSelectedMaterials([]); setActiveSearchTab('donde'); }} className="font-bold text-sm underline px-4 text-primary dark:text-white">Limpiar todo</button>
                            <button onClick={() => setIsSearchOpen(false)} className="bg-primary text-white font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg">
                                <span className="material-symbols-rounded font-bold text-xl">search</span> Buscar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Header */}
            <motion.div
                animate={{ opacity: selectedPoint ? 0 : 1, y: selectedPoint ? -100 : 0 }}
                className="absolute top-6 left-4 right-4 z-20"
            >
                <div className="bg-white dark:bg-dark-surface rounded-[32px] shadow-lg p-2 flex items-center gap-3 border border-transparent dark:border-dark-border">
                    <button onClick={() => setIsSearchOpen(true)} className="flex-1 flex items-center h-12 pl-4 text-left">
                        <span className="material-symbols-rounded text-primary dark:text-accent text-3xl mr-3 font-bold">search</span>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-bold text-text dark:text-dark-text leading-tight">¿A dónde vamos?</span>
                            {(searchQuery || selectedMaterials.length > 0) && (
                                <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                                    {searchQuery && `"${searchQuery}"`}
                                    {searchQuery && selectedMaterials.length > 0 && ' • '}
                                    {selectedMaterials.length > 0 && `${selectedMaterials.length} materiales`}
                                </span>
                            )}
                        </div>
                    </button>
                    <button onClick={onOpenProfile} className="mr-1"><Avatar size="md" /></button>
                </div>
            </motion.div>

            {/* Interactive Map */}
            <InteractiveMap
                points={filteredPoints}
                selectedPointId={selectedPoint?.id || null}
                onPointSelect={(point) => {
                    if (point) {
                        analytics.recyclingPointClicked(point.id, point.name);
                    }
                    setSelectedPoint(point);
                }}
                zoom={mapZoom}
                centerOnUser={centerMapOnUser}
                onCenterComplete={() => setCenterMapOnUser(false)}
            />

            {/* Special Mission Carousel - Floating above Navbar */}
            <AnimatePresence>
                {!selectedPoint && !isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-[80px] left-0 right-0 z-50 overflow-x-auto no-scrollbar pl-4 pb-8 pt-8 pointer-events-none"
                    >
                        <div className="flex gap-6 w-max pr-4 pointer-events-auto">
                            {/* Standard Mission */}
                            {specialMissionPoint && specialMissionPoint.specialMission && (
                                <SpecialMissionCard
                                    title={specialMissionPoint.specialMission.title}
                                    subtitle={specialMissionPoint.specialMission.subtitle}
                                    logo={specialMissionPoint.specialMission.logo}
                                    bonusPoints={specialMissionPoint.specialMission.bonusPoints}
                                    onClick={() => {
                                        setSelectedPoint(specialMissionPoint);
                                        analytics.recyclingPointClicked(specialMissionPoint.id, specialMissionPoint.name);
                                    }}
                                    compact
                                />
                            )}

                            {/* Perk Mission Example */}
                            <SpecialMissionCard
                                title="Cazador de Circuitos"
                                subtitle="Recicla 1 computador o 2 celulares"
                                logo="memory"
                                bonusPoints={0}
                                variant="perk"
                                onClick={() => onNavigateToHub('beneficios')}
                                compact
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <motion.div
                animate={{ opacity: selectedPoint ? 0 : 1, x: selectedPoint ? 100 : 0 }}
                className="absolute bottom-72 right-4 flex flex-col gap-3 z-10"
            >
                <div className="bg-white dark:bg-dark-surface rounded-[32px] shadow-lg flex flex-col">
                    <button onClick={() => setMapZoom(z => Math.min(z + 0.5, 4))} className="w-12 h-12 flex items-center justify-center text-primary dark:text-accent border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 rounded-t-[32px] transition-colors"><span className="material-symbols-rounded text-2xl">add</span></button>
                    <button onClick={() => setMapZoom(z => Math.max(z - 0.5, 0.5))} className="w-12 h-12 flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-white/5 rounded-b-[32px] transition-colors"><span className="material-symbols-rounded text-2xl">remove</span></button>
                </div>
                <button onClick={() => { setCenterMapOnUser(true); setMapZoom(1.5); }} className="w-12 h-12 bg-white dark:bg-dark-surface rounded-full shadow-lg flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"><span className="material-symbols-rounded filled-icon text-2xl">my_location</span></button>
            </motion.div>

            {/* Point Details Bottom Sheet */}
            <AnimatePresence>
                {selectedPoint && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/10 dark:bg-black/40 backdrop-blur-[1px]"
                            onClick={() => setSelectedPoint(null)}
                        />

                        {/* Draggable Sheet */}
                        <motion.div
                            layout
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface w-full rounded-t-[32px] shadow-2xl flex flex-col max-h-[85vh]"
                        >
                            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0 touch-none">
                                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center"><span className="material-symbols-rounded text-xl">close</span></button>

                            <div className="px-6 pb-2 shrink-0">
                                <h2 className="text-2xl font-bold text-[#151515] dark:text-dark-text mb-1 pr-8">{selectedPoint.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">{selectedPoint.address}</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
                                    <div className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                                        <span className="material-symbols-rounded filled-icon text-sm">schedule</span> Abierto ahora
                                    </div>
                                    <span>● {selectedPoint.hours}</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto px-6 pb-32">
                                {selectedPoint.specialMission ? (
                                    <div className="mb-6 pt-8 pr-6">
                                        <SpecialMissionCard
                                            title={selectedPoint.specialMission.title}
                                            subtitle={selectedPoint.specialMission.subtitle}
                                            logo={selectedPoint.specialMission.logo}
                                            bonusPoints={selectedPoint.specialMission.bonusPoints}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-[#F8F9FA] dark:bg-white/5 p-4 rounded-[24px] flex items-center gap-4 mb-6 shadow-sm">
                                        <div className="w-14 h-14 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center p-2 shadow-sm shrink-0">
                                            {selectedPoint.logo ? <img src={selectedPoint.logo} alt="brand" className="w-full h-full object-contain" /> : <span className="material-symbols-rounded text-gray-400">storefront</span>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-[#00695C] dark:text-[#4DB6AC] text-sm mb-0.5">{selectedPoint.promoText}</div>
                                            <div className="text-xs text-gray-400">Acumula puntos extra reciclando aquí</div>
                                        </div>
                                    </div>
                                )}

                                {/* Materials - Centered & Styled like Distances */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-[#151515] dark:text-dark-text text-sm mb-3">Materiales Aceptados</h3>
                                    <div className="flex items-center justify-between px-2 w-full">
                                        {(selectedPoint.materials || []).map((matId, index) => {
                                            const category = RECYCLE_CATEGORIES.find(c => c.id === matId);
                                            return category ? (
                                                <React.Fragment key={matId}>
                                                    <div className="flex-1 flex flex-col items-center gap-1">
                                                        <span className="material-symbols-rounded text-[#00695C] text-3xl">{category.iconName}</span>
                                                        <span className="text-xs font-bold text-text dark:text-dark-text capitalize">{category.label}</span>
                                                    </div>
                                                    {index < (selectedPoint.materials?.length || 0) - 1 && (
                                                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                                    )}
                                                </React.Fragment>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                {/* Estimated Distances */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-[#151515] dark:text-dark-text text-sm mb-3">Distancias estimadas</h3>
                                    <div className="flex justify-between items-center px-2">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="material-symbols-rounded text-[#00695C] text-2xl">directions_walk</span>
                                            <span className="font-bold text-sm text-text dark:text-dark-text">35 min</span>
                                            <span className="text-xs text-gray-400">Caminando</span>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="material-symbols-rounded text-[#00695C] text-2xl">directions_bike</span>
                                            <span className="font-bold text-sm text-text dark:text-dark-text">15 min</span>
                                            <span className="text-xs text-gray-400">Bicicleta</span>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="material-symbols-rounded text-[#00695C] text-2xl">directions_car</span>
                                            <span className="font-bold text-sm text-text dark:text-dark-text">10 min</span>
                                            <span className="text-xs text-gray-400">Auto</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Map Preview */}
                                <div className="mb-6 rounded-[24px] overflow-hidden h-32 relative bg-[#E0F2F1] dark:bg-primary/10 border border-gray-100 dark:border-white/5">
                                    {/* Mock Map Elements */}
                                    <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/50 transform -skew-x-12"></div>
                                    <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/50 transform -translate-y-1/2 rotate-3"></div>
                                    <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-[#B2DFDB] rounded-md"></div>
                                    <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-[#B2DFDB] rounded-full opacity-50"></div>

                                    {/* Marker */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <span className="material-symbols-rounded filled-icon text-red-500 text-3xl drop-shadow-md">location_on</span>
                                        <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-dark-surface border-t border-gray-50 dark:border-dark-border flex gap-3 z-30 pb-8 rounded-t-[20px]">
                                <button disabled className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                    <span className="material-symbols-rounded text-xl">qr_code_scanner</span> Escanear QR
                                </button>
                                <button disabled className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                    <span className="material-symbols-rounded text-xl filled-icon">near_me</span> Indicaciones
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
