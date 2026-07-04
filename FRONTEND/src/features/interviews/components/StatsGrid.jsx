import React, { memo, useMemo } from 'react';
import './StatsGrid.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    technical: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
    ),
    behavioral: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    preparation: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    skillGaps: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20"></path>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    )
};

const StatsGrid = ({ report }) => {
    // Memoize stats to prevent re-creation on every render
    const stats = useMemo(() => [
        {
            id: 'technical',
            label: 'Technical Questions',
            value: report?.technicalQuestions?.length || 0,
            icon: Icons.technical,
            color: 'blue'
        },
        {
            id: 'behavioral',
            label: 'Behavioral Questions',
            value: report?.behavioralQuestions?.length || 0,
            icon: Icons.behavioral,
            color: 'purple'
        },
        {
            id: 'preparation',
            label: 'Preparation Days',
            value: report?.preparationPlan?.length || 0,
            icon: Icons.preparation,
            color: 'green'
        },
        {
            id: 'skillGaps',
            label: 'Skill Gaps',
            value: report?.skillGaps?.length || 0,
            icon: Icons.skillGaps,
            color: 'orange'
        }
    ], [report]);

    return (
        <div className="stats-grid">
            {stats.map((stat) => (
                <div key={stat.id} className={`stat-card stat-card--${stat.color}`}>
                    <div className="stat-card__icon">
                        {stat.icon}
                    </div>
                    <div className="stat-card__content">
                        <p className="stat-card__label">{stat.label}</p>
                        <p className="stat-card__value">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default memo(StatsGrid);
