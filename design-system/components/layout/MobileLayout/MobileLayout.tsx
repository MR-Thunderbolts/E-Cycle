import React from 'react';
import { BottomNavBar } from '../BottomNavBar';
import { TabType } from '@/types';

export interface MobileLayoutProps {
    children: React.ReactNode;
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
    showNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    currentTab,
    onTabChange,
    showNav = true
}) => {
    return (
        <div className="fixed inset-0 flex flex-col w-full overflow-hidden font-sans">

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-hidden relative">
                {children}
            </main>

            {/* Fixed Bottom Navigation - Absolute to overlay content */}
            {showNav && (
                <div className="absolute bottom-0 w-full z-40 pointer-events-none">
                    <div className="pointer-events-auto">
                        <BottomNavBar currentTab={currentTab} onTabChange={onTabChange} />
                    </div>
                </div>
            )}
        </div>
    );
};
