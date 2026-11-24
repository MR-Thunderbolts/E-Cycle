import React from 'react';
import { Icon } from '../Icon';

/** Punto limpio abierto a todos · punto privado (candado) · comercio con beneficio (morado, canje). */
export type MapPinKind = 'punto' | 'privado' | 'beneficio';

export interface MapPinProps {
    label: string;
    kind?: MapPinKind;
    selected?: boolean;
    dimmed?: boolean;
    onClick?: () => void;
}

const BADGE: Partial<Record<MapPinKind, string>> = { privado: 'lock', beneficio: 'redeem' };

export const MapPin: React.FC<MapPinProps> = ({ label, kind = 'punto', selected = false, dimmed = false, onClick }) => (
    <button
        type="button"
        aria-label={kind === 'privado' ? `${label} (solo comunidad)` : label}
        aria-pressed={selected}
        className={[
            'ec-pin',
            kind === 'beneficio' ? 'ec-pin--perk' : '',
            selected ? 'ec-pin--selected' : '',
            dimmed ? 'ec-pin--dimmed' : '',
        ]
            .filter(Boolean)
            .join(' ')}
        onClick={onClick}
    >
        <Icon name="location_on" filled />
        {BADGE[kind] && (
            <span className="ec-pin__badge" aria-hidden="true">
                <Icon name={BADGE[kind]!} filled />
            </span>
        )}
    </button>
);
