/** localStorage that never throws (private mode, blocked storage, SSR). */
export const storage = {
    get<T>(key: string, fallback: T): T {
        try {
            const raw = window.localStorage.getItem(key);
            return raw === null ? fallback : (JSON.parse(raw) as T);
        } catch {
            return fallback;
        }
    },
    set(key: string, value: unknown) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* storage unavailable: keep working in memory */
        }
    },
    /** Plain string values (e.g. the existing `theme` key, stored without JSON). */
    getRaw(key: string): string | null {
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setRaw(key: string, value: string) {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            /* ignore */
        }
    },
    remove(key: string) {
        try {
            window.localStorage.removeItem(key);
        } catch {
            /* ignore */
        }
    },
};
