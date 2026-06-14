// TrackModal.jsx
import React from 'react'

const TrackModal = ({ isOpen, onClose, onSelectTrack, isStarting }) => {
    if (!isOpen) return null;

    return (
        <div className='track-modal-overlay'>
            <div className='track-modal-box'>
                <div className='track-modal-header'>
                    <h3>Select Your Interview Track 🚀</h3>
                    <button 
                        className='track-modal-close' 
                        onClick={onClose}
                        disabled={isStarting}
                    >
                        ✖
                    </button>
                </div>
                
                <p className='track-modal-subtitle'>
                    Apna preferred domain select karein. Humara GenAI usi ke fundamentals se related questions generate karega.
                </p>

                {isStarting ? (
                    <div className='track-modal-loader'>
                        <div className='btn-loader'></div>
                        <p>Generating personalized AI questions...</p>
                    </div>
                ) : (
                    <div className='track-modal-options'>
                        <button className='track-option-card' onClick={() => onSelectTrack("DSA")}>
                            <span className='track-icon'>💻</span>
                            <div className='track-text'>
                                <h4>Data Structures & Algorithms</h4>
                                <p>Core Fundamentals, Arrays, Strings & Interview DSA Problems</p>
                            </div>
                        </button>

                        <button className='track-option-card' onClick={() => onSelectTrack("MERN")}>
                            <span className='track-icon'>🌐</span>
                            <div className='track-text'>
                                <h4>Full Stack Dev (MERN)</h4>
                                <p>MongoDB, Express.js, React.js, Node.js & REST APIs</p>
                            </div>
                        </button>

                        <button className='track-option-card' onClick={() => onSelectTrack("CORE")}>
                            <span className='track-icon'>🧠</span>
                            <div className='track-text'>
                                <h4>Core CS Fundamentals</h4>
                                <p>Operating Systems, DBMS, SQL & Object-Oriented Programming</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrackModal