import React from 'react';
import { TabType } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { NavTab } from '../BottomNavBar';

export interface TopBarProps {
    items: NavTab[];
    active: TabType;
    onChange: (tab: TabType) => void;
    /** Rendered on the right: sign-in buttons or the account avatar. */
    actions?: React.ReactNode;
}

/** Desktop (≥1024) navigation. */
export const TopBar: React.FC<TopBarProps> = ({ items, active, onChange, actions }) => (
    <header className="ec-topbar">
        <div className="ec-topbar__brand">
            <Icon name="recycling" filled />
            E-Cycle
        </div>
        <nav className="ec-topbar__nav" aria-label="Navegación principal">
            {items.map((it) => {
                const on = it.id === active;
                return (
                    <button
                        key={it.id}
                        type="button"
                        aria-current={on ? 'page' : undefined}
                        className={'ec-topbar__link' + (on ? ' ec-topbar__link--active' : '')}
                        onClick={() => onChange(it.id)}
                    >
                        <Icon name={it.icon} filled={on} />
                        {it.label}
                    </button>
                );
            })}
        </nav>
        {actions && <div className="ec-topbar__actions">{actions}</div>}
    </header>
);
