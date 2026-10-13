/** Chilean number format: 1.850 */
export const fmtNumber = (n: number) => n.toLocaleString('es-CL');

/** Kilograms with at most one decimal: 2,2 */
export const fmtKg = (n: number) => n.toLocaleString('es-CL', { maximumFractionDigits: 1 });

/** «Trinidad Rojas» → «TR» */
export const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

/** «1 punto» / «3 puntos» */
export const plural = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${fmtNumber(n)} ${many}`);
