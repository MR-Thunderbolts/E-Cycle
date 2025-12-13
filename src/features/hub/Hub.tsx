import React, { useEffect, useState } from 'react';
import { Coupon, HubTab } from '@/types';
import { useAuth } from '@/hooks';
import { COUPONS } from '@/constants';
import { LevelIndicator, Button, Modal, LoadingSpinner, EmptyState, Chip, Tabs, SearchBar, Tab } from '@/components';

type RedemptionStatus = 'idle' | 'confirm' | 'processing' | 'success';
type ProgressFilter = 'todos' | 'completadas' | 'diaria' | 'semanal' | 'mensual';

interface HubScreenProps {
    initialTab?: HubTab;
}



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

    // Countdown timer for monthly perks
    const [timeLeft, setTimeLeft] = useState('');

    // Update tab if initialTab prop changes
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // Calculate time left in month
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            const diff = endOfMonth.getTime() - now.getTime();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            return `${days}d ${hours}h ${minutes}m`;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

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

    if (!user) return (
        <div className="p-8 flex justify-center">
            <LoadingSpinner size="lg" variant="primary" />
        </div>
    );

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

                <div className={`flex gap-4 overflow-x-auto no-scrollbar py-4 transition-opacity -mx-6 px-6 ${isMultipliersLocked ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
                    {/* Card 1x (Default) */}
                    {(() => {
                        const isActive = user.activeMultiplier === 1;
                        return (
                            <div className={`min-w-[100px] flex-1 border-2 rounded-[24px] p-4 flex flex-col items-center justify-center text-center shrink-0 transition-all relative overflow-hidden
                                ${isActive
                                    ? 'border-primary dark:border-accent bg-white dark:bg-accent/10 shadow-md dark:shadow-[0_0_15px_rgba(29,233,182,0.25)]'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface opacity-50'}`}>
                                <div className={`text-3xl font-black mb-1 transition-all ${isActive ? 'text-primary dark:text-accent drop-shadow-[0_0_8px_rgba(4,122,108,0.5)] dark:drop-shadow-[0_0_8px_rgba(29,233,182,0.5)]' : 'text-gray-400'}`}>1x</div>
                                <div className="text-[10px] font-bold text-gray-400">0-4 ítems</div>
                            </div>
                        );
                    })()}

                    {/* Card 1.5x */}
                    {(() => {
                        const isActive = user.activeMultiplier === 1.5;
                        const isUnlocked = user.itemsThisMonth >= 5;
                        return (
                            <div className={`min-w-[100px] flex-1 border-2 rounded-[24px] p-4 flex flex-col items-center justify-center text-center shrink-0 transition-all relative overflow-hidden
                                ${isActive
                                    ? 'border-primary dark:border-accent bg-white dark:bg-accent/10 shadow-md dark:shadow-[0_0_15px_rgba(29,233,182,0.25)]'
                                    : isUnlocked
                                        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface/50 opacity-50'}`}>
                                {!isUnlocked && <span className="material-symbols-rounded text-gray-300 text-lg absolute top-2 right-2">lock</span>}
                                <div className={`text-3xl font-black mb-1 transition-all ${isActive ? 'text-primary dark:text-accent drop-shadow-[0_0_8px_rgba(4,122,108,0.5)] dark:drop-shadow-[0_0_8px_rgba(29,233,182,0.5)]' : isUnlocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>1.5x</div>
                                <div className="text-[10px] font-bold text-gray-400">5-9 ítems</div>
                            </div>
                        );
                    })()}

                    {/* Card 2x */}
                    {(() => {
                        const isActive = user.activeMultiplier === 2;
                        const isUnlocked = user.itemsThisMonth >= 10;
                        return (
                            <div className={`min-w-[100px] flex-1 border-2 rounded-[24px] p-4 flex flex-col items-center justify-center text-center shrink-0 transition-all relative overflow-hidden
                                ${isActive
                                    ? 'border-primary dark:border-accent bg-white dark:bg-accent/10 shadow-md dark:shadow-[0_0_15px_rgba(29,233,182,0.25)]'
                                    : isUnlocked
                                        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface/50 opacity-50'}`}>
                                {!isUnlocked && <span className="material-symbols-rounded text-gray-300 text-lg absolute top-2 right-2">lock</span>}
                                <div className={`text-3xl font-black mb-1 transition-all ${isActive ? 'text-primary dark:text-accent drop-shadow-[0_0_8px_rgba(4,122,108,0.5)] dark:drop-shadow-[0_0_8px_rgba(29,233,182,0.5)]' : isUnlocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>2x</div>
                                <div className="text-[10px] font-bold text-gray-400">10+ ítems</div>
                            </div>
                        );
                    })()}
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
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-text dark:text-dark-text mb-1">Tus Perks</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[280px]">
                        Cada mes hay un nuevo perk disponible. Desbloquéalo y úsalo por 30 días. ¡Combínalos con perks anteriores!
                    </p>
                </div>
                <div className="space-y-3">
                    {COUPONS.filter(c => c.isPerk).map((perk) => {
                        // Real completion logic for Cazador de Circuitos
                        // Simulates: 1 computer OR 2 phones recycled
                        const computersRecycled = user.computersRecycled || 0;
                        const phonesRecycled = user.phonesRecycled || 0;
                        const batteriesRecycled = user.batteriesRecycled || 0;
                        const cablesRecycled = user.cablesRecycledKg || 0;

                        let isLocked = true;
                        if (perk.id === 'p1') { // Minero de Litio
                            isLocked = batteriesRecycled < 50;
                        } else if (perk.id === 'p2') { // Cazador de Circuitos
                            isLocked = !(computersRecycled >= 1 || phonesRecycled >= 2);
                        } else if (perk.id === 'p3') { // Guardián del Cobre
                            isLocked = cablesRecycled < 15;
                        }

                        // Color palette based on perkColor
                        const colorMap = {
                            green: {
                                border: 'border-emerald-400/50 ring-emerald-400/30',
                                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                                glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
                                iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
                                iconText: 'text-emerald-700 dark:text-emerald-400',
                                gradient: 'from-emerald-500/5',
                                badge: 'bg-emerald-100 text-emerald-700'
                            },
                            purple: {
                                border: 'border-purple-400/50 ring-purple-400/30',
                                bg: 'bg-purple-50 dark:bg-purple-500/10',
                                glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
                                iconBg: 'bg-purple-100 dark:bg-purple-500/20',
                                iconText: 'text-purple-700 dark:text-purple-400',
                                gradient: 'from-purple-500/5',
                                badge: 'bg-purple-100 text-purple-700'
                            },
                            orange: {
                                border: 'border-orange-400/50 ring-orange-400/30',
                                bg: 'bg-orange-50 dark:bg-orange-500/10',
                                glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]',
                                iconBg: 'bg-orange-100 dark:bg-orange-500/20',
                                iconText: 'text-orange-700 dark:text-orange-400',
                                gradient: 'from-orange-500/5',
                                badge: 'bg-orange-100 text-orange-700'
                            }
                        };

                        const colors = colorMap[perk.perkColor || 'green'];

                        return (
                            <div key={perk.id} className="relative group mt-6">
                                {/* Perk del Mes Badge - Floating outside the card */}
                                {perk.isCurrentMonthPerk && (
                                    <div className={`absolute -top-3 left-4 ${colors.badge} text-[10px] font-bold px-3 py-1 rounded-full shadow-md border-2 border-white dark:border-dark-surface whitespace-nowrap z-20`}>
                                        Perk del Mes
                                    </div>
                                )}

                                <div
                                    className={`relative p-4 rounded-[24px] flex items-center gap-4 border shadow-sm overflow-hidden transition-all
                                        ${isLocked
                                            ? 'bg-gray-50 dark:bg-dark-surface/50 border-gray-200 dark:border-dark-border opacity-70 grayscale'
                                            : `bg-white dark:bg-dark-surface ${colors.border} ring-1`
                                        }`}
                                >
                                    {/* Icon Container */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden transition-all ${isLocked ? 'bg-gray-200 dark:bg-gray-700' : `${colors.iconBg} ${colors.glow}`}`}>
                                        <span className={`material-symbols-rounded text-3xl relative z-10 ${isLocked ? 'text-gray-400' : `${colors.iconText} drop-shadow-sm`}`}>
                                            {perk.image}
                                        </span>
                                    </div>

                                    <div className="flex-1 z-10">
                                        <div className="flex justify-between items-start">
                                            <div className={`font-bold text-base mb-0.5 ${isLocked ? 'text-gray-500' : 'text-text dark:text-dark-text'}`}>
                                                {perk.title}
                                            </div>
                                            {!isLocked && (
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className={`px-2 py-0.5 ${colors.badge} text-[10px] font-bold rounded-full`}>Activo</span>
                                                    <span className="text-[9px] text-gray-400 font-mono">{timeLeft}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 leading-tight">
                                            {perk.description}
                                        </div>

                                        {isLocked && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-1 bg-gray-200 dark:bg-gray-700/50 px-2 py-1 rounded-lg w-fit">
                                                <span className="material-symbols-rounded text-xs">lock</span>
                                                Misión: {perk.unlockMission}
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Gradient for Active State */}
                                    {!isLocked && (
                                        <div className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l ${colors.gradient} to-transparent pointer-events-none`}></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section >
        </div >
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
                            <Chip
                                key={f}
                                active={activeFilter === f}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </Chip>
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
                                            <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-0.5 ${ach.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-[#D0EBE8] dark:bg-primary/20 text-primary-dark dark:text-accent'}`}>
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
                            <EmptyState
                                icon="inbox"
                                title="No hay misiones en esta categoría"
                                description="Prueba con otro filtro para ver más misiones."
                            />
                        )}
                    </div>
                </section>
            </div>
        );
    };

    const renderUsarPuntos = () => {
        const categories = ['Gift Card', 'Descuento', 'Producto', 'Donación'];

        const filteredCoupons = COUPONS.filter(coupon => {
            if (coupon.isPerk) return false; // Exclude perks from this section
            const matchesSearch = coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory ? coupon.category === activeCategory : true;
            return matchesSearch && matchesCategory;
        });

        return (
            <div className="animate-fade-in pb-8">

                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Buscar premios..."
                    className="mb-4"
                />

                {/* Filters Toggle & Active Category */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar items-center -mx-6 px-6">
                    <Chip
                        active={showFilters || !!activeCategory}
                        onClick={() => setShowFilters(!showFilters)}
                        icon={showFilters ? 'expand_less' : 'expand_more'}
                    >
                        Filtrar
                    </Chip>

                    {activeCategory && !showFilters && (
                        <Chip active={true}>{activeCategory}</Chip>
                    )}

                    {(activeCategory || searchQuery) && (
                        <Chip
                            onClick={clearFilters}
                            icon="close"
                        >
                            Limpiar
                        </Chip>
                    )}
                </div>

                {/* Collapsible Filter Categories */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-20 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                        {categories.map(cat => (
                            <Chip
                                key={cat}
                                active={activeCategory === cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            >
                                {cat}
                            </Chip>
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
                    <EmptyState
                        icon="search_off"
                        title="No se encontraron resultados"
                        description="Intenta con otros términos de búsqueda o limpia los filtros."
                        action={
                            <Button variant="primary" size="sm" onClick={clearFilters}>
                                Limpiar Filtros
                            </Button>
                        }
                    />
                )
                }
            </div >
        );
    };

    return (
        <div className="h-full flex flex-col bg-background dark:bg-dark-bg transition-colors duration-300">
            {/* Header */}
            <div className="pt-6 pb-2 px-6 flex items-center justify-between bg-background dark:bg-dark-bg shrink-0">
                <h1 className="text-xl font-bold text-text dark:text-dark-text">E-Hub</h1>
                <div className="bg-[#D0EBE8] dark:bg-primary/20 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-rounded filled-icon text-primary dark:text-accent text-sm">bolt</span>
                    <span className="font-bold text-primary dark:text-accent text-sm">{user.points.toLocaleString()}</span>
                </div>
                <button className="text-gray-400">
                    <span className="material-symbols-rounded">more_vert</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">

                {/* Level Indicator (Reused Component) */}
                <LevelIndicator user={user} className="mb-6 mt-2" />

                {/* Tabs */}
                <Tabs
                    tabs={[
                        { id: 'usar', label: 'Usar Puntos' },
                        { id: 'beneficios', label: 'Beneficios' },
                        { id: 'progreso', label: 'Progreso' },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as HubTab)}
                    className="mb-6"
                />

                {/* Content */}
                {activeTab === 'usar' && renderUsarPuntos()}
                {activeTab === 'beneficios' && renderBeneficios()}
                {activeTab === 'progreso' && renderProgreso()}
            </div>

            {/* Redemption Modal */}
            <Modal
                open={!!selectedCoupon}
                onClose={closeRedemption}
                size="sm"
            >
                {redemptionStatus === 'confirm' && selectedCoupon && (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 dark:text-yellow-400">
                            <span className="material-symbols-rounded filled-icon text-4xl">help</span>
                        </div>
                        <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-2">¿Canjear cupón?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            Estás a punto de gastar {selectedCoupon.cost} E-Points por <span className="font-bold text-text dark:text-dark-text">{selectedCoupon.title}</span>
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={closeRedemption}
                                variant="danger"
                                size="lg"
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmRedemption}
                                variant="primary"
                                size="lg"
                                className="flex-1"
                            >
                                Canjear
                            </Button>
                        </div>
                    </div>
                )}

                {redemptionStatus === 'processing' && (
                    <div className="text-center py-8">
                        <LoadingSpinner size="lg" text="Procesando..." />
                    </div>
                )}

                {redemptionStatus === 'success' && selectedCoupon && (
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-text dark:text-dark-text mb-2 pt-4">¡Cupón Canjeado!</h2>
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-[#D0EBE8] dark:ring-primary/20">
                            <span className="material-symbols-rounded filled-icon text-white text-3xl">check</span>
                        </div>
                        <div className="font-bold text-text dark:text-dark-text text-base mb-0.5">¡Canje exitoso!</div>
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
                            <div className="text-yellow-700 dark:text-yellow-500 font-bold text-xs">Expira en 24h</div>
                            <div className="text-yellow-600/70 dark:text-yellow-500/70 text-[10px]">Válido hasta mañana</div>
                        </div>

                        <Button
                            onClick={closeRedemption}
                            variant="primary"
                            size="lg"
                            fullWidth
                        >
                            Continuar
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Hub;