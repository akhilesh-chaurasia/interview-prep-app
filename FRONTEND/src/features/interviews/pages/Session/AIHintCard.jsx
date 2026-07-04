import React, { useEffect, useState } from 'react'

const hints = [
    'Explain the architecture clearly before diving into implementation details.',
    'Mention the trade-offs you considered and why you chose this approach.',
    'Support your answer with one practical example from a real-world scenario.'
]

const AIHintCard = () => {
    const [activeHintIndex, setActiveHintIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (!isAnimating) return

        const timer = window.setTimeout(() => setIsAnimating(false), 280)
        return () => window.clearTimeout(timer)
    }, [isAnimating])

    const handleNextHint = () => {
        setIsAnimating(true)
        setActiveHintIndex((prev) => (prev + 1) % hints.length)
    }

    return (
        <div className="ai-hint-card">
            <div className="ai-hint-card__header">
                <div className="ai-hint-card__icon">💡</div>
                <div>
                    <h4 className="ai-hint-card__title">AI Hint</h4>
                    <p className="ai-hint-card__subtitle">A gentle nudge without revealing the full answer.</p>
                </div>
            </div>

            <div key={activeHintIndex} className={`ai-hint-card__content ${isAnimating ? 'is-animating' : ''}`}>
                <p>{hints[activeHintIndex]}</p>
            </div>

            <button type="button" className="ai-hint-card__button" onClick={handleNextHint}>
                Show Another Hint
            </button>
        </div>
    )
}

export default AIHintCard
