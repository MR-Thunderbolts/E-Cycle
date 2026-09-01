import React, { InputHTMLAttributes } from 'react';

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
    ...props
}) => {
    // Determine variant based on error prop
    const effectiveVariant = error ? 'error' : variant;

    // Variant styles for input
    const variantStyles = {
        default: 'border-gray-200 dark:border-white/10 focus:ring-primary/50',
        error: 'border-red-500 focus:ring-red-500/50',
        success: 'border-green-500 focus:ring-green-500/50',
    };

    // Icon color based on variant
    const iconColorStyles = {
        default: 'text-gray-400',
        error: 'text-red-500',
        success: 'text-green-500',
    };

    // Label color based on variant
    const labelColorStyles = {
        default: 'text-gray-500 dark:text-gray-400',
        error: 'text-red-500',
        success: 'text-green-500',
    };

    const inputPaddingLeft = icon && iconPosition === 'left' ? 'pl-12' : 'pl-4';
    const inputPaddingRight = icon && iconPosition === 'right' ? 'pr-12' : 'pr-4';

    return (
        <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${labelColorStyles[effectiveVariant]}`}>
                    {label}
                    {error && typeof error === 'string' && ` - ${error}`}
                </label>
            )}

            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded ${iconColorStyles[effectiveVariant]}`}>
                        {icon}
                    </span>
                )}

                <input
                    className={`w-full bg-gray-50 dark:bg-white/5 border rounded-xl py-3 ${inputPaddingLeft} ${inputPaddingRight} text-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${variantStyles[effectiveVariant]} ${className}`}
                    {...props}
                />

                {icon && iconPosition === 'right' && (
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 material-symbols-rounded ${iconColorStyles[effectiveVariant]}`}>
                        {icon}
                    </span>
                )}
            </div>

            {helperText && !error && (
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">{helperText}</p>
            )}

            {error && typeof error === 'string' && !label && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};
