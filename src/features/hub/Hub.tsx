import React, { useEffect, useState } from 'react';
import { Coupon, HubTab } from '@/types';
import { useAuth } from '@/hooks';
import { COUPONS } from '@/constants';
import { LevelIndicator } from '@/components';
import { motion } from 'framer-motion';

type RedemptionStatus = 'idle' | 'confirm' | 'processing' | 'success';
type ProgressFilter = 'todos' | 'completadas' | 'diaria' | 'semanal' | 'mensual';

interface HubScreenProps {
    initialTab?: HubTab;
}

// Unified Chip Styles
const CHIP_BASE = "px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors flex items-center gap-1 border shrink-0";
const CHIP_ACTIVE = "bg-primary text-white border-primary shadow-md shadow-primary/20";
const CHIP_INACTIVE = "bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5";

const Hub: React.FC<HubScreenProps> = ({ initialTab = 'beneficios' }) => {
    const { user, redeem } = useAuth();
    const [activeTab, setActiveTab] = useState<HubTab>(initialTab);

    // Progress Filter
    const [activeFilter, setActiveFilter] = useState<ProgressFilter>('todos');

    // Usar Puntos Filters
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Redemption State
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [redemptionStatus, setRedemptionStatus] = useState<RedemptionStatus>('idle');

    // Update tab if initialTab prop changes
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleCouponClick = (coupon: Coupon) => {
        if (!user) return;
        if (user.points >= coupon.cost) {
            setSelectedCoupon(coupon);
            setRedemptionStatus('confirm');
        }
    };

    const confirmRedemption = () => {
        if (!selectedCoupon || !user) return;

        setRedemptionStatus('processing');

        setTimeout(async () => {
            const success = await redeem(selectedCoupon.cost);
            if (success) {
                setRedemptionStatus('success');
            } else {
                setRedemptionStatus('idle');
                alert('Error: No tienes suficientes puntos.');
            }
        }, 2000);
    };

    const closeRedemption = () => {
        setRedemptionStatus('idle');
        setSelectedCoupon(null);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveCategory(null);
        setShowFilters(false);
    };

    if (!user) return <div className="p-8 flex justify-center"><span className="animate-spin material-symbols-rounded text-primary text-4xl">progress_activity</span></div>;

    const isMultipliersLocked = user.level === 'Descubridor';

    // --- Render Functions for Sub-Tabs ---

    const renderBeneficios = () => (
        <div className="animate-fade-in space-y-8 pb-8">
            {/* Multiplicadores Section */}
            <section className="relative">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-text dark:text-dark-text mb-1">Multiplicadores de E-Points</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[250px]">
                            Multiplica tus ganancias por reciclar. ¡Mientras más recicles este mes, más sube tu multiplicador!
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tu Progreso</div>
                        <div className="text-xl font-black text-primary">{user.itemsThisMonth || 0} <span className="text-xs font-bold text-gray-400">ítems</span></div>
                    </div>
                </div>

                <div className={`flex gap-3 overflow-x-auto no-scrollbar py-4 transition-opacity -mx-6 px-6 ${isMultipliersLocked ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
                    {/* Card 1x (Default) */}
                    <div className={`min-w-[110px] flex-1 border rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-sm shrink-0 transition-all ${user.activeMultiplier === 1 ? 'border-primary/50 bg-[#D0EBE8] dark:bg-primary/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg' : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface opacity-60'}`}>
                        <div className={`text-2xl font-black mb-1 ${user.activeMultiplier === 1 ? 'text-primary-dark dark:text-primary' : 'text-gray-400'}`}>1x</div>
                        <div className="text-[10px] font-bold text-gray-400">0-4 ítems /<br />mes</div>
                    </div>

                    {/* Card 1.2x */}
                    <div className={`min-w-[110px] flex-1 border rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-sm shrink-0 transition-all relative overflow-hidden ${user.activeMultiplier === 1.2 ? 'border-primary/50 bg-[#D0EBE8] dark:bg-primary/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg' : (user.itemsThisMonth >= 5 ? 'border-primary/20 bg-white dark:bg-dark-surface' : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/50 opacity-60')}`}>
                        {user.activeMultiplier === 1.2 && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                        <div className={`text-2xl font-black mb-1 ${user.activeMultiplier === 1.2 ? 'text-primary-dark dark:text-primary' : (user.itemsThisMonth >= 5 ? 'text-primary' : 'text-gray-400')}`}>1.2x</div>
                        <div className="text-[10px] font-bold text-gray-400">5-10 ítems /<br />mes</div>
                        {user.itemsThisMonth < 5 && <span className="material-symbols-rounded text-gray-300 text-lg absolute top-2 right-2">lock</span>}
                    </div>

                    {/* Card 1.5x */}
                    <div className={`min-w-[110px] flex-1 border rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-sm shrink-0 transition-all relative overflow-hidden ${user.activeMultiplier === 1.5 ? 'border-primary/50 bg-[#D0EBE8] dark:bg-primary/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg' : (user.itemsThisMonth >= 11 ? 'border-primary/20 bg-white dark:bg-dark-surface' : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/50 opacity-60')}`}>
                        {user.activeMultiplier === 1.5 && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                        <div className={`text-2xl font-black mb-1 ${user.activeMultiplier === 1.5 ? 'text-primary-dark dark:text-primary' : (user.itemsThisMonth >= 11 ? 'text-primary' : 'text-gray-400')}`}>1.5x</div>
                        <div className="text-[10px] font-bold text-gray-400">11-20 ítems /<br />mes</div>
                        {user.itemsThisMonth < 11 && <span className="material-symbols-rounded text-gray-300 text-lg absolute top-2 right-2">lock</span>}
                    </div>

                    {/* Card 2x */}
                    <div className={`min-w-[110px] flex-1 border rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-sm shrink-0 transition-all relative overflow-hidden ${user.activeMultiplier === 2 ? 'border-primary/50 bg-[#D0EBE8] dark:bg-primary/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg' : (user.itemsThisMonth >= 21 ? 'border-primary/20 bg-white dark:bg-dark-surface' : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/50 opacity-60')}`}>
                        {user.activeMultiplier === 2 && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                        <div className={`text-2xl font-black mb-1 ${user.activeMultiplier === 2 ? 'text-primary-dark dark:text-primary' : (user.itemsThisMonth >= 21 ? 'text-primary' : 'text-gray-400')}`}>2x</div>
                        <div className="text-[10px] font-bold text-gray-400">21+ ítems /<br />mes</div>
                        {user.itemsThisMonth < 21 && <span className="material-symbols-rounded text-gray-300 text-lg absolute top-2 right-2">lock</span>}
                    </div>
                </div>

                {isMultipliersLocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-border text-center max-w-[200px]">
                            <span className="material-symbols-rounded text-gray-400 text-3xl mb-2">lock</span>
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Desbloquea en nivel Ensamblador</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Perks Section */}
            <section>
                <h3 className="font-bold text-lg text-text dark:text-dark-text mb-4">Perks</h3>
                <div className="space-y-3">
                    <div className="bg-white dark:bg-dark-surface p-4 rounded-[24px] flex items-center gap-4 border border-gray-100 dark:border-dark-border shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
                            <span className="material-symbols-rounded filled-icon">potted_plant</span>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-text dark:text-dark-text">Eco-Semilla</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Recicla 5 ítems</div>
                        </div>
                        <span className="material-symbols-rounded text-primary filled-icon">check_circle</span>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-[24px] flex items-center gap-4 border border-gray-100 dark:border-gray-700 opacity-60">
                        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                            <span className="material-symbols-rounded">local_cafe</span>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-600 dark:text-gray-400">Café Gratis</div>
                            <div className="text-xs text-gray-500">Nivel Gold Saver</div>
                        </div>
                        <span className="material-symbols-rounded text-gray-400">lock</span>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderProgreso = () => {
        const filters: ProgressFilter[] = ['todos', 'completadas', 'diaria', 'semanal', 'mensual'];

        const filteredAchievements = user?.achievements.filter(ach => {
            if (activeFilter === 'todos') return true;
            if (activeFilter === 'completadas') return ach.completed;
            return ach.category === activeFilter;
        });

        return (
            <div className="animate-fade-in space-y-6 pb-8">
                <section>
                    <h3 className="font-bold text-lg text-text dark:text-dark-text mb-4">Misiones</h3>

                    {/* Filters */}
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`${CHIP_BASE} ${activeFilter === f ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredAchievements && filteredAchievements.length > 0 ? (
                            filteredAchievements.map(ach => (
                                <div key={ach.id} className="bg-white dark:bg-dark-surface p-5 rounded-[24px] border border-gray-100 dark:border-dark-border shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <h4 className="font-bold text-text dark:text-dark-text max-w-[70%]">{ach.title}</h4>
                                        {ach.isMedal ? (
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-0.5 ${ach.completed ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                                    <span className="material-symbols-rounded filled-icon">workspace_premium</span>
                                                </div>
                                                <span className={`text-[10px] font-bold ${ach.completed ? 'text-yellow-600' : 'text-gray-400'}`}>Medalla</span>
                                            </div>
                                        ) : (
                                            <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-0.5 ${ach.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-[#D0EBE8] dark:bg-primary/20 text-primary-dark dark:text-primary'}`}>
                                                <span className="material-symbols-rounded text-sm filled-icon">bolt</span> {ach.reward}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 relative z-10">{ach.description}</p>

                                    <div className="relative pt-2 z-10">
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${(ach.progress / ach.max) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[10px] text-gray-400">Progreso</span>
                                            <span className={`text-[10px] font-bold ${ach.completed ? 'text-green-600 dark:text-green-400' : 'text-text dark:text-dark-text'}`}>
                                                {ach.completed ? '¡Completado!' : `${ach.progress}/${ach.max}`}
                                            </span>
                                        </div>
                                    </div>
                                    {ach.completed && <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full z-0 opacity-50"></div>}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs">No hay misiones en esta categoría.</div>
                        )}
                    </div>
                </section>
            </div>
        );
    };

    const renderUsarPuntos = () => {
        const categories = ['Gift Card', 'Descuento', 'Producto', 'Donación'];

        const filteredCoupons = COUPONS.filter(coupon => {
            const matchesSearch = coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory ? coupon.category === activeCategory : true;
            return matchesSearch && matchesCategory;
        });

        return (
            <div className="animate-fade-in pb-8">

                {/* Search Bar */}
                <div className="mb-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-dark-border px-4 py-3 flex items-center gap-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <span className="material-symbols-rounded text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar premios..."
                        className="flex-1 outline-none text-sm text-text dark:text-dark-text placeholder:text-gray-400 bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <span className="material-symbols-rounded text-sm">close</span>
                        </button>
                    )}
                </div>

                {/* Filters Toggle & Active Category */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar items-center -mx-6 px-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`${CHIP_BASE} ${showFilters || activeCategory ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                    >
                        Filtrar <span className="material-symbols-rounded text-sm">{showFilters ? 'expand_less' : 'expand_more'}</span>
                    </button>

                    {activeCategory && !showFilters && (
                        <span className={`${CHIP_BASE} ${CHIP_ACTIVE}`}>{activeCategory}</span>
                    )}

                    {(activeCategory || searchQuery) && (
                        <button
                            onClick={clearFilters}
                            className={`${CHIP_BASE} ${CHIP_INACTIVE}`}
                        >
                            Limpiar <span className="material-symbols-rounded text-sm">close</span>
                        </button>
                    )}
                </div>

                {/* Collapsible Filter Categories */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-20 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                className={`${CHIP_BASE} ${activeCategory === cat ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filteredCoupons.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCoupons.map(coupon => {
                            const canAfford = user.points >= coupon.cost;
                            return (
                                <div key={coupon.id} className="flex flex-col gap-2">
                                    <div
                                        onClick={() => canAfford && handleCouponClick(coupon)}
                                        className={`aspect-square rounded-[32px] overflow-hidden relative group ${canAfford ? 'cursor-pointer active:scale-[0.98] transition-transform' : 'grayscale opacity-70 cursor-not-allowed'}`}
                                    >
                                        <img src={coupon.image} alt={coupon.title} className="w-full h-full object-cover" />
                                        {!canAfford && (
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                    <span className="material-symbols-rounded text-gray-500">lock</span>
                                                </div>
                                            </div>
                                        )}
                                        {canAfford && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-text dark:text-dark-text text-sm leading-tight mb-0.5">{coupon.title}</div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-[#00796B] dark:text-[#4DB6AC]">
                                            <span className="material-symbols-rounded filled-icon text-sm">bolt</span>
                                            {coupon.cost.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        No se encontraron resultados.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-background dark:bg-dark-bg transition-colors duration-300">
            {/* Header */}
            <div className="pt-6 pb-2 px-6 flex items-center justify-between bg-background dark:bg-dark-bg shrink-0">
                <h1 className="text-xl font-bold text-text dark:text-dark-text">E-Hub</h1>
                <div className="bg-[#D0EBE8] dark:bg-primary/20 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-rounded filled-icon text-primary-dark dark:text-primary text-sm">bolt</span>
                    <span className="font-bold text-primary-dark dark:text-primary text-sm">{user.points.toLocaleString()}</span>
                </div>
                <button className="text-gray-400">
                    <span className="material-symbols-rounded">more_vert</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">

                {/* Level Indicator (Reused Component) */}
                <LevelIndicator user={user} className="mb-6 mt-2" />

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 relative">
                    <button
                        onClick={() => setActiveTab('usar')}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative z-10 ${activeTab === 'usar' ? 'text-primary' : 'text-gray-400'}`}
                    >
                        Usar Puntos
                        {activeTab === 'usar' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('beneficios')}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative z-10 ${activeTab === 'beneficios' ? 'text-primary' : 'text-gray-400'}`}
                    >
                        Beneficios
                        {activeTab === 'beneficios' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('progreso')}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative z-10 ${activeTab === 'progreso' ? 'text-primary' : 'text-gray-400'}`}
                    >
                        Progreso
                        {activeTab === 'progreso' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
                            />
                        )}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'usar' && renderUsarPuntos()}
                {activeTab === 'beneficios' && renderBeneficios()}
                {activeTab === 'progreso' && renderProgreso()}
            </div>

            {/* Redemption Overlay */}
            {selectedCoupon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-[40px] p-6 shadow-2xl relative animate-slide-up">

                        {redemptionStatus === 'confirm' && (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 dark:text-yellow-400">
                                    <span className="material-symbols-rounded filled-icon text-4xl">help</span>
                                </div>
                                <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-2">Canjear cupón?</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                    Estás a punto de gastar {selectedCoupon.cost} E-Points por <span className="font-bold text-text dark:text-dark-text">{selectedCoupon.title}</span>
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={closeRedemption} className="flex-1 py-3.5 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-500 font-bold text-sm">
                                        Cancelar
                                    </button>
                                    <button onClick={confirmRedemption} className="flex-1 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
                                        Canjear
                                    </button>
                                </div>
                            </div>
                        )}

                        {redemptionStatus === 'processing' && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h2 className="text-xl font-bold text-text dark:text-dark-text">Procesando...</h2>
                            </div>
                        )}

                        {redemptionStatus === 'success' && (
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-text dark:text-dark-text mb-2">Cupón Canjeado!</h2>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-[#D0EBE8] dark:ring-primary/20">
                                    <span className="material-symbols-rounded filled-icon text-white text-3xl">check</span>
                                </div>
                                <div className="font-bold text-text dark:text-dark-text text-base mb-0.5">Has canjeado tu cupón exitosamente!</div>
                                <div className="text-gray-500 text-xs mb-3">{selectedCoupon.title}</div>

                                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm mx-auto w-32 h-32 mb-1">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedCoupon.id}-${Date.now()}`} alt="QR" className="w-full h-full" />
                                </div>
                                <div className="text-[10px] text-gray-400 mb-3">Código de validación</div>

                                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-2 flex justify-between items-center mb-3">
                                    <span className="font-mono text-gray-600 dark:text-gray-300 font-bold tracking-widest text-sm">GGE-1A2B3C-XYZ</span>
                                    <span className="material-symbols-rounded text-gray-400 text-base">content_copy</span>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-2 mb-4">
                                    <div className="text-yellow-700 dark:text-yellow-500 font-bold text-xs">Expira en 24:59:59</div>
                                    <div className="text-yellow-600/70 dark:text-yellow-500/70 text-[10px]">Válido hasta - - / - - / - - .</div>
                                </div>

                                <button onClick={closeRedemption} className="w-full py-3 rounded-full bg-[#00796B] text-white font-bold text-sm shadow-lg">
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hub;