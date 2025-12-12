import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { DEFAULT_ACHIEVEMENTS } from '@/constants';
import { apiService } from '@/services';
import { AuthContext } from './AuthContext';
import { initializeAnalytics, detectMazeSession, analytics } from '@/utils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize analytics and detect Maze sessions
    useEffect(() => {
        initializeAnalytics();
        detectMazeSession();
    }, []);

    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const loadUser = async () => {
        try {
            const userData = await apiService.fetchUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to load user", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const deposit = async (items: Record<string, number>, points: number) => {
        if (!user) return;
        const updatedUser = await apiService.submitDropoff(user, items, points);
        setUser(updatedUser);
    };

    const redeem = async (cost: number) => {
        if (!user) return false;
        const updatedUser = await apiService.redeemCoupon(user, cost);
        if (updatedUser) {
            setUser(updatedUser);
            return true;
        }
        return false;
    };

    const loginAsGuest = () => {
        setUser({
            uid: 'guest',
            name: 'Invitado',
            email: '',
            points: 0,
            level: 'Descubridor',
            itemsThisMonth: 0,
            activeMultiplier: 1,
            impact: { co2: 0, trees: 0 },
            history: [],
            achievements: DEFAULT_ACHIEVEMENTS
        });
    };

    const register = (name: string, email: string) => {
        setUser({
            uid: 'user-' + Date.now(),
            name,
            email,
            points: 0,
            level: 'Descubridor',
            itemsThisMonth: 0,
            activeMultiplier: 1,
            impact: { co2: 0, trees: 0 },
            history: [],
            achievements: DEFAULT_ACHIEVEMENTS
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            refreshUser: loadUser,
            deposit,
            redeem,
            toggleTheme: () => {
                const newMode = !isDarkMode;
                setIsDarkMode(newMode);
                analytics.themeToggled(newMode);
            },
            isDarkMode,
            loginAsGuest,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};
