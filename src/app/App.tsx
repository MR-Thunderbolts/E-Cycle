import React from 'react';
import { MotionConfig } from 'framer-motion';
import { CiudadanoProvider } from '@/context';
import { ErrorBoundary } from '@/components';
import { AppRouter } from './AppRouter';

export const App: React.FC = () => {
    return (
        <ErrorBoundary>
            {/* Honour prefers-reduced-motion in every Framer Motion animation. */}
            <MotionConfig reducedMotion="user">
                <CiudadanoProvider>
                    <AppRouter />
                </CiudadanoProvider>
            </MotionConfig>
        </ErrorBoundary>
    );
};
