import React from 'react';
import { AuthProvider } from '@/context';
import { AppRouter } from './AppRouter';
import { ErrorBoundary } from '@/components';

export const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ErrorBoundary>
    );
};
