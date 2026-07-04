import React from 'react'

const QuestionDetailsCard = ({
    difficulty = 'Medium',
    expectedTime = '2–3 Minutes',
    idealAnswerLength = '150–250 Words',
    category = 'MERN'
}) => {
    const difficultyClass = difficulty?.toLowerCase() || 'medium'

    return (
        <div className="question-details-card">
            <div className="question-details-card__header">
                <div className="question-details-card__icon">🧠</div>
                <div>
                    <h4 className="question-details-card__title">Question Details</h4>
                    <p className="question-details-card__subtitle">Quick prep before you answer</p>
                </div>
            </div>

            <div className="question-details-card__grid">
                <div className="detail-item">
                    <span className="detail-item__icon">⚡</span>
                    <div>
                        <span className="detail-item__label">Difficulty</span>
                        <span className={`detail-item__value detail-item__value--${difficultyClass}`}>{difficulty}</span>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-item__icon">⏱️</span>
                    <div>
                        <span className="detail-item__label">Expected Time</span>
                        <span className="detail-item__value">{expectedTime}</span>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-item__icon">📝</span>
                    <div>
                        <span className="detail-item__label">Ideal Length</span>
                        <span className="detail-item__value">{idealAnswerLength}</span>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-item__icon">🎯</span>
                    <div>
                        <span className="detail-item__label">Category</span>
                        <span className="detail-item__value">{category}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionDetailsCard
