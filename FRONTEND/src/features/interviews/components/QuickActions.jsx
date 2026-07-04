import React, { memo, useMemo } from 'react';
import './QuickActions.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    interview: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    ),
    download: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    ),
    roadmap: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
    ),
    skills: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    ),
    arrow: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    )
};

const QuickActions = ({ onStartInterview, onDownloadResume, onViewRoadmap, onReviewSkills }) => {
    // Memoize actions to prevent re-creation on every render
    const actions = useMemo(() => [
        {
            id: 'interview',
            title: 'Start Mock Interview',
            description: 'Begin AI-powered interview session',
            icon: Icons.interview,
            color: 'primary',
            onClick: onStartInterview
        },
        {
            id: 'download',
            title: 'Download Resume',
            description: 'Get your optimized resume PDF',
            icon: Icons.download,
            color: 'secondary',
            onClick: onDownloadResume
        },
        {
            id: 'roadmap',
            title: 'View Roadmap',
            description: 'Check your preparation plan',
            icon: Icons.roadmap,
            color: 'tertiary',
            onClick: onViewRoadmap
        },
        {
            id: 'skills',
            title: 'Review Skills',
            description: 'Analyze skill gaps',
            icon: Icons.skills,
            color: 'quaternary',
            onClick: onReviewSkills
        }
    ], [onStartInterview, onDownloadResume, onViewRoadmap, onReviewSkills]);

    return (
        <div className="quick-actions">
            <h2 className="quick-actions__title">Quick Actions</h2>
            <div className="quick-actions__grid">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        className={`quick-action-card quick-action-card--${action.color}`}
                        onClick={action.onClick}
                    >
                        <div className="quick-action-card__icon">
                            {action.icon}
                        </div>
                        <div className="quick-action-card__content">
                            <h3 className="quick-action-card__title">{action.title}</h3>
                            <p className="quick-action-card__description">{action.description}</p>
                        </div>
                        <div className="quick-action-card__arrow">
                            {Icons.arrow}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default memo(QuickActions);
