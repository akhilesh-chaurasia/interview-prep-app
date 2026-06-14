import React, { useState, useEffect, useRef } from 'react'
import "../../style/interviewSession.scss";
import { useParams } from 'react-router'
import { getInterviewSession, submitInterviewAnswer } from '../../services/interview.api'

// Sub-Components Import
import ProgressHeader from './ProgressHeader'
import QuestionNavigator from './QuestionNavigator'
import AnswerContainer from './AnswerContainer'
import CompletionCard from './CompletionCard'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const InterviewSession = () => {
    const { sessionId } = useParams()
    const [session, setSession] = useState(null)
    const [answer, setAnswer] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const timerIntervalRef = useRef(null)

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
    useEffect(() => {
        const fetchSession = async () => {
            try {
                setLoading(true)
                const data = await getInterviewSession(sessionId)
                setSession(data.session)
            } catch (err) { console.log(err) } finally { setLoading(false) }
        }
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
            const data = await submitInterviewAnswer({ sessionId: session._id, answer })
            setSession(data.session); setAnswer("")
        } catch (err) { console.log(err) } finally { setLoading(false) }
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

    const currentQuestion = session?.questions?.[session.currentStep]?.question
    const currentFeedback = session?.questions?.[session.currentStep - 1]?.feedback

    return (
        <div className='interview-page'>
            {session && (
                <div className='interview-box'>
                    {/* 1. Header & Timer */}
                    <ProgressHeader currentStep={session.currentStep} totalQuestions={totalQuestions} timer={timer} />

                    {/* 2. Navigation Pills */}
                    <QuestionNavigator questions={session.questions} currentStep={session.currentStep} />

                    {/* Question Card */}
                    <div className='question-card'>
                        <span className='question-label'>Interview Question</span>
                        <h2 className='question'>{currentQuestion}</h2>
                    </div>
                                
                    {/* 3. Input & Metrics Container */}
                    <AnswerContainer 
                        answer={answer} setAnswer={setAnswer} isListening={isListening}
                        startListening={startListening} stopListening={stopListening}
                        loading={loading} submitAnswer={submitAnswer} wordCount={wordCount}
                        confidencePercent={confidencePercent} answerQuality={answerQuality} qualityClass={qualityClass}
                    />

                    {/* Feedback Box */}
                    {currentFeedback && (
                        <div className='feedback-box'>
                            <h4>AI Feedback</h4>
                            <p>{currentFeedback}</p>
                        </div>
                    )}

                    {/* 4. Completion Summary */}
                    {session?.completed && (
                        <CompletionCard 
                            questionsCompleted={questionsCompleted} totalQuestions={totalQuestions}
                            totalWords={totalWords} timeSpent={timeSpent} completionPercent={completionPercent}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default InterviewSession