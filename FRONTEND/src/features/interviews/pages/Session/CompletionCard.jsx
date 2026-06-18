import React from 'react'

const STATS = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        ),
        label: 'Questions',
        color: 'green'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
        label: 'Words Spoken',
        color: 'blue'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        label: 'Time Spent',
        color: 'purple'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),
        label: 'Completion',
        color: 'pink'
    },
]

const CompletionCard = ({ questionsCompleted, totalQuestions, totalWords, timeSpent, completionPercent }) => {
    const values = [
        `${questionsCompleted} / ${totalQuestions}`,
        totalWords,
        timeSpent,
        `${completionPercent}%`,
    ]

    return (
        <div className='completed-card'>

            {/* Ambient glows */}
            <div className='completed-glow completed-glow--purple' />
            <div className='completed-glow completed-glow--pink' />

            {/* Hero */}
            <div className='completed-hero'>
                <div className='completed-badge'>
                    <span className='completed-badge__emoji'>🏆</span>
                    <div className='completed-badge__ring' />
                </div>
                <div className='completed-hero__text'>
                    <span className='completed-label'>Interview Complete</span>
                    <h2 className='completed-heading'>Great work — session finished!</h2>
                </div>
            </div>

            {/* Stats grid */}
            <div className='completion-stats-grid'>
                {STATS.map((stat, i) => (
                    <div key={i} className={`cstat cstat--${stat.color}`}>
                        <div className='cstat__icon'>{stat.icon}</div>
                        <div className='cstat__body'>
                            <span className='cstat__value'>{values[i]}</span>
                            <span className='cstat__label'>{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default CompletionCard