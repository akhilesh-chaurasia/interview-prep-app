import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import './AICoachCard.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    coach: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
            <path d="M8.5 8.5v.01"></path>
            <path d="M16 15.5v.01"></path>
            <path d="M12 12v.01"></path>
        </svg>
    ),
    check: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    circle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
    ),
    time: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    arrow: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    )
};

// Static default goals
const DEFAULT_GOALS = [
    { id: 1, text: 'Complete 1 Interview', completed: false },
    { id: 2, text: 'Practice 5 Questions', completed: false },
    { id: 3, text: 'Study for 30 Minutes', completed: false },
];

const AICoachCard = ({ report = {}, onStartInterview, userName = 'User' }) => {
    const [greeting, setGreeting] = useState('');
    const [goals, setGoals] = useState(DEFAULT_GOALS);

    // Memoize derived values
    const { topSkillGaps, recommendedTopics } = useMemo(() => {
        const skillGaps = report?.skillGaps || [];
        const topSkillGaps = skillGaps.slice(0, 3);
        const recommendedTopics = skillGaps.length > 0
            ? topSkillGaps.map((gap) => `Practice ${gap.skill}`)
            : ['React Hooks', 'DBMS Indexing', 'OOP Principles'];
        
        return { topSkillGaps, recommendedTopics };
    }, [report]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    const toggleGoal = useCallback((id) => {
        setGoals(prev => prev.map(goal => 
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    }, []);

    return (
        <div className="ai-coach-card">
            <div className="ai-coach-card__content">
                {/* Greeting Section */}
                <div className="ai-coach-card__greeting">
                    <div className="ai-coach-card__icon">
                        {Icons.coach}
                    </div>
                    <div className="ai-coach-card__greeting-text">
                        <h2 className="ai-coach-card__greeting-title">{greeting}, {userName}!</h2>
                        <p className="ai-coach-card__greeting-subtitle">Your AI Coach is ready to help you prepare</p>
                    </div>
                </div>

                {/* Today's Goals */}
                <div className="ai-coach-card__goals">
                    <h3 className="ai-coach-card__section-title">Today's Goals</h3>
                    <div className="ai-coach-card__goals-list">
                        {goals.map((goal) => (
                            <div key={goal.id} className="ai-coach-card__goal-item">
                                <div className="ai-coach-card__goal-checkbox">
                                    {goal.completed ? Icons.check : Icons.circle}
                                </div>
                                <span className="ai-coach-card__goal-text">{goal.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Topics */}
                <div className="ai-coach-card__topics">
                    <h3 className="ai-coach-card__section-title">Recommended Topics</h3>
                    <p className="ai-coach-card__topics-subtitle">Based on your recent interview performance</p>
                    <div className="ai-coach-card__topics-list">
                        {recommendedTopics.map((topic, index) => (
                            <div key={index} className="ai-coach-card__topic-badge">
                                {topic}
                            </div>
                        ))}
                    </div>
                </div>

                {topSkillGaps.length > 0 && (
                    <div className="ai-coach-card__gaps">
                        <h3 className="ai-coach-card__section-title">Top Skill Gaps</h3>
                        <div className="ai-coach-card__gaps-list">
                            {topSkillGaps.map((gap, index) => (
                                <div key={index} className="ai-coach-card__gap-chip">
                                    <span>{gap.skill}</span>
                                    <span className={`ai-coach-card__severity ai-coach-card__severity--${gap.severity}`}>
                                        {gap.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="ai-coach-card__footer">
                    <div className="ai-coach-card__time">
                        {Icons.time}
                        <span>30 mins</span>
                    </div>
                    <button 
                        className="ai-coach-card__cta"
                        onClick={onStartInterview}
                    >
                        Start Interview
                        {Icons.arrow}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(AICoachCard);
