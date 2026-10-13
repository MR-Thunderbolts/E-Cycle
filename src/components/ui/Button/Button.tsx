import React from 'react';
import { Icon } from '../Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'neutral' | 'ghost' | 'danger' | 'danger-ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    loading?: boolean;
    /** Material Symbol name or a custom node. */
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'right',
    disabled,
    children,
    className = '',
    type = 'button',
    ...props
}) => {
    const cls = ['ec-btn', `ec-btn--${variant}`, `ec-btn--${size}`, fullWidth ? 'ec-btn--full' : '', className]
        .filter(Boolean)
        .join(' ');
    const glyph = typeof icon === 'string' ? <Icon name={icon} /> : icon;

    return (
        <button type={type} className={cls} disabled={disabled || loading} {...props}>
            {loading ? (
                <>
                    <Icon name="progress_activity" className="ec-spin" />
                    <span>Cargando...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && glyph}
                    {children}
                    {icon && iconPosition === 'right' && glyph}
                </>
            )}
        </button>
    );
};
