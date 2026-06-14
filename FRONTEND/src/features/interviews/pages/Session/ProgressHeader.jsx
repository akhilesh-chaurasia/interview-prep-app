import React from 'react'

const ProgressHeader = ({ currentStep, totalQuestions, timer }) => {
    const timeSpent = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`

    return (
        <div className='progress-section'>
            <div className='progress-header'>
                <span className='progress-label'>
                    Question {currentStep + 1} of {totalQuestions || '?'}
                </span>
                <div className='progress-header-right'>
                    <span className='timer-label'>Session Time</span>
                    <span className='timer-display'>{timeSpent}</span>
                </div>
            </div>
            <div className='progress-bar'>
                <div
                    className='progress-fill'
                    style={{
                        width: totalQuestions ? `${((currentStep + 1) / totalQuestions) * 100}%` : '0%'
                    }}
                ></div>
            </div>
        </div>
    )
}

export default ProgressHeader