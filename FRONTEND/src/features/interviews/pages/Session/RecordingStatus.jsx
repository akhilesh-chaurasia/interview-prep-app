import React from 'react'

const RecordingStatus = ({ status = 'idle' }) => {
    const normalizedStatus = status?.toLowerCase() || 'idle'

    const statusCopy = {
        idle: 'Idle',
        listening: 'Listening...',
        recording: 'Recording...',
        processing: 'Processing speech...'
    }

    const isActive = normalizedStatus !== 'idle'

    return (
        <div className={`recording-status ${isActive ? 'is-active' : ''}`}>
            <span className={`recording-status__icon ${normalizedStatus}`}>
                🎤
            </span>
            <span className="recording-status__text">{statusCopy[normalizedStatus] || statusCopy.idle}</span>
        </div>
    )
}

export default RecordingStatus
