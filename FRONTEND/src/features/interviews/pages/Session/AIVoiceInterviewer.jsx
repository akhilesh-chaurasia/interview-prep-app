import React, { useState, useEffect, useRef, useCallback } from 'react'
import './AIVoiceInterviewer.scss'

const AIVoiceInterviewer = ({
    question,
    questionNumber = 1,
    totalQuestions = 5,
    isListening = false,
    onStartListening,
    onStopListening,
    disabled = false,
    audioLevel = 0,
    interimTranscript = '',
    speechLang = 'en-IN',
    onSpeechLangChange
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [autoSpeak, setAutoSpeak] = useState(() => {
        const saved = localStorage.getItem('yt_genai_auto_speak')
        return saved !== null ? saved === 'true' : true
    })
    const [voices, setVoices] = useState([])
    const [selectedVoice, setSelectedVoice] = useState(null)
    const [speechRate, setSpeechRate] = useState(1.0)
    const [hasSpeechSynthesis, setHasSpeechSynthesis] = useState(true)
    const prevQuestionRef = useRef(question)

    // Load available browser voices
    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setHasSpeechSynthesis(false)
            return
        }

        const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices()
            // Filter English voices first, fallback to all
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'))
            const voiceList = englishVoices.length > 0 ? englishVoices : availableVoices
            setVoices(voiceList)

            // Select a natural preferred voice
            if (voiceList.length > 0 && !selectedVoice) {
                const preferred = voiceList.find(v => 
                    v.name.includes('Natural') || 
                    v.name.includes('Google') || 
                    v.name.includes('Samantha') || 
                    v.name.includes('Jenny')
                ) || voiceList[0]
                setSelectedVoice(preferred.name)
            }
        }

        updateVoices()
        window.speechSynthesis.onvoiceschanged = updateVoices

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [selectedVoice])

    // Speak question aloud
    const speakQuestion = useCallback(() => {
        if (!('speechSynthesis' in window) || !question) return

        window.speechSynthesis.cancel() // Stop any previous speech
        if (isListening && onStopListening) {
            onStopListening()
        }

        const cleanQuestionText = question.replace(/[*_#`]/g, '')
        const announcement = `Question ${questionNumber} of ${totalQuestions}. ${cleanQuestionText}`
        const utterance = new SpeechSynthesisUtterance(announcement)

        if (selectedVoice && voices.length > 0) {
            const voiceObj = voices.find(v => v.name === selectedVoice)
            if (voiceObj) utterance.voice = voiceObj
        }

        utterance.rate = speechRate
        utterance.pitch = 1.0

        utterance.onstart = () => {
            setIsSpeaking(true)
        }

        utterance.onend = () => {
            setIsSpeaking(false)
        }

        utterance.onerror = () => {
            setIsSpeaking(false)
        }

        window.speechSynthesis.speak(utterance)
    }, [question, questionNumber, totalQuestions, selectedVoice, voices, speechRate, isListening, onStopListening])

    // Stop speaking
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }

    // Auto-speak when question changes if enabled
    useEffect(() => {
        if (autoSpeak && question && prevQuestionRef.current !== question) {
            prevQuestionRef.current = question
            // Small timeout to allow state updates
            const timeoutId = setTimeout(() => {
                speakQuestion()
            }, 400)
            return () => clearTimeout(timeoutId)
        }
        prevQuestionRef.current = question
    }, [question, autoSpeak, speakQuestion])

    const handleAutoSpeakToggle = () => {
        const nextVal = !autoSpeak
        setAutoSpeak(nextVal)
        localStorage.setItem('yt_genai_auto_speak', String(nextVal))
        if (!nextVal && isSpeaking) {
            stopSpeaking()
        }
    }

    if (!hasSpeechSynthesis) {
        return null
    }

    return (
        <div className={`ai-voice-interviewer ${isSpeaking ? 'is-ai-speaking' : ''} ${isListening ? 'is-user-speaking' : ''}`}>
            <div className='ai-voice-interviewer__header'>
                <div className='ai-avatar-wrap'>
                    <div className='ai-avatar'>
                        <span className='ai-avatar__icon'>🎙️</span>
                        {(isSpeaking || isListening) && (
                            <span className='ai-avatar__pulse-ring'></span>
                        )}
                    </div>
                    <div className='ai-persona'>
                        <div className='ai-persona__title'>
                            AI Technical Interviewer
                            <span className={`ai-persona__status ${isSpeaking ? 'speaking' : isListening ? 'listening' : 'ready'}`}>
                                {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
                            </span>
                        </div>
                        <div className='ai-persona__subtitle'>
                            {isSpeaking
                                ? 'Reading question aloud...'
                                : isListening
                                ? `Listening in ${speechLang === 'en-IN' ? 'English (India)' : speechLang === 'en-US' ? 'English (US)' : speechLang === 'hi-IN' ? 'Hindi' : 'English (UK)'}...`
                                : 'Interactive Voice Simulation'}
                        </div>
                    </div>
                </div>

                {/* Animated / Reactive Waveform Equalizer */}
                <div className='ai-waveform-container' aria-hidden="true">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                        let dynamicHeight = undefined
                        if (isListening && audioLevel > 0) {
                            const multiplier = 0.5 + ((bar * 2) % 4) * 0.25
                            const calculated = Math.max(6, Math.min(26, Math.round((audioLevel / 100) * 26 * multiplier)))
                            dynamicHeight = `${calculated}px`
                        }
                        return (
                            <span 
                                key={bar} 
                                className={`ai-waveform-bar ${isSpeaking ? 'active-ai' : isListening ? 'active-user' : ''}`}
                                style={{ 
                                    animationDelay: `${bar * 0.12}s`,
                                    height: dynamicHeight 
                                }}
                            />
                        )
                    })}
                </div>
            </div>

            <div className='ai-voice-interviewer__controls'>
                <div className='controls-group-main'>
                    {/* Read / Stop AI Question Voice */}
                    {isSpeaking ? (
                        <button
                            type='button'
                            className='voice-btn voice-btn--stop'
                            onClick={stopSpeaking}
                            title="Stop AI voice"
                        >
                            <span className='voice-btn__icon'>⏹</span>
                            <span>Stop AI Voice</span>
                        </button>
                    ) : (
                        <button
                            type='button'
                            className='voice-btn voice-btn--speak'
                            onClick={speakQuestion}
                            disabled={disabled}
                            title="Listen to this question"
                        >
                            <span className='voice-btn__icon'>🔊</span>
                            <span>Read Question Aloud</span>
                        </button>
                    )}

                    {/* Candidate Mic Toggle */}
                    {isListening ? (
                        <button
                            type='button'
                            className='voice-btn voice-btn--recording'
                            onClick={onStopListening}
                            title="Stop speaking your answer"
                        >
                            <span className='voice-btn__icon'>⏹</span>
                            <span>Stop Speaking (Mic On)</span>
                        </button>
                    ) : (
                        <button
                            type='button'
                            className='voice-btn voice-btn--mic'
                            onClick={onStartListening}
                            disabled={disabled || isSpeaking}
                            title="Answer using your microphone"
                        >
                            <span className='voice-btn__icon'>🎙️</span>
                            <span>Speak Your Answer</span>
                        </button>
                    )}
                </div>

                <div className='controls-group-settings'>
                    {/* Candidate Mic Accent / Language */}
                    <select
                        className='voice-select-accent'
                        value={speechLang}
                        onChange={(e) => onSpeechLangChange && onSpeechLangChange(e.target.value)}
                        title="Candidate Speech Recognition Accent / Language"
                    >
                        <option value="en-IN">🇮🇳 Mic: English (India)</option>
                        <option value="en-US">🇺🇸 Mic: English (US)</option>
                        <option value="en-GB">🇬🇧 Mic: English (UK)</option>
                        <option value="hi-IN">🇮🇳 Mic: Hindi</option>
                    </select>

                    {/* Auto-read Switch */}
                    <label className='auto-read-toggle' title="Automatically read questions when loaded">
                        <input
                            type="checkbox"
                            checked={autoSpeak}
                            onChange={handleAutoSpeakToggle}
                        />
                        <span className='toggle-slider'></span>
                        <span className='toggle-label'>Auto-Speak</span>
                    </label>

                    {/* Speed Rate Toggle */}
                    <select
                        className='voice-select-speed'
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        title="Voice Speed Rate"
                    >
                        <option value="0.85">0.85x (Slow)</option>
                        <option value="1.0">1.0x (Normal)</option>
                        <option value="1.2">1.2x (Fast)</option>
                    </select>

                    {/* Voice Selection */}
                    {voices.length > 1 && (
                        <select
                            className='voice-select-accent'
                            value={selectedVoice || ''}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            title="Select AI Voice Accent"
                        >
                            {voices.slice(0, 10).map((v) => (
                                <option key={v.name} value={v.name}>
                                    {v.name.length > 20 ? v.name.substring(0, 20) + '...' : v.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Live Transcript / Mic Active Feedback Banner */}
            {isListening && (
                <div className={`live-transcript-banner ${!interimTranscript ? 'live-transcript-banner--waiting' : ''}`}>
                    <span className='live-dot pulse'></span>
                    <span className='live-label'>
                        {interimTranscript ? 'Detecting Live:' : 'Microphone Active:'}
                    </span>
                    <span className='live-text'>
                        {interimTranscript ? `"${interimTranscript}"` : 'Listening... Speak your answer clearly'}
                    </span>
                </div>
            )}
        </div>
    )
}

export default AIVoiceInterviewer
