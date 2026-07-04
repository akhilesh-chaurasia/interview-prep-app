import React from 'react';
import './PasswordStrength.scss';

const PasswordStrength = ({ password }) => {
    const calculateStrength = (pwd) => {
        if (!pwd) return 0;
        
        let strength = 0;
        
        // Length check
        if (pwd.length >= 8) strength += 1;
        if (pwd.length >= 12) strength += 1;
        
        // Character variety
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;
        
        return Math.min(strength, 4);
    };

    const strength = calculateStrength(password);
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];

    const getRequirements = (pwd) => {
        return [
            { text: 'At least 8 characters', met: pwd.length >= 8 },
            { text: 'Contains uppercase letter', met: /[A-Z]/.test(pwd) },
            { text: 'Contains lowercase letter', met: /[a-z]/.test(pwd) },
            { text: 'Contains number', met: /[0-9]/.test(pwd) },
            { text: 'Contains special character', met: /[^a-zA-Z0-9]/.test(pwd) },
        ];
    };

    const requirements = getRequirements(password);

    return (
        <div className="password-strength">
            <div className="password-strength__bar">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={`password-strength__segment ${index < strength ? 'password-strength__segment--active' : ''}`}
                        style={{
                            backgroundColor: index < strength ? strengthColors[strength] : '#e5e7eb'
                        }}
                    />
                ))}
            </div>
            
            {password && (
                <div className="password-strength__label" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                </div>
            )}
            
            <div className="password-strength__requirements">
                {requirements.map((req, index) => (
                    <div 
                        key={index} 
                        className={`password-strength__requirement ${req.met ? 'password-strength__requirement--met' : ''}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {req.met ? (
                                <polyline points="20 6 9 17 4 12"></polyline>
                            ) : (
                                <circle cx="12" cy="12" r="10"></circle>
                            )}
                        </svg>
                        <span>{req.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrength;
