import React, { useState } from 'react';
import { MobileLayout } from '@/components';
import { Home } from '@/features/home';
import { Scan } from '@/features/scan';
import { Hub } from '@/features/hub';
import { Pickup } from '@/features/pickup';
import { Profile } from '@/features/profile';
import { TabType, HubTab } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { analytics } from '@/utils';

export const AppRouter: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<TabType>('explorar');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hubInitialTab, setHubInitialTab] = useState<HubTab>('beneficios');

    const handleGoToRedeem = () => {
        setHubInitialTab('usar');
        analytics.tabChanged(currentTab, 'ehub');
        setCurrentTab('ehub');
    };

    const handleTabChange = (newTab: TabType) => {
        analytics.tabChanged(currentTab, newTab);
        setCurrentTab(newTab);
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'explorar': return <Home onOpenProfile={() => setIsProfileOpen(true)} />;
            case 'escaner': return <Scan onGoToRedeem={handleGoToRedeem} onBack={() => handleTabChange('explorar')} />;
            case 'ehub': return <Hub initialTab={hubInitialTab} />;
            case 'retiro': return <Pickup />;
            default: return <Home onOpenProfile={() => setIsProfileOpen(true)} />;
        }
    };

    return (
        <div className="h-full w-full">
            {/* Main Layout Wrapping Navigation */}
            <MobileLayout currentTab={currentTab} onTabChange={handleTabChange} showNav={!isProfileOpen}>
                {renderContent()}
            </MobileLayout>

            {/* Profile Overlay (Full Screen Modal Route) */}
            <AnimatePresence>
                {isProfileOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                            onClick={() => setIsProfileOpen(false)}
                        ></motion.div>

                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative h-[92%] bg-background dark:bg-dark-bg w-full rounded-t-[40px] overflow-hidden shadow-2xl"
                        >
                            <Profile onClose={() => {
                                analytics.profileOpened();
                                setIsProfileOpen(false);
                            }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
