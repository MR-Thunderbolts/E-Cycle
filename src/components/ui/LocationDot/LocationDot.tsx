import React from 'react';

export const LocationDot: React.FC<{ label?: string }> = ({ label = 'Tú' }) => (
    <div className="ec-locdot" role="img" aria-label="Tu ubicación">
        <span className="ec-locdot__pulse" />
        <span className="ec-locdot__halo" />
        <span className="ec-locdot__core" />
        {label && <span className="ec-locdot__label">{label}</span>}
    </div>
);
