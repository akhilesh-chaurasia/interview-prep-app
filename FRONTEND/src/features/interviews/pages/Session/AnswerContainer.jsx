import React from 'react'

const AnswerContainer = ({ 
    answer, setAnswer, isListening, startListening, stopListening, 
    loading, submitAnswer, wordCount, confidencePercent, answerQuality, qualityClass 
}) => {
    return (
        <div className='answer-container'>
            <textarea
                className='answer-box'
                rows={8}
                placeholder='Write your answer here...'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onInput={(e) => {
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                }}
            />

            <div className='answer-metrics'>
                <div className='metric-card'>
                    <span className='metric-label'>Answer Quality</span>
                    <span className={`quality-status ${qualityClass}`}>{answerQuality}</span>
                </div>

                <div className='metric-card'>
                    <span className='metric-label'>Confidence Meter</span>
                    <span className='metric-value'>{confidencePercent}%</span>
                    <div className='confidence-track'>
                        <div className='confidence-fill' style={{ width: `${confidencePercent}%` }} />
                    </div>
                    <div className='confidence-value'>
                        <span>{wordCount} words</span>
                        <span>{confidencePercent}%</span>
                    </div>
                </div>
            </div>

            <div className='answer-footer'>
                {!isListening ? (
                    <button className='voice-btn voice-btn--inline' onClick={startListening}>🎤 Start Speaking</button>
                ) : (
                    <div className='recording-pill'>
                        <div className='recording-indicator'></div>
                        <div className='sound-wave'>
                            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, idx) => (
                                <div key={idx} className='wave-bar' style={{ animationDelay: `${delay}s` }}></div>
                            ))}
                        </div>
                        <span className='recording-text'>Listening...</span>
                        <button className='voice-btn stop recording' onClick={stopListening}>⏹ Stop</button>
                    </div>
                )}
                <button className='submit-answer-btn' onClick={submitAnswer} disabled={loading}>
                    {loading ? <><span className='btn-loader'></span>Submitting...</> : "Submit Answer"}
                </button>
            </div>
        </div>
    )
}

export default AnswerContainer