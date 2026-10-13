import React, { InputHTMLAttributes, useId } from 'react';
import { Icon } from '../Icon';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string | boolean;
    helperText?: string;
    icon?: string; // Material Symbol icon name
    iconPosition?: 'left' | 'right';
    variant?: 'default' | 'error' | 'success';
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    variant = 'default',
    fullWidth = true,
    className = '',
    id,
    ...props
}) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const v = error ? 'error' : variant;
    const inputCls = [
        'ec-input',
        `ec-input--${v}`,
        icon && iconPosition === 'left' ? 'ec-input--pad-left' : '',
        icon && iconPosition === 'right' ? 'ec-input--pad-right' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={['ec-field', fullWidth ? 'ec-field--full' : ''].filter(Boolean).join(' ')}>
            {label && (
                <label htmlFor={inputId} className={'ec-field__label' + (v !== 'default' ? ` ec-field__label--${v}` : '')}>
                    {label}
                    {error && typeof error === 'string' ? ` - ${error}` : ''}
                </label>
            )}
            <div className="ec-field__wrap">
                {icon && iconPosition === 'left' && <Icon name={icon} className="ec-field__icon ec-field__icon--left" />}
                <input id={inputId} className={inputCls} aria-invalid={!!error || undefined} {...props} />
                {icon && iconPosition === 'right' && <Icon name={icon} className="ec-field__icon ec-field__icon--right" />}
            </div>
            {helperText && !error && <p className="ec-field__help">{helperText}</p>}
            {error && typeof error === 'string' && !label && <p className="ec-field__err">{error}</p>}
        </div>
    );
};
