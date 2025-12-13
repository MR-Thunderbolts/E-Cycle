import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
    id: string;
    label: string;
    icon?: string; // Material Symbol icon name
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: 'default' | 'pills';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    variant = 'default',
    className = '',
}) => {
    if (variant === 'pills') {
        // Pill-style tabs (like chips)
        return (
            <div className={`flex gap-2 overflow-x-auto no-scrollbar pb-2 ${className}`}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5
                                ${isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            {tab.icon && (
                                <span className={`material-symbols-rounded text-lg ${isActive ? 'filled-icon' : ''}`}>
                                    {tab.icon}
                                </span>
                            )}
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Default underline tabs
    return (
        <div className={`flex border-b border-gray-200 dark:border-gray-800 relative ${className}`}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative z-10 flex items-center justify-center gap-1.5
                            ${isActive
                                ? 'text-primary dark:text-accent'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.icon && (
                            <span className={`material-symbols-rounded text-lg ${isActive ? 'filled-icon' : ''}`}>
                                {tab.icon}
                            </span>
                        )}
                        {tab.label}
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-accent rounded-t-full"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
