import React from 'react'

const NextImprovementCard = ({ tip, onApplyTip }) => {
    const handleApply = () => {
        if (onApplyTip) onApplyTip()
    }

    return (
        <div className='next-improvement-card' role='button' tabIndex={0} onClick={handleApply} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleApply() }}>
            <div className='next-improvement-card__head'>
                <span className='next-improvement-card__icon'>💡</span>
                <div>
                    <h4 className='next-improvement-card__title'>Next Improvement</h4>
                    <p className='next-improvement-card__sub'>Small focused tip to work on next</p>
                </div>
            </div>
            <div className='next-improvement-card__body'>
                <p className='next-improvement-card__tip'>{tip || "Try structuring your answer with a brief situation, action, and result (STAR)."}</p>
                <div className='next-improvement-card__actions'>
                    <button type='button' className='btn btn--secondary' aria-label='Apply improvement tip' onClick={(event) => { event.stopPropagation(); handleApply() }}>
                        Apply Tip
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NextImprovementCard
