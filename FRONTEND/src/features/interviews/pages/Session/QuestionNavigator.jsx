import React from 'react'

const QuestionNavigator = ({ questions, currentStep }) => {
    const getStatus = (index) => {
        const hasAnswer = Boolean(questions?.[index]?.answer?.trim())

        if (hasAnswer) return 'completed'
        if (index === currentStep) return 'current'
        return 'pending'
    }

    return (
        <div className="question-navigator-wrap">
            <div className="question-navigator" aria-label="Question progress tracker">
                {questions?.map((_, index) => {
                    const status = getStatus(index)

                    return (
                        <div
                            key={index}
                            className={`nav-pill ${status}`}
                            title={`Question ${index + 1} - ${status}`}
                        >
                            <span className="nav-pill__number">Q{index + 1}</span>
                            <span className="nav-pill__status">
                                {status === 'completed' ? 'Done' : status === 'current' ? 'Now' : 'Next'}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="nav-legend" aria-hidden="true">
                <span><i className="nav-legend__dot nav-legend__dot--done" /> Done</span>
                <span><i className="nav-legend__dot nav-legend__dot--current" /> Now</span>
                <span><i className="nav-legend__dot nav-legend__dot--next" /> Next</span>
            </div>
        </div>
    )
}

export default QuestionNavigator