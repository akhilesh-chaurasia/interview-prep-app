import React, { useState, memo, useMemo, useCallback } from 'react';
import './InterviewOverview.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    chevron: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    ),
    intention: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    ),
    answer: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 1-2-1.3h-7"></path>
        </svg>
    ),
    check: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
};

// Static tabs configuration
const TABS = [
    { id: 'technical', label: 'Technical Questions' },
    { id: 'behavioral', label: 'Behavioral Questions' },
    { id: 'roadmap', label: 'Preparation Roadmap' }
];

const InterviewOverview = ({ report, activeTab, onTabChange }) => {
    const currentTab = activeTab || 'technical';
    
    // Memoize tab counts to prevent recalculation
    const tabCounts = useMemo(() => ({
        technical: report?.technicalQuestions?.length || 0,
        behavioral: report?.behavioralQuestions?.length || 0,
        roadmap: report?.preparationPlan?.length || 0
    }), [report]);

    const handleTabChange = useCallback((tabId) => {
        if (typeof onTabChange === 'function') {
            onTabChange(tabId);
        }
    }, [onTabChange]);

    return (
        <div className="interview-overview" id="interview-overview">
            <div className="interview-overview__header">
                <h2 className="interview-overview__title">Interview Overview</h2>
                <div className="interview-overview__tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`interview-overview__tab ${currentTab === tab.id ? 'interview-overview__tab--active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                            <span className="interview-overview__tab-count">{tabCounts[tab.id]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="interview-overview__content">
                {currentTab === 'technical' && (
                    <div className="questions-list">
                        {report?.technicalQuestions?.map((q, i) => (
                            <QuestionCard key={q._id || i} item={q} index={i} type="Technical" />
                        ))}
                    </div>
                )}

                {currentTab === 'behavioral' && (
                    <div className="questions-list">
                        {report?.behavioralQuestions?.map((q, i) => (
                            <QuestionCard key={q._id || i} item={q} index={i} type="Behavioral" />
                        ))}
                    </div>
                )}

                {currentTab === 'roadmap' && (
                    <div className="roadmap-list">
                        {report?.preparationPlan?.map((day, i) => (
                            <RoadmapCard key={day.day || i} day={day} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const QuestionCard = memo(({ item, index, type }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    return (
        <div className={`question-card ${open ? 'question-card--open' : ''}`}>
            <div className="question-card__header" onClick={handleToggle}>
                <div className="question-card__meta">
                    <span className="question-card__index">Q{index + 1}</span>
                    <span className="question-card__type">{type}</span>
                </div>
                <p className="question-card__question">{item?.question}</p>
                {Icons.chevron}
            </div>
            {open && (
                <div className="question-card__body">
                    <div className="question-card__section">
                        <span className="question-card__tag question-card__tag--intention">
                            {Icons.intention}
                            Intention
                        </span>
                        <p>{item?.intention}</p>
                    </div>
                    <div className="question-card__section">
                        <span className="question-card__tag question-card__tag--answer">
                            {Icons.answer}
                            Model Answer
                        </span>
                        <p>{item?.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
});

const RoadmapCard = memo(({ day }) => (
    <div className="roadmap-card">
        <div className="roadmap-card__header">
            <span className="roadmap-card__badge">Day {day?.day}</span>
            <h3 className="roadmap-card__focus">{day?.focus}</h3>
        </div>
        <ul className="roadmap-card__tasks">
            {day?.tasks?.map((task, i) => (
                <li key={i}>
                    {Icons.check}
                    {task}
                </li>
            ))}
        </ul>
    </div>
));

export default memo(InterviewOverview);
