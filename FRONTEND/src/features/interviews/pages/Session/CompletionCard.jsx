import React from 'react'

const CompletionCard = ({ questionsCompleted, totalQuestions, totalWords, timeSpent, completionPercent }) => {
    return (
        <div className='completed-card'>
            <div className='completed-hero'>
                <div className='success-icon'>🎉</div>
                <div>
                    <span className='completed-subtitle'>Interview Completed</span>
                    <h2 className='completed-heading'>Well done — your session is complete.</h2>
                </div>
            </div>

            <div className='completion-summary-grid'>
                <div className='summary-card'><span className='summary-title'>Questions Completed</span><span className='summary-value'>{questionsCompleted} / {totalQuestions}</span></div>
                <div className='summary-card'><span className='summary-title'>Total Words</span><span className='summary-value'>{totalWords}</span></div>
                <div className='summary-card'><span className='summary-title'>Time Spent</span><span className='summary-value'>{timeSpent}</span></div>
                <div className='summary-card'><span className='summary-title'>Completion</span><span className='summary-value'>{completionPercent}%</span></div>
            </div>

            <div className='summary-card summary-card-full'>
                <span className='summary-title'>Interview Summary</span>
                <p className='summary-note'>This premium completion report reflects the full interview session...</p>
            </div>
            <div className='celebration-effect'></div>
        </div>
    )
}

export default CompletionCard