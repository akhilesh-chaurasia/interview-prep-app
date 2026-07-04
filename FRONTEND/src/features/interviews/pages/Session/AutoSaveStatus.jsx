import React, { useEffect, useState } from 'react'

const getRelativeLabel = (lastSavedAt) => {
    if (!lastSavedAt) return 'Just now'

    const secondsAgo = Math.floor((Date.now() - lastSavedAt) / 1000)

    if (secondsAgo < 5) return 'Just now'
    if (secondsAgo < 10) return '5 sec ago'
    if (secondsAgo < 20) return '10 sec ago'
    return 'A few sec ago'
}

const AutoSaveStatus = ({ isSaving, lastSavedAt }) => {
    const [displayLabel, setDisplayLabel] = useState('Just now')

    useEffect(() => {
        setDisplayLabel(getRelativeLabel(lastSavedAt))

        if (!lastSavedAt) return undefined

        const interval = window.setInterval(() => {
            setDisplayLabel(getRelativeLabel(lastSavedAt))
        }, 1000)

        return () => window.clearInterval(interval)
    }, [lastSavedAt])

    return (
        <div className={`auto-save-status ${isSaving ? 'is-saving' : ''}`}>
            <span className="auto-save-status__dot" />
            <span className="auto-save-status__text">
                {isSaving ? 'Saving...' : 'Auto Saved'}
            </span>
            {!isSaving && (
                <span className="auto-save-status__meta">Last saved: {displayLabel}</span>
            )}
        </div>
    )
}

export default AutoSaveStatus
