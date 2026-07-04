import React from 'react';
import './AuthButton.scss';

const AuthButton = ({
    children,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const baseClasses = 'auth-button';
    const variantClasses = `auth-button--${variant}`;
    const sizeClasses = `auth-button--${size}`;
    const widthClasses = fullWidth ? 'auth-button--full' : '';
    const disabledClasses = (disabled || loading) ? 'auth-button--disabled' : '';

    const handleClick = (e) => {
        if (!disabled && !loading) {
            onClick?.(e);
        }
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`}
            onClick={handleClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="auth-button__spinner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                        <path 
                            d="M12 2C6.48 2 2 6.48 2 12" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            className="auth-button__spinner-path"
                        />
                    </svg>
                </span>
            )}
            <span className="auth-button__content">{children}</span>
        </button>
    );
};

export default AuthButton;
