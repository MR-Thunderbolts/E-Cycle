import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { LEVEL_THRESHOLDS } from '@/constants';
import { LevelIndicator, Avatar } from '@/components';

interface ProfileScreenProps {
    onClose: () => void;
}

const Profile: React.FC<ProfileScreenProps> = ({ onClose }) => {
    const { user, isDarkMode, toggleTheme } = useAuth();
    const [showSettings, setShowSettings] = useState(false);

    const renderSettings = () => (
        <div className="h-full bg-background dark:bg-dark-bg flex flex-col animate-slide-up transform transition-transform duration-300">
            {/* Settings Header */}
            <div className="pt-6 pb-2 px-6 flex items-center gap-4 bg-background dark:bg-dark-bg shrink-0">
                <button
                    onClick={() => setShowSettings(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <span className="material-symbols-rounded">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-text dark:text-dark-text">Configuración</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar pb-safe-bottom">

                {/* CUENTA Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Cuenta</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">lock</span>
                            </div>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-text dark:text-dark-text">Cambiar Contraseña</span>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">mail</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text">Actualizar mi correo</div>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">map</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text">Actualizar dirección de residencia</div>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* NOTIFICACIONES Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Notificaciones</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">notifications</span>
                            </div>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-text dark:text-dark-text">Notificaciones dentro de la app</span>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                        <div className="w-full p-4 flex items-center gap-4 bg-white dark:bg-dark-surface">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">push_pin</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text">Notificaciones Push</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* APARIENCIA Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Apariencia</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <div className="w-full p-4 flex items-center gap-4 bg-white dark:bg-dark-surface">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">dark_mode</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text">Modo Oscuro</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isDarkMode}
                                    onChange={toggleTheme}
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* DATA Y PRIVACIDAD Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Data y Privacidad</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">gavel</span>
                            </div>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-text dark:text-dark-text">Términos de Servicio</span>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">security</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text">Política de Privacidad</div>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                                <span className="material-symbols-rounded">delete</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-text dark:text-dark-text group-hover:text-red-500 transition-colors">Borrar Cuenta</div>
                            </div>
                            <span className="material-symbols-rounded text-gray-400 group-hover:text-red-300">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* SOPORTE Section */}
                <section className="mb-12">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Soporte</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                <span className="material-symbols-rounded">help</span>
                            </div>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-text dark:text-dark-text">Ayuda y Soporte</span>
                            </div>
                            <span className="material-symbols-rounded text-gray-400">chevron_right</span>
                        </button>
                    </div>
                </section>

                <div className="text-center text-[10px] text-gray-400 pb-8">App Versión 1.0.0</div>
            </div>
        </div>
    );

    if (!user) return null;

    // Determine multiplier display based on level
    const multiplier = user.level === 'Reactivador' ? '2x' : user.level === 'Recolector' ? '1.5x' : user.level === 'Ensamblador' ? '1.2x' : '1x';
    const showMultiplier = user.level !== 'Descubridor';

    return (
        <div className="h-full bg-background dark:bg-dark-bg flex flex-col overflow-hidden animate-fade-in relative transition-colors duration-300">

            {/* Sliding Settings Layer */}
            <div
                className={`absolute inset-0 bg-background dark:bg-dark-bg z-20 transition-transform duration-300 ease-in-out ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {renderSettings()}
            </div>

            {/* Main Profile Content */}
            <div className={`flex flex-col h-full transition-transform duration-300 ease-in-out ${showSettings ? '-translate-x-1/3 opacity-50' : 'translate-x-0'}`}>
                {/* Header */}
                <div className="pt-6 pb-2 px-6 flex items-center justify-between bg-background dark:bg-dark-bg shrink-0">
                    <div className="w-8"></div> {/* Spacer to center title */}
                    <h1 className="text-lg font-bold text-text dark:text-dark-text">E-Cycle</h1>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-safe-bottom no-scrollbar">

                    {/* User Card */}
                    <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-dark-border mb-6 mt-2">
                        <Avatar size="lg" />
                        <div className="flex-1 overflow-hidden">
                            <h2 className="font-bold text-text dark:text-dark-text text-lg truncate">{user.name}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full py-3.5 rounded-full border border-primary text-primary dark:text-primary-light font-bold flex items-center justify-center gap-2 mb-8 bg-[#D0EBE8]/30 dark:bg-primary/10 active:bg-[#D0EBE8] dark:active:bg-primary/20 transition-colors shadow-sm active:scale-[0.98]"
                    >
                        <span className="material-symbols-rounded filled-icon">settings</span>
                        Configuración
                    </button>

                    {/* Impact Section */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-wide pl-1">Tu Impacto</h3>

                    {/* Points Balance */}
                    <div className="bg-white dark:bg-dark-surface rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-dark-border mb-4 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-primary-dark dark:text-primary font-bold text-sm">Balance E-Points</span>
                            <span className="material-symbols-rounded filled-icon text-primary dark:text-primary text-2xl group-hover:scale-110 transition-transform">bolt</span>
                        </div>
                        <div className="text-4xl font-black text-text dark:text-dark-text mb-1 tracking-tight flex items-baseline gap-2">
                            {user.points.toLocaleString()}
                            {showMultiplier && (
                                <span className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold align-middle">
                                    {multiplier} Activo
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-primary dark:text-primary font-bold bg-[#D0EBE8]/50 dark:bg-primary/20 inline-block px-2 py-1 rounded-md">
                            +50% más que el último mes
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start">
                                <span className="text-primary-dark dark:text-primary font-bold text-sm leading-tight">CO2<br />Salvado</span>
                                <span className="material-symbols-rounded text-primary-dark dark:text-primary text-xl">public</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-1 tracking-tight">{user.impact.co2}kg</div>
                                <div className="text-[10px] text-primary dark:text-primary font-bold leading-tight">+20% más que el último mes</div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start">
                                <span className="text-primary-dark dark:text-primary font-bold text-sm leading-tight">Árboles<br />plantados</span>
                                <span className="material-symbols-rounded text-primary-dark dark:text-primary text-xl">forest</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-1 tracking-tight">{user.impact.trees}</div>
                                <div className="text-[10px] text-primary dark:text-primary font-bold leading-tight">+10% más que el último mes</div>
                            </div>
                        </div>
                    </div>

                    {/* Level Section (Reused Component) */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-wide pl-1">Tu Nivel Actual</h3>
                    <LevelIndicator user={user} className="mb-8" />

                    {/* Logros Section */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-wide pl-1">Logros Completados</h3>
                    {user.achievements.filter(a => a.completed).length > 0 ? (
                        user.achievements.filter(a => a.completed).map(ach => (
                            <div key={ach.id} className="bg-white dark:bg-dark-surface rounded-[32px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-dark-border mb-4">
                                <div className="w-14 h-14 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                    <span className="material-symbols-rounded text-2xl filled-icon">{ach.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text dark:text-dark-text text-sm">{ach.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                                </div>
                                <span className="material-symbols-rounded text-primary filled-icon text-2xl mr-2">check_circle</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 text-xs mb-8">Aún no has completado logros.</p>
                    )}


                    {/* Historial Section */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 mt-6 uppercase tracking-wide pl-1">Historial de Reciclaje</h3>
                    <div className="space-y-3 mb-12">
                        {user.history.length > 0 ? (
                            user.history.map(tx => (
                                <div key={tx.id} className="bg-white dark:bg-dark-surface rounded-[32px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-dark-border">
                                    <div className="w-14 h-14 rounded-full bg-[#D0EBE8] dark:bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary shrink-0">
                                        <span className="material-symbols-rounded text-2xl">{tx.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-text dark:text-dark-text text-sm">{tx.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                                    </div>
                                    <span className={`font-bold mr-2 ${tx.points > 0 ? 'text-primary' : 'text-gray-400'}`}>
                                        {tx.points > 0 ? '+' : ''}{tx.points}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 text-xs py-4">No hay actividad reciente.</p>
                        )}
                    </div>

                    <div className="text-center text-[10px] text-gray-300 dark:text-gray-600 pb-8">App Versión 1.0.0</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;