import React from 'react';
import { TabType } from '@/types';

export interface BottomNavBarProps {
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onTabChange }) => {
    // Configuración de Tabs con íconos Material Symbols
    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'explorar', label: 'Explorar', icon: 'explore' },
        { id: 'retiro', label: 'Retiro', icon: 'local_shipping' },
        { id: 'escaner', label: 'Escaner', icon: 'qr_code_scanner' },
        { id: 'ehub', label: 'E-Hub', icon: 'bolt' },
    ];

    return (
        <div className="w-full bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border pb-safe-bottom rounded-t-[32px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] transition-colors duration-300">
            <div className="grid grid-cols-4 h-[100px] px-2 items-center pt-4">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;

                    return (
                        <div key={tab.id} className="flex justify-center items-center w-full h-full relative">
                            <button
                                onClick={() => onTabChange(tab.id)}
                                className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive
                                    ? 'bg-[#E0F2F1] dark:bg-teal-400/10 text-[#00695C] dark:text-[#1DE9B6] w-[72px] h-[72px] rounded-[24px] border border-teal-100 dark:border-teal-400/20 -translate-y-2'
                                    : 'text-gray-400 dark:text-gray-500 w-16 h-16 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl'
                                    }`}
                            >
                                <span className={`material-symbols-rounded text-[28px] mb-0.5 transition-transform duration-300 ${isActive ? 'filled-icon scale-105 drop-shadow-[0_0_8px_rgba(0,121,107,0.5)]' : ''}`}>
                                    {tab.icon}
                                </span>
                                <span className={`text-[10px] font-bold tracking-tight leading-none ${isActive ? 'block' : 'font-semibold'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
