import React from 'react'

const QuestionNavigator = ({ questions, currentStep }) => {
    return (
        <div className="question-navigator">
            {questions?.map((_, index) => (
                <div
                    key={index}
                    className={`nav-pill ${
                        index < currentStep ? "completed" : index === currentStep ? "current" : "pending"
                    }`}
                >
                    Q{index + 1}
                </div>
            ))}
        </div>
    )
}

export default QuestionNavigator