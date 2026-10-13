import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches;
};

/** Desktop layout (TopBar, side panel) from 1024 px. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** Scanning needs a camera and a touch screen: (pointer: coarse) and navigator.mediaDevices. */
export const useCanScan = () => {
    const coarse = useMediaQuery('(pointer: coarse)');
    return coarse && typeof navigator !== 'undefined' && !!navigator.mediaDevices;
};
