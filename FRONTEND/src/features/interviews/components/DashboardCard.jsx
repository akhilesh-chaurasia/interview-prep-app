import React from 'react';
import './DashboardCard.scss';

const DashboardCard = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div 
            className={`dashboard-card ${hover ? 'dashboard-card--hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default DashboardCard;
