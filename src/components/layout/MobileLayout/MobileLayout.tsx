import React from 'react';
import { TabType } from '@/types';
import { BottomNavBar, NavTab } from '../BottomNavBar';

export interface MobileLayoutProps {
    children: React.ReactNode;
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
    showNav?: boolean;
    tabs?: NavTab[];
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, currentTab, onTabChange, showNav = true, tabs }) => (
    <div className="ec-shell">
        <main className="ec-shell__main">{children}</main>
        {showNav && (
            <div className="ec-shell__nav">
                <BottomNavBar currentTab={currentTab} onTabChange={onTabChange} tabs={tabs} />
            </div>
        )}
    </div>
);
