import React from 'react';
import { AuthProvider, CiudadanoProvider } from '@/context';
import { AppRouter } from './AppRouter';
import { ErrorBoundary } from '@/components';

export const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <CiudadanoProvider>
                    <AppRouter />
                </CiudadanoProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};
