import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import "../../style/interviewSession.scss";
import { useParams } from 'react-router'

import ProgressHeader from './ProgressHeader'
import QuestionNavigator from './QuestionNavigator'
import AnswerContainer from './AnswerContainer'
import CompletionCard from './CompletionCard'
import InterviewReplay from './InterviewReplay'
import ResumeSessionPrompt from './ResumeSessionPrompt'
import ErrorCard from '../../components/ErrorCard'

import { useSessionAutoSave } from '../../hooks/useSessionAutoSave'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const InterviewSession = () => {
    const { sessionId } = useParams()
    const [session, setSession] = useState(null)
    const [answer, setAnswer] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const timerIntervalRef = useRef(null)

    // Error states
    const [fetchError, setFetchError] = useState(null)
    const [submitError, setSubmitError] = useState(null)

    // Resume prompt state
    const [showResumePrompt, setShowResumePrompt] = useState(false)
    const [pendingSavedData, setPendingSavedData] = useState(null)

    // Auto-save hook
    const { getSaved, clearSaved } = useSessionAutoSave(sessionId, {
        answer,
        timer,
        currentStep: session?.currentStep ?? 0,
        completed: session?.completed ?? false
    })

    // Metrics & Counts Logic
    const wordCount = answer.trim() === "" ? 0 : answer.trim().split(/\s+/).length
    const confidencePercent = Math.min(100, wordCount)
    const answerQuality = wordCount < 30 ? "Too Short" : wordCount <= 100 ? "Good" : "Detailed"
    const qualityClass = wordCount < 30 ? "low" : wordCount <= 100 ? "good" : "detailed"

    const totalQuestions = session?.questions?.length ?? 0
    const questionsCompleted = session?.completed ? (session?.currentStep ?? 0) + 1 : session?.currentStep ?? 0
    const totalWords = session?.questions?.reduce((sum, q) => sum + (q.answer ? q.answer.trim().split(/\s+/).filter(Boolean).length : 0), 0) ?? 0
    const timeSpent = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
    const completionPercent = session?.completed ? 100 : totalQuestions ? Math.round((questionsCompleted / totalQuestions) * 100) : 0

    // Fetch Session Effect
    const fetchSession = async () => {
        try {
            setLoading(true)
            setFetchError(null)
            const res = await axios.get(`http://localhost:3000/api/interview/session/${sessionId}`, { withCredentials: true })
            const fetchedSession = res.data.session
            setSession(fetchedSession)

            // Check for saved progress only once, right after the first successful fetch
            if (!fetchedSession.completed) {
                const saved = getSaved()
                if (saved) {
                    setPendingSavedData(saved)
                    setShowResumePrompt(true)
                }
            }
        } catch (err) {
            console.log(err)
            setFetchError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (sessionId) fetchSession()
    }, [sessionId])

    // Timer Effect
    useEffect(() => {
        if (session && !session.completed) {
            const interval = setInterval(() => setTimer(prev => prev + 1), 1000)
            timerIntervalRef.current = interval
            return () => clearInterval(timerIntervalRef.current)
        } else if (session?.completed && timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
        }
    }, [session])

    // Voice & Keyboard Handlers
    const startListening = () => {
        if (!SpeechRecognition) return alert("Speech Recognition not supported")
        const recognition = new SpeechRecognition()
        recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-US";
        recognition.start(); setIsListening(true)
        recognition.onresult = (e) => {
            let transcript = ""
            for (let i = e.resultIndex; i < e.results.length; i++) transcript += e.results[i][0].transcript
            setAnswer(transcript)
        }
        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        window.currentRecognition = recognition
    }

    const stopListening = () => {
        if (window.currentRecognition) window.currentRecognition.stop()
        setIsListening(false)
    }

    const submitAnswer = async () => {
        if (!answer.trim()) return
        try {
            setLoading(true)
            setSubmitError(null)
            const res = await axios.post("http://localhost:3000/api/interview/session/submit-answer", { sessionId: session._id, answer }, { withCredentials: true })
            setSession(res.data.session); setAnswer("")
        } catch (err) {
            console.log(err)
            setSubmitError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'Enter' && answer.trim() && !loading) {
                e.preventDefault(); submitAnswer()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [answer, loading])

    // Resume prompt handlers
    const handleResume = () => {
        if (pendingSavedData) {
            setAnswer(pendingSavedData.answer || "")
            setTimer(pendingSavedData.timer || 0)
        }
        setShowResumePrompt(false)
        setPendingSavedData(null)
    }

    const handleStartFresh = () => {
        clearSaved()
        setShowResumePrompt(false)
        setPendingSavedData(null)
    }

    const currentQuestion = session?.questions?.[session.currentStep]?.question
    const currentFeedback = session?.questions?.[session.currentStep - 1]?.feedback

    // Failed to load session — full error view, no blank screen
    if (fetchError && !session) {
        return (
            <div className='interview-page'>
                <div className='interview-container' style={{ maxWidth: 600, margin: '4rem auto' }}>
                    <ErrorCard
                        error={fetchError}
                        message="Failed to load your interview session. Please try again."
                        onRetry={fetchSession}
                        retryLabel="Reload Session"
                    />
                </div>
            </div>
        )
    }

    if (!session) return null

    return (
        <div className='interview-page'>

            {/* Resume previous session prompt */}
            {showResumePrompt && pendingSavedData && (
                <ResumeSessionPrompt
                    savedAt={pendingSavedData.savedAt}
                    onResume={handleResume}
                    onStartFresh={handleStartFresh}
                />
            )}

            <div className='interview-container'>

                {session.completed ? (
                    /* ── COMPLETED VIEW ─────────────────────────────────── */
                    <>
                        <CompletionCard
                            questionsCompleted={questionsCompleted} totalQuestions={totalQuestions}
                            totalWords={totalWords} timeSpent={timeSpent} completionPercent={completionPercent}
                        />
                        <InterviewReplay questions={session.questions} />
                    </>
                ) : (
                    /* ── ACTIVE INTERVIEW VIEW ──────────────────────────── */
                    <>
                        <ProgressHeader currentStep={session.currentStep} totalQuestions={totalQuestions} timer={timer} />
                        <QuestionNavigator questions={session.questions} currentStep={session.currentStep} />

                        <div className='question-card'>
                            <span className='question-label'>Interview Question</span>
                            <h2 className='question'>{currentQuestion}</h2>
                        </div>

                        <AnswerContainer
                            answer={answer} setAnswer={setAnswer} isListening={isListening}
                            startListening={startListening} stopListening={stopListening}
                            loading={loading} submitAnswer={submitAnswer} wordCount={wordCount}
                            confidencePercent={confidencePercent} answerQuality={answerQuality} qualityClass={qualityClass}
                        />

                        {submitError && (
                            <ErrorCard
                                error={submitError}
                                message="Failed to submit your answer. Please try again."
                                onRetry={() => { setSubmitError(null); submitAnswer() }}
                                retryLabel="Retry Submit"
                            />
                        )}

                        {currentFeedback && (
                            <div className='feedback-box'>
                                <h4>AI Feedback</h4>
                                <p>{currentFeedback}</p>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    )
}

export default InterviewSession