import React from 'react';
import './StatCard.scss';

const StatCard = ({ label, value, icon, trend, color = 'primary', size = 'medium' }) => {
    const colorClasses = {
        primary: 'stat-card--primary',
        success: 'stat-card--success',
        warning: 'stat-card--warning',
        danger: 'stat-card--danger'
    };

    const sizeClasses = {
        small: 'stat-card--small',
        medium: 'stat-card--medium',
        large: 'stat-card--large'
    };

    return (
        <div className={`stat-card ${colorClasses[color]} ${sizeClasses[size]}`}>
            <div className="stat-card__icon">
                {icon}
            </div>
            <div className="stat-card__content">
                <p className="stat-card__label">{label}</p>
                <p className="stat-card__value">{value}</p>
                {trend && (
                    <p className={`stat-card__trend ${trend > 0 ? 'stat-card__trend--positive' : 'stat-card__trend--negative'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
