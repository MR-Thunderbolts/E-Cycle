import React, { createContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { apiService } from '@/services';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => void;
    deposit: (items: Record<string, number>, points: number) => Promise<void>;
    redeem: (cost: number) => Promise<boolean>;
    toggleTheme: () => void;
    isDarkMode: boolean;
    loginAsGuest: () => void;
    register: (name: string, email: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
