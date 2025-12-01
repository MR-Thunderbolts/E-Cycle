import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context';

/**
 * Custom hook to access AuthContext
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
