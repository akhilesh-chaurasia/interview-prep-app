import React from 'react'

const timeAgo = (savedAt) => {
    const mins = Math.floor((Date.now() - savedAt) / 60000)
    if (mins < 1) return 'just now'
    if (mins === 1) return '1 minute ago'
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(mins / 60)
    return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`
}

const ResumeSessionPrompt = ({ savedAt, onResume, onStartFresh }) => (
    <div className='resume-prompt-overlay'>
        <div className='resume-prompt-card'>
            <div className='resume-prompt__icon'>⚡</div>
            <h3 className='resume-prompt__title'>Resume Previous Session?</h3>
            <p className='resume-prompt__sub'>
                You have unsaved progress from <strong>{timeAgo(savedAt)}</strong>.
            </p>
            <div className='resume-prompt__actions'>
                <button type="button" className='btn btn--secondary' aria-label="Resume your previous session" onClick={onResume}>
                    Resume Session
                </button>
                <button type="button" className='btn btn--danger' aria-label="Start a fresh interview session" onClick={onStartFresh}>
                    Start Fresh
                </button>
            </div>
        </div>
    </div>
)

export default ResumeSessionPrompt