import React, { useState } from 'react';
import { useAuth } from '@/hooks';
import { LevelIndicator, Avatar, Button, IconButton, MenuItem, Toggle, IconBox } from '@/components';

interface ProfileScreenProps {
    onClose: () => void;
}

const Profile: React.FC<ProfileScreenProps> = ({ onClose }) => {
    const { user, isDarkMode, toggleTheme } = useAuth();
    const [showSettings, setShowSettings] = useState(false);

    // Render each section efficiently
    const renderSettings = () => (
        <div className="h-full bg-background dark:bg-dark-bg flex flex-col animate-slide-up transform transition-transform duration-300">
            {/* Settings Header */}
            <div className="pt-6 pb-2 px-6 flex items-center gap-4 bg-background dark:bg-dark-bg shrink-0">
                <IconButton
                    icon="arrow_back"
                    onClick={() => setShowSettings(false)}
                    ariaLabel="Regresar"
                />
                <h1 className="text-lg font-bold text-text dark:text-dark-text">Configuración</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar pb-safe-bottom">

                {/* CUENTA Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Cuenta</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <MenuItem icon="lock" label="Cambiar Contraseña" />
                        <MenuItem icon="mail" label="Actualizar mi correo" />
                        <MenuItem icon="map" label="Actualizar dirección de residencia" border={false} />
                    </div>
                </section>

                {/* NOTIFICACIONES Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Notificaciones</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <MenuItem icon="notifications" label="Notificaciones dentro de la app" />
                        <MenuItem
                            icon="push_pin"
                            label="Notificaciones Push"
                            rightElement={<Toggle checked={true} onChange={() => { }} />}
                            border={false}
                        />
                    </div>
                </section>

                {/* APARIENCIA Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Apariencia</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <MenuItem
                            icon="dark_mode"
                            label="Modo Oscuro"
                            rightElement={<Toggle checked={isDarkMode} onChange={toggleTheme} />}
                            border={false}
                        />
                    </div>
                </section>

                {/* DATA Y PRIVACIDAD Section */}
                <section className="mb-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Data y Privacidad</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <MenuItem icon="gavel" label="Términos de Servicio" />
                        <MenuItem icon="security" label="Política de Privacidad" />
                        <MenuItem
                            icon="delete"
                            label="Borrar Cuenta"
                            variant="danger"
                            border={false}
                        />
                    </div>
                </section>

                {/* SOPORTE Section */}
                <section className="mb-12">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">Soporte</h3>
                    <div className="bg-white dark:bg-dark-surface rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
                        <MenuItem icon="help" label="Ayuda y Soporte" border={false} />
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
                    <IconButton
                        icon="close"
                        onClick={onClose}
                        variant="ghost"
                        ariaLabel="Cerrar perfil"
                    />
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
                    <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        fullWidth
                        icon="settings"
                        className="mb-8 border border-primary dark:border-accent !text-primary dark:!text-accent bg-[#D0EBE8]/30 dark:bg-primary/10 hover:bg-[#D0EBE8] dark:hover:bg-primary/20"
                    >
                        Configuración
                    </Button>

                    {/* Impact Section */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-wide pl-1">Tu Impacto</h3>

                    {/* Points Balance */}
                    <div className="bg-white dark:bg-dark-surface rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-dark-border mb-4 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-primary-dark dark:text-accent font-bold text-sm">Balance E-Points</span>
                            <span className="material-symbols-rounded filled-icon text-primary dark:text-accent text-2xl group-hover:scale-110 transition-transform">bolt</span>
                        </div>
                        <div className="text-4xl font-black text-text dark:text-dark-text mb-1 tracking-tight flex items-baseline gap-2">
                            {user.points.toLocaleString()}
                            {showMultiplier && (
                                <span className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold align-middle">
                                    {multiplier} Activo
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-primary dark:text-accent font-bold bg-[#D0EBE8]/50 dark:bg-primary/20 inline-block px-2 py-1 rounded-md">
                            +50% más que el último mes
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start">
                                <span className="text-primary-dark dark:text-accent font-bold text-sm leading-tight">CO2<br />Salvado</span>
                                <span className="material-symbols-rounded text-primary-dark dark:text-accent text-xl">public</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-1 tracking-tight">{user.impact.co2}kg</div>
                                <div className="text-[10px] text-primary dark:text-accent font-bold leading-tight">+20% más que el último mes</div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-40">
                            <div className="flex justify-between items-start">
                                <span className="text-primary-dark dark:text-accent font-bold text-sm leading-tight">Árboles<br />plantados</span>
                                <span className="material-symbols-rounded text-primary-dark dark:text-accent text-xl">forest</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-1 tracking-tight">{user.impact.trees}</div>
                                <div className="text-[10px] text-primary dark:text-accent font-bold leading-tight">+10% más que el último mes</div>
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
                                <IconBox icon={ach.icon} size="xl" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-text dark:text-dark-text text-sm">{ach.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                                </div>
                                <span className="material-symbols-rounded text-primary dark:text-accent filled-icon text-2xl mr-2">check_circle</span>
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
                                    <IconBox icon={tx.icon} size="xl" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-text dark:text-dark-text text-sm">{tx.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                                    </div>
                                    <span className={`font-bold mr-2 ${tx.points > 0 ? 'text-primary dark:text-accent' : 'text-gray-400'}`}>
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
