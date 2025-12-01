import ReactGA from 'react-ga4';

/**
 * Analytics utility for tracking user behavior
 * Uses Google Analytics 4 in production, console logs in development
 */

// Initialize Google Analytics
// Set your GA4 Measurement ID in .env.local as VITE_GA_MEASUREMENT_ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

let isInitialized = false;

export const initializeAnalytics = () => {
    if (isInitialized) return;

    if (GA_MEASUREMENT_ID && import.meta.env.PROD) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        isInitialized = true;
        console.log('[Analytics] Initialized with ID:', GA_MEASUREMENT_ID);
    } else {
        console.log('[Analytics] Running in development mode (console only)');
        isInitialized = true;
    }
};

/**
 * Track custom events
 */
export const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
) => {
    if (!isInitialized) {
        initializeAnalytics();
    }

    // Always log in development
    if (import.meta.env.DEV) {
        console.log('[Analytics Event]', eventName, properties);
    }

    // Send to GA4 in production
    if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
        ReactGA.event(eventName, properties);
    }
};

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
    if (!isInitialized) {
        initializeAnalytics();
    }

    if (import.meta.env.DEV) {
        console.log('[Analytics Page View]', path, title);
    }

    if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
        ReactGA.send({ hitType: 'pageview', page: path, title });
    }
};

/**
 * Detect and track Maze sessions
 */
export const detectMazeSession = () => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const testId = params.get('test_id') || params.get('maze_test_id');

    if (utmSource === 'maze' || testId) {
        trackEvent('maze_session_started', {
            test_id: testId || 'unknown',
            utm_source: utmSource,
            timestamp: new Date().toISOString(),
        });

        // Store in session storage for the duration of the test
        sessionStorage.setItem('maze_session', 'true');
        if (testId) {
            sessionStorage.setItem('maze_test_id', testId);
        }

        return true;
    }

    return false;
};

/**
 * Check if current session is from Maze
 */
export const isMazeSession = (): boolean => {
    return sessionStorage.getItem('maze_session') === 'true';
};

/**
 * Get Maze test ID if in a Maze session
 */
export const getMazeTestId = (): string | null => {
    return sessionStorage.getItem('maze_test_id');
};

// Event tracking helpers
export const analytics = {
    // Navigation
    tabChanged: (fromTab: string, toTab: string) => {
        trackEvent('tab_changed', { from_tab: fromTab, to_tab: toTab });
    },

    // Map interactions
    recyclingPointClicked: (pointId: string, pointName: string) => {
        trackEvent('recycling_point_clicked', {
            point_id: pointId,
            point_name: pointName,
        });
    },

    materialFilterApplied: (materials: string[], numResults: number) => {
        trackEvent('material_filter_applied', {
            materials: materials.join(','),
            num_results: numResults,
        });
    },

    // Scanning flow
    scanStarted: () => {
        trackEvent('scan_started');
    },

    scanItemsEntered: (
        items: Record<string, number>,
        totalItems: number,
        estimatedPoints: number
    ) => {
        trackEvent('scan_items_entered', {
            items: JSON.stringify(items),
            total_items: totalItems,
            estimated_points: estimatedPoints,
        });
    },

    dropoffCompleted: (
        pointsEarned: number,
        itemsCount: number,
        multiplier: number
    ) => {
        trackEvent('dropoff_completed', {
            points_earned: pointsEarned,
            items_count: itemsCount,
            multiplier_active: multiplier,
        });
    },

    // Rewards/eHub
    couponViewed: (couponId: string, brand: string, cost: number) => {
        trackEvent('coupon_viewed', {
            coupon_id: couponId,
            brand: brand,
            cost: cost,
        });
    },

    couponRedeemed: (
        couponId: string,
        pointsSpent: number,
        remainingPoints: number
    ) => {
        trackEvent('coupon_redeemed', {
            coupon_id: couponId,
            points_spent: pointsSpent,
            remaining_points: remainingPoints,
        });
    },

    // Achievements
    achievementsViewed: (completedCount: number, totalCount: number) => {
        trackEvent('achievements_viewed', {
            completed_count: completedCount,
            total_count: totalCount,
        });
    },

    achievementUnlocked: (achievementId: string, rewardPoints: number) => {
        trackEvent('achievement_unlocked', {
            achievement_id: achievementId,
            reward_points: rewardPoints,
        });
    },

    // Profile
    profileOpened: () => {
        trackEvent('profile_opened');
    },

    themeToggled: (isDarkMode: boolean) => {
        trackEvent('theme_toggled', {
            theme: isDarkMode ? 'dark' : 'light',
        });
    },
};

export default analytics;
