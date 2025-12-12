import React from 'react';

interface SpecialMissionCardProps {
    title: string;
    subtitle: string;
    logo: string;
    bonusPoints: number;
    onClick?: () => void;
    variant?: 'default' | 'time-based' | 'perk';
    timeLeft?: string;
    compact?: boolean;
}

export const SpecialMissionCard: React.FC<SpecialMissionCardProps> = ({
    title,
    subtitle,
    logo,
    bonusPoints,
    onClick,
    variant = 'default',
    timeLeft,
    compact = false
}) => {
    const isTimeBased = variant === 'time-based';
    const isPerk = variant === 'perk';
    const isDefault = variant === 'default';

    let mainColor = '#1DE9B6'; // Default Teal
    let accentColor = '#004D40';
    let glowColor = 'rgba(29, 233, 182, 0.5)';
    let badgeGlow = 'rgba(29, 233, 182, 0.6)';
    let icon = 'savings';

    if (isTimeBased) {
        mainColor = '#7C4DFF'; // Deep Purple
        accentColor = '#651FFF';
        glowColor = 'rgba(124, 77, 255, 0.5)';
        badgeGlow = 'rgba(124, 77, 255, 0.6)';
        icon = 'bolt';
    } else if (isPerk) {
        mainColor = '#7C4DFF'; // Purple (matching Cazador de Circuitos perk)
        accentColor = '#651FFF';
        glowColor = 'rgba(168, 85, 247, 0.5)';
        badgeGlow = 'rgba(168, 85, 247, 0.6)';
        icon = 'memory';
    }

    return (
        <div
            onClick={onClick}
            className={`relative bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-4 flex items-center justify-between overflow-visible cursor-pointer active:scale-[0.98] transition-transform ${compact ? 'min-w-[85vw] w-[85vw]' : 'w-full'}`}
        >
            {/* Left Drag Indicator (3 Lines) */}
            <div className="absolute left-4 top-0 bottom-0 flex items-center gap-1">
                <div
                    className={`w-1 rounded-full ${isDefault ? 'bg-primary dark:bg-accent shadow-[0_0_10px_rgba(4,122,108,0.5)] dark:shadow-[0_0_10px_rgba(29,233,182,0.5)]' : ''}`}
                    style={{
                        height: '24px',
                        backgroundColor: isDefault ? undefined : mainColor,
                        boxShadow: isDefault ? undefined : `0 0 10px ${glowColor}`
                    }}
                ></div>
                <div
                    className={`w-1 rounded-full ${isDefault ? 'bg-primary dark:bg-accent shadow-[0_0_10px_rgba(4,122,108,0.5)] dark:shadow-[0_0_10px_rgba(29,233,182,0.5)]' : ''}`}
                    style={{
                        height: '36px',
                        backgroundColor: isDefault ? undefined : mainColor,
                        boxShadow: isDefault ? undefined : `0 0 10px ${glowColor}`
                    }}
                ></div>
                <div
                    className={`w-1 rounded-full ${isDefault ? 'bg-primary dark:bg-accent shadow-[0_0_10px_rgba(4,122,108,0.5)] dark:shadow-[0_0_10px_rgba(29,233,182,0.5)]' : ''}`}
                    style={{
                        height: '48px',
                        backgroundColor: isDefault ? undefined : mainColor,
                        boxShadow: isDefault ? undefined : `0 0 10px ${glowColor}`
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="pl-10 flex-1">
                <h3 className="font-bold text-lg text-text dark:text-dark-text leading-tight mb-1">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
                {isTimeBased && timeLeft && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-rounded text-xs text-gray-400">timer</span>
                        <span className="text-xs font-bold text-gray-400">{timeLeft}</span>
                    </div>
                )}
                {isPerk && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-rounded text-xs" style={{ color: mainColor }}>auto_awesome</span>
                        <span className="text-xs font-bold" style={{ color: mainColor }}>Perk del Mes</span>
                    </div>
                )}
            </div>

            {/* Logo Container */}
            <div className="w-20 h-20 border border-gray-100 dark:border-dark-border rounded-2xl flex items-center justify-center p-2 bg-white dark:bg-white/5 shrink-0 ml-4">
                {isPerk ? (
                    <span className="material-symbols-rounded text-4xl" style={{ color: mainColor }}>{logo}</span>
                ) : (
                    <img src={logo} alt="Brand Logo" className="w-full h-full object-contain" />
                )}
            </div>

            {/* Floating Badge - Hidden for Perks */}
            {!isPerk && (
                <div
                    className={`absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center transform rotate-3 z-10 ${isDefault ? 'bg-primary dark:bg-accent text-accent dark:text-[#121212] shadow-[0_0_15px_rgba(4,122,108,0.5)] dark:shadow-[0_0_15px_rgba(29,233,182,0.6)]' : ''}`}
                    style={isDefault ? {} : {
                        backgroundColor: mainColor,
                        color: (isTimeBased || isPerk) ? 'white' : accentColor,
                        boxShadow: `0 0 15px ${badgeGlow}`
                    }}
                >
                    <span className={`material-symbols-rounded filled-icon ${(isTimeBased || isPerk) ? 'text-white' : ''}`}>
                        {icon}
                    </span>
                </div>
            )}
        </div>
    );
};
