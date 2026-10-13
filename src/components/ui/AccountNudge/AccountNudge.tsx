import React from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { fmtNumber } from '@/utils/format';

export interface AccountNudgeProps {
    points: number;
    onCreate: () => void;
    onLogin?: () => void;
    onSkip: () => void;
}

/** Shown to guests after a pickup request. */
export const AccountNudge: React.FC<AccountNudgeProps> = ({ points, onCreate, onLogin, onSkip }) => (
    <div className="ec-prompt" style={{ maxWidth: 'none', border: 0, padding: 0 }}>
        <div className="ec-iconbox ec-iconbox--lg" style={{ background: 'rgba(255,193,7,.15)', color: 'var(--ec-points)' }}>
            <Icon name="redeem" filled />
        </div>
        <h3 className="ec-prompt__title">Este retiro vale {fmtNumber(points)} puntos</h3>
        <p className="ec-prompt__desc">
            Crea tu cuenta para guardarlos y canjearlos por descuentos en cargadores y cables nuevos. Sin cuenta, el retiro se hace igual y tus
            puntos quedan guardados 30 días en este navegador.
        </p>
        <div className="ec-prompt__actions">
            <Button variant="primary" size="md" fullWidth icon="smartphone" iconPosition="left" onClick={onCreate}>
                Crear cuenta con mi teléfono
            </Button>
            {onLogin && (
                <Button variant="neutral" size="md" fullWidth onClick={onLogin}>
                    {'Ya tengo cuenta · Ingresar'}
                </Button>
            )}
            <Button variant="ghost" size="md" fullWidth onClick={onSkip}>
                Seguir sin cuenta
            </Button>
        </div>
    </div>
);
