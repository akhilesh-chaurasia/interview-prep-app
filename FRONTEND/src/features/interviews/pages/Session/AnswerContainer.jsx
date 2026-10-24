import React, { useState, useEffect } from 'react'
import DSACodeSandbox from './DSACodeSandbox'
import './AnswerContainer.scss'

export const parseAnswerComponents = (raw) => {
    if (!raw) return { explanation: '', code: '', language: 'javascript' }
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/
    const match = raw.match(codeBlockRegex)
    if (match) {
        const language = match[1] || 'javascript'
        const code = match[2]
        const explanation = raw.replace(codeBlockRegex, '').trim()
        return { explanation, code, language }
    }
    return { explanation: raw, code: '', language: 'javascript' }
}

export const formatAnswerComponents = (explanation, code, language = 'javascript') => {
    const expTrimmed = (explanation || '').trim()
    const codeTrimmed = (code || '').trim()

    if (codeTrimmed && expTrimmed) {
        return `${explanation}\n\n\`\`\`${language}\n${code}\n\`\`\``
    } else if (codeTrimmed) {
        return `\`\`\`${language}\n${code}\n\`\`\``
    } else {
        return explanation || ''
    }
}

const AnswerContainer = ({ answer = '', setAnswer, track = 'MERN', isListening = false }) => {
    // Mode: 'text' | 'code' | 'split'
    const [mode, setMode] = useState(() => (track === 'DSA' ? 'split' : 'text'))

    // Auto-switch from 'code' only to 'split' mode if user speaks answer
    useEffect(() => {
        if (isListening && mode === 'code') {
            setMode('split')
        }
    }, [isListening, mode])

    // Derive explanation, code, and language directly from answer prop - instant updates without lag
    const { explanation, code, language } = parseAnswerComponents(answer)
    const [localLang, setLocalLang] = useState(language || 'javascript')

    const activeLang = language || localLang

    const handleExplanationChange = (e) => {
        const nextVal = e.target.value
        setAnswer(formatAnswerComponents(nextVal, code, activeLang))
    }

    const handleCodeChange = (nextCode) => {
        setAnswer(formatAnswerComponents(explanation, nextCode, activeLang))
    }

    const handleLanguageChange = (nextLang) => {
        setLocalLang(nextLang)
        setAnswer(formatAnswerComponents(explanation, code, nextLang))
    }

    const wordCount = explanation.trim() ? explanation.trim().split(/\s+/).length : 0

    return (
        <div className='answer-container-enhanced'>
            {/* View Mode Switcher */}
            <div className='answer-mode-bar'>
                <div className='mode-tabs'>
                    <button
                        type='button'
                        className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
                        onClick={() => setMode('text')}
                        title="Text and explanation only"
                    >
                        📝 Text Explanation
                    </button>
                    <button
                        type='button'
                        className={`mode-tab ${mode === 'code' ? 'active' : ''}`}
                        onClick={() => setMode('code')}
                        title="Code Editor sandbox"
                    >
                        💻 Code Sandbox
                    </button>
                    <button
                        type='button'
                        className={`mode-tab ${mode === 'split' ? 'active' : ''}`}
                        onClick={() => setMode('split')}
                        title="Split view with explanation & code"
                    >
                        🔀 Split View
                    </button>
                </div>

                <div className='mode-info'>
                    {mode !== 'code' && (
                        <span className='word-counter'>{wordCount} words</span>
                    )}
                    {track === 'DSA' && (
                        <span className='dsa-badge'>DSA Track</span>
                    )}
                </div>
            </div>

            {/* Editor Panes */}
            <div className={`answer-panes answer-panes--${mode}`}>
                {/* Explanation Pane */}
                {(mode === 'text' || mode === 'split') && (
                    <div className='pane pane--explanation'>
                        <div className='pane-header'>
                            <div className='pane-title-group'>
                                <span>Approach & Explanation</span>
                                {isListening && (
                                    <span className='pane-mic-indicator' title="Microphone is actively recording your response">
                                        <span className='pane-mic-dot'></span> Live Speech Detection
                                    </span>
                                )}
                            </div>
                            <span className='pane-hint'>Explain intuition, complexity, edge cases</span>
                        </div>
                        <textarea
                            id='answer-box'
                            className={`answer-box answer-box--enhanced ${isListening ? 'answer-box--listening' : ''}`}
                            rows={mode === 'split' ? 12 : 8}
                            placeholder={isListening ? '🎙️ Listening... Speak your answer now (words will appear here automatically)...' : 'Explain your approach, time/space complexity (O(N)), trade-offs, and edge cases...'}
                            value={explanation}
                            onChange={handleExplanationChange}
                            aria-label='Approach and explanation text'
                        />
                        {isListening && (
                            <div className='live-speech-status-bar'>
                                <span className='speech-pulse-indicator'></span>
                                <span className='speech-status-text'>
                                    {explanation.trim() 
                                        ? '✅ Speech detected! Text is appearing in the answer box above.' 
                                        : '🎙️ Microphone listening... Speak your answer clearly into your microphone.'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Code Sandbox Pane */}
                {(mode === 'code' || mode === 'split') && (
                    <div className='pane pane--code'>
                        {mode === 'split' && (
                            <div className='pane-header'>
                                <span>Code Implementation</span>
                                <span className='pane-hint'>Write clean, optimal code</span>
                            </div>
                        )}
                        <DSACodeSandbox
                            code={code}
                            setCode={handleCodeChange}
                            language={language}
                            setLanguage={handleLanguageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnswerContainer