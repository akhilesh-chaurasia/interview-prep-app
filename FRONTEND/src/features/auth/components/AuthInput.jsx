import React, { useState, forwardRef } from 'react';
import './AuthInput.scss';

const AuthInput = forwardRef(({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    success,
    icon,
    showPasswordToggle = false,
    required = false,
    disabled = false,
    name,
    id,
    autoComplete,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value));

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(Boolean(e.target.value));
        onBlur?.(e);
    };

    const handleChange = (e) => {
        setHasValue(Boolean(e.target.value));
        onChange?.(e);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`auth-input ${error ? 'auth-input--error' : ''} ${success ? 'auth-input--success' : ''} ${disabled ? 'auth-input--disabled' : ''}`}>
            <div className="auth-input__wrapper">
                {icon && <span className="auth-input__icon">{icon}</span>}
                
                <input
                    ref={ref}
                    type={inputType}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className="auth-input__field"
                    {...props}
                />
                
                {showPasswordToggle && type === 'password' && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="auth-input__toggle"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                )}
            </div>
            
            {label && (
                <label 
                    htmlFor={id || name} 
                    className={`auth-input__label ${isFocused || hasValue ? 'auth-input__label--float' : ''}`}
                >
                    {label} {required && <span className="auth-input__required">*</span>}
                </label>
            )}
            
            {error && <span className="auth-input__error">{error}</span>}
            {success && <span className="auth-input__success">{success}</span>}
        </div>
    );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
