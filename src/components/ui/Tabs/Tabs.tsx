import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';

export interface Tab {
    id: string;
    label: string;
    icon?: string; // Material Symbol icon name
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: 'default' | 'pills';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, variant = 'default', className = '' }) => {
    if (variant === 'pills') {
        return (
            <div className={['ec-tabs--pills', 'no-scrollbar', className].filter(Boolean).join(' ')} role="tablist">
                {tabs.map((tab) => {
                    const on = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => onTabChange(tab.id)}
                            className={'ec-pill' + (on ? ' ec-pill--active' : '')}
                        >
                            {tab.icon && <Icon name={tab.icon} filled={on} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    }
    return <SlidingTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} className={className} />;
};

/** Separate component so hooks run unconditionally (pills variant bails out early above). */
const SlidingTabs: React.FC<Required<Omit<TabsProps, 'variant'>>> = ({ tabs, activeTab, onTabChange, className }) => {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const [ind, setInd] = useState({ left: 0, width: 0, ready: false });

    useEffect(() => {
        const el = refs.current[tabs.findIndex((t) => t.id === activeTab)];
        if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }, [activeTab, tabs]);

    return (
        <div className={['ec-tabs', className].filter(Boolean).join(' ')} role="tablist">
            <span className="ec-tabs__ind" style={{ left: ind.left, width: ind.width, opacity: ind.ready ? 1 : 0 }} />
            {tabs.map((tab, i) => {
                const on = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        ref={(el) => { refs.current[i] = el; }}
                        onClick={() => onTabChange(tab.id)}
                        className={'ec-tabs__btn' + (on ? ' ec-tabs__btn--active' : '')}
                    >
                        {tab.icon && <Icon name={tab.icon} filled={on} />}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
