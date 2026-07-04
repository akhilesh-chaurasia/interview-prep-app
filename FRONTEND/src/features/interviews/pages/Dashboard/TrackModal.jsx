// TrackModal.jsx - Premium Design
import React, { memo, useCallback, useMemo } from 'react'

// Static icons to prevent re-creation on every render
const CloseIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ArrowIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

// Static tracks data
const TRACKS = [
    {
        id: 'DSA',
        icon: '💻',
        title: 'Data Structures & Algorithms',
        description: 'Core Fundamentals, Arrays, Strings & Interview DSA Problems',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'MERN',
        icon: '🌐',
        title: 'Full Stack Dev (MERN)',
        description: 'MongoDB, Express.js, React.js, Node.js & REST APIs',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        id: 'CORE',
        icon: '🧠',
        title: 'Core CS Fundamentals',
        description: 'Operating Systems, DBMS, SQL & Object-Oriented Programming',
        gradient: 'from-emerald-500 to-teal-500'
    }
];

const TrackModal = ({ isOpen, onClose, onSelectTrack, isStarting }) => {
    if (!isOpen) return null;

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget && !isStarting) {
            onClose()
        }
    }, [isStarting, onClose])

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && !isStarting) {
            onClose()
        }
    }, [isStarting, onClose])

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, handleKeyDown])

    const handleTrackSelect = useCallback((trackId) => {
        onSelectTrack(trackId)
    }, [onSelectTrack])

    return (
        <div 
            className='track-modal-overlay' 
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="track-modal-title"
        >
            <div className='track-modal-box' onClick={(e) => e.stopPropagation()}>
                <div className='track-modal-header'>
                    <div>
                        <h3 id="track-modal-title">Select Your Interview Track</h3>
                        <p className='track-modal-subtitle'>
                            Choose your preferred domain for personalized AI-generated questions
                        </p>
                    </div>
                    <button 
                        className='track-modal-close' 
                        onClick={onClose}
                        disabled={isStarting}
                        aria-label="Close modal"
                    >
                        {CloseIcon}
                    </button>
                </div>

                {isStarting ? (
                    <div className='track-modal-loader'>
                        <div className='btn-loader'></div>
                        <p>Generating personalized AI questions...</p>
                    </div>
                ) : (
                    <div className='track-modal-options'>
                        {TRACKS.map(track => (
                            <button 
                                key={track.id}
                                className='track-option-card' 
                                onClick={() => handleTrackSelect(track.id)}
                                disabled={isStarting}
                            >
                                <div className='track-option-icon'>
                                    <span className='track-emoji'>{track.icon}</span>
                                </div>
                                <div className='track-text'>
                                    <h4>{track.title}</h4>
                                    <p>{track.description}</p>
                                </div>
                                <div className='track-option-arrow'>
                                    {ArrowIcon}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(TrackModal)
