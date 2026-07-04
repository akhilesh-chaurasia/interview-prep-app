import React, { useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentActivity.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    empty: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),
    dsa: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
    ),
    mern: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    core: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

// Helper functions outside component to prevent re-creation
const getSessionScore = (session) => {
    if (!session?.questions?.length) return 0;
    
    let totalScore = 0;
    let questionCount = 0;

    session.questions.forEach(q => {
        if (q.rubric) {
            const { clarity, structure, depth, technicalAccuracy, communication } = q.rubric;
            totalScore += (clarity + structure + depth + technicalAccuracy + communication) / 5;
            questionCount++;
        }
    });

    return questionCount > 0 ? Math.round(totalScore / questionCount) : 0;
};

const getTimeAgo = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffMs = now - sessionDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays === 0) {
        if (diffHours === 0) return 'Just now';
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return sessionDate.toLocaleDateString();
    }
};

const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
};

const getTrackIcon = (track) => {
    switch (track) {
        case 'DSA': return Icons.dsa;
        case 'MERN': return Icons.mern;
        case 'CORE': return Icons.core;
        default: return Icons.dsa;
    }
};

const RecentActivity = ({ sessions }) => {
    const navigate = useNavigate();

    // Get recent completed sessions (last 5)
    const recentSessions = useMemo(() => {
        const completed = sessions.filter(s => s.completed);
        return completed
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [sessions]);

    const handleViewAll = useCallback(() => {
        navigate('/analytics');
    }, [navigate]);

    if (recentSessions.length === 0) {
        return (
            <div className="recent-activity">
                <div className="recent-activity__header">
                    <h2 className="recent-activity__title">Recent Activity</h2>
                </div>
                <div className="recent-activity__empty">
                    {Icons.empty}
                    <p>No completed interviews yet</p>
                    <p className="recent-activity__empty-hint">Start a mock interview to see your activity here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-activity">
            <div className="recent-activity__header">
                <h2 className="recent-activity__title">Recent Activity</h2>
                <button 
                    className="recent-activity__view-all"
                    onClick={handleViewAll}
                >
                    View All
                    {Icons.arrow}
                </button>
            </div>

            <div className="recent-activity__list">
                {recentSessions.map((session) => {
                    const score = getSessionScore(session);
                    const scoreColor = getScoreColor(score);
                    const timeAgo = getTimeAgo(session.createdAt);
                    const trackIcon = getTrackIcon(session.track);

                    return (
                        <div key={session._id} className="activity-item">
                            <div className="activity-item__icon">
                                {trackIcon}
                            </div>

                            <div className="activity-item__content">
                                <div className="activity-item__header">
                                    <span className="activity-item__track">{session.track}</span>
                                    <span className={`activity-item__score ${scoreColor}`}>{score}%</span>
                                </div>
                                <p className="activity-item__time">{timeAgo}</p>
                            </div>

                            <div className="activity-item__arrow">
                                {Icons.arrow}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(RecentActivity);
