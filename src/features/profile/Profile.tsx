import React, { useState } from 'react';
import { useAuth } from '@/hooks';
import { LevelIndicator, Avatar, Button, IconButton, MenuItem, Toggle, IconBox, Skeleton } from '@/components';
import { ECyclerProfileBadgeOverlay } from './ECyclerProfileBadgeOverlay';

interface ProfileScreenProps {
    onClose: () => void;
}

const Profile: React.FC<ProfileScreenProps> = ({ onClose }) => {
    const { user, loading, isDarkMode, toggleTheme } = useAuth();
    const [showSettings, setShowSettings] = useState(false);
    const [showProfileOverlay, setShowProfileOverlay] = useState(false);

    if (loading || !user) {
        return (
            <div className="h-full bg-background dark:bg-dark-bg flex flex-col overflow-hidden pt-6 px-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-between pb-2 mb-4 shrink-0">
                    <div className="w-8" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton circle className="w-8 h-8" />
                </div>
                {/* User card skeleton */}
                <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-dark-border mb-6">
                    <Skeleton circle className="w-14 h-14 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                {/* Settings button skeleton */}
                <Skeleton className="h-12 w-full rounded-full mb-8" />
                {/* Section label */}
                <Skeleton className="h-3 w-20 mb-4" />
                {/* Points card skeleton */}
                <div className="bg-white dark:bg-dark-surface rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-dark-border mb-4">
                    <Skeleton className="h-4 w-28 mb-3" />
                    <Skeleton className="h-10 w-24 mb-2" />
                    <Skeleton className="h-5 w-36 rounded-full" />
                </div>
                {/* Stats grid skeleton */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Skeleton className="h-40 rounded-[32px]" />
                    <Skeleton className="h-40 rounded-[32px]" />
                </div>
                {/* History skeleton items */}
                <Skeleton className="h-3 w-40 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-dark-surface rounded-[32px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-dark-border">
                            <Skeleton circle className="w-12 h-12 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-10" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Determine multiplier display based on level
    const multiplier = user.level === 'Reactivador' ? '2x' : user.level === 'Recolector' ? '1.5x' : user.level === 'Ensamblador' ? '1.2x' : '1x';
    const showMultiplier = user.level !== 'Descubridor';

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

                    {/* Unified Level & Identity Section (Clickable) */}
                    <div onClick={() => setShowProfileOverlay(true)} className="cursor-pointer active:scale-95 transition-transform origin-center mt-2 mb-6">
                        <LevelIndicator user={user} showUserIdentity={true} />
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
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide pl-1">Residuos Reciclados</h3>
                    </div>

                    {/* Stats Grid: Specific E-Waste Categories */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Celulares */}
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-36 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-sky-600 dark:text-sky-400 font-bold text-xs leading-tight">Celulares<br />y Tablets</span>
                                <span className="material-symbols-rounded filled-icon text-sky-500 dark:text-sky-400 text-xl group-hover:scale-110 transition-transform">smartphone</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-0.5 tracking-tight">
                                    {user.phonesRecycled || 0}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">unidades</div>
                            </div>
                        </div>

                        {/* Computadoras */}
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-36 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-violet-600 dark:text-violet-400 font-bold text-xs leading-tight">Computadoras<br />y Laptops</span>
                                <span className="material-symbols-rounded filled-icon text-violet-500 dark:text-violet-400 text-xl group-hover:scale-110 transition-transform">computer</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-0.5 tracking-tight">
                                    {user.computersRecycled || 0}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">unidades</div>
                            </div>
                        </div>

                        {/* Baterías */}
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-36 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-amber-600 dark:text-amber-500 font-bold text-xs leading-tight">Baterías<br />y Pilas</span>
                                <span className="material-symbols-rounded filled-icon text-amber-500 dark:text-amber-400 text-xl group-hover:scale-110 transition-transform">battery_charging_full</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-0.5 tracking-tight">
                                    {user.batteriesRecycled || 0}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">unidades</div>
                            </div>
                        </div>

                        {/* Cables */}
                        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-5 shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-36 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-emerald-600 dark:text-emerald-500 font-bold text-xs leading-tight">Cables y<br />Periféricos</span>
                                <span className="material-symbols-rounded filled-icon text-emerald-500 dark:text-emerald-400 text-xl group-hover:scale-110 transition-transform">cable</span>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-text dark:text-dark-text mb-0.5 tracking-tight">
                                    {user.cablesRecycledKg || 0}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">kilogramos</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Ecological Impact Footer Widget */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-6 border border-primary/20 dark:border-primary/40 mb-8 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center">
                        <div className="flex-1 text-center sm:text-left">
                            <h4 className="text-[10px] font-black text-primary/70 dark:text-accent/70 uppercase tracking-[0.2em] mb-4">Impacto Ambiental</h4>
                            <div className="flex justify-center sm:justify-start gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-rounded filled-icon text-violet-500 dark:text-violet-400 text-xl">public</span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-text dark:text-dark-text tracking-tight">{user.impact.co2}kg</div>
                                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">CO2 Salvado</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-rounded filled-icon text-emerald-500 dark:text-emerald-400 text-xl">forest</span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-text dark:text-dark-text tracking-tight">{user.impact.trees}</div>
                                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Árboles</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Badge with items count */}
                        <div className="bg-primary/10 dark:bg-accent/10 p-4 rounded-3xl border border-primary/20 dark:border-accent/20 flex flex-col items-center justify-center min-w-[100px]">
                            <div className="text-2xl font-black text-primary dark:text-accent ">{user.itemsThisMonth}</div>
                            <div className="text-[8px] font-black text-primary/70 dark:text-accent/70 uppercase tracking-widest">Este mes</div>
                        </div>
                    </div>



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

            {/* Gamification Profile Overlay */}
            <ECyclerProfileBadgeOverlay
                user={user}
                show={showProfileOverlay}
                onClose={() => setShowProfileOverlay(false)}
            />
        </div>
    );
};

export default Profile;
