import React, { useEffect, useState } from 'react'

const steps = [
    'Analyzing technical accuracy...',
    'Evaluating communication...',
    'Generating personalized feedback...'
]

const AIThinkingLoader = () => {
    const [activeStepIndex, setActiveStepIndex] = useState(0)

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveStepIndex((prev) => (prev + 1) % steps.length)
        }, 1100)

        return () => window.clearInterval(interval)
    }, [])

    return (
        <div className="ai-thinking-loader">
            <div className="ai-thinking-loader__icon">✨</div>
            <div className="ai-thinking-loader__content">
                <div className="ai-thinking-loader__header">
                    <span className="ai-thinking-loader__pulse" />
                    <span>AI is thinking</span>
                </div>
                <div className="ai-thinking-loader__step">{steps[activeStepIndex]}</div>
                <div className="ai-thinking-loader__bar">
                    <span className="ai-thinking-loader__bar-fill" />
                </div>
            </div>
        </div>
    )
}

export default AIThinkingLoader
