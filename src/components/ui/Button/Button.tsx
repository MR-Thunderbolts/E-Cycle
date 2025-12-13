import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
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
    ...props
}) => {
    // Variant styles
    const variantStyles = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25',
        secondary: 'bg-secondary hover:bg-secondary/80 text-primary border border-primary/20',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-text-secondary dark:text-dark-text-secondary hover:text-primary hover:bg-primary/10',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
    };

    // Size styles
    const sizeStyles = {
        sm: 'py-2 px-4 text-sm rounded-full',
        md: 'py-3 px-6 text-base rounded-full',
        lg: 'py-3.5 px-8 text-lg rounded-full',
    };

    // Base styles
    const baseStyles = 'font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:active:scale-100';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Computed styles based on state
    let finalVariantStyles = variantStyles[variant];
    if (disabled && !loading) {
        finalVariantStyles = 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-0 shadow-none';
    }

    // Combine all styles
    const combinedStyles = `${baseStyles} ${finalVariantStyles} ${sizeStyles[size]} ${widthStyles} ${className}`;

    return (
        <button
            disabled={disabled || loading}
            className={combinedStyles}
            {...props}
        >
            {loading ? (
                <>
                    <span className="material-symbols-rounded animate-spin">progress_activity</span>
                    <span>Cargando...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        typeof icon === 'string' ? <span className="material-symbols-rounded text-xl">{icon}</span> : icon
                    )}
                    {children}
                    {icon && iconPosition === 'right' && (
                        typeof icon === 'string' ? <span className="material-symbols-rounded text-xl">{icon}</span> : icon
                    )}
                </>
            )}
        </button>
    );
};
