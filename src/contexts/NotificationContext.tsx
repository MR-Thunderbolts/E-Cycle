import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Achievement } from '../types';

interface NotificationContextType {
    showAchievementToast: (achievement: Achievement) => void;
    currentAchievement: Achievement | null;
    clearToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const showAchievementToast = (achievement: Achievement) => {
        setCurrentAchievement(achievement);
    };

    const clearToast = () => {
        setCurrentAchievement(null);
    };

    return (
        <NotificationContext.Provider value={{ showAchievementToast, currentAchievement, clearToast }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
