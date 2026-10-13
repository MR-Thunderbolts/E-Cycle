import React from 'react';
import { TabType } from '@/types';
import { Icon } from '@/components/ui/Icon';

export interface NavTab {
    id: TabType;
    label: string;
    icon: string;
}

export const NAV_TABS: NavTab[] = [
    { id: 'explorar', label: 'Explorar', icon: 'explore' },
    { id: 'retiro', label: 'Retiro', icon: 'local_shipping' },
    { id: 'escaner', label: 'Escanear', icon: 'qr_code_scanner' },
    { id: 'ehub', label: 'Beneficios', icon: 'redeem' },
];

export interface BottomNavBarProps {
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
    tabs?: NavTab[];
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onTabChange, tabs = NAV_TABS }) => (
    <nav className="ec-nav safe-bottom" aria-label="Navegación principal">
        <div className="ec-nav__grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => {
                const on = currentTab === tab.id;
                return (
                    <div className="ec-nav__cell" key={tab.id}>
                        <button
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            aria-current={on ? 'page' : undefined}
                            className={'ec-nav__btn' + (on ? ' ec-nav__btn--active' : '')}
                        >
                            <Icon name={tab.icon} filled={on} />
                            <span className="ec-nav__label">{tab.label}</span>
                        </button>
                    </div>
                );
            })}
        </div>
    </nav>
);
