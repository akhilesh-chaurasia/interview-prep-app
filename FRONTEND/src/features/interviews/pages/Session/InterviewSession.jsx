import React, { useState, useEffect, useRef } from 'react'
import "../../style/interviewSession.scss";
import { useParams, useNavigate } from 'react-router'
import { getInterviewSession, submitInterviewAnswer, updateInterviewSessionProgress } from '../../services/interview.api'

import ProgressHeader from './ProgressHeader'
import QuestionNavigator from './QuestionNavigator'
import AnswerContainer from './AnswerContainer'
import CompletionCard from './CompletionCard'
import PerformanceInsights from './PerformanceInsights'
import InterviewReplay from './InterviewReplay'
import ResumeSessionPrompt from './ResumeSessionPrompt'
import ErrorCard from '../../components/ErrorCard'
import LoadingSpinner from '../../../../components/LoadingSpinner'
import NextImprovementCard from './NextImprovementCard'
import QuestionDetailsCard from './QuestionDetailsCard'
import AIHintCard from './AIHintCard'
import AutoSaveStatus from './AutoSaveStatus'
import RecordingStatus from './RecordingStatus'
import AIThinkingLoader from './AIThinkingLoader'

import { useSessionAutoSave } from '../../hooks/useSessionAutoSave'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const InterviewSession = () => {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const [session, setSession] = useState(null)
    const [answer, setAnswer] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [loading, setLoading] = useState(true)
    const [timer, setTimer] = useState(0)
    const [saveMessage, setSaveMessage] = useState("")
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [lastSavedAt, setLastSavedAt] = useState(null)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [recordingStatus, setRecordingStatus] = useState('idle')
    const timerIntervalRef = useRef(null)
    const recognitionRef = useRef(null)
    const speechBaseRef = useRef('')
    const speechFinalRef = useRef('')

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

    const saveDraft = () => {
        if (!sessionId) return
        try {
            setIsAutoSaving(true)
            localStorage.setItem(`prepwise_session_${sessionId}`, JSON.stringify({
                answer,
                timer,
                currentStep: session?.currentStep ?? 0,
                completed: session?.completed ?? false,
                savedAt: new Date().toISOString()
            }))
            setSaveMessage('Draft saved')
            setLastSavedAt(Date.now())
            setTimeout(() => {
                setSaveMessage('')
                setIsAutoSaving(false)
            }, 2200)
        } catch (err) {
            console.log(err)
            setSaveMessage('Unable to save draft')
            setIsAutoSaving(false)
        }
    }

    const handleSaveAndExit = () => {
        saveDraft()
        navigate(-1)
    }

    const downloadReport = () => {
        if (!session) return

        const rubricLabels = {
            clarity: 'Clarity',
            structure: 'Structure',
            depth: 'Depth',
            technicalAccuracy: 'Technical Accuracy',
            communication: 'Communication'
        }

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            font-size: 2.5rem;
            color: #667eea;
            margin-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            margin-top: 5px;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .question-section {
            margin: 40px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 5px solid #667eea;
        }
        .question-title {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .section {
            margin: 25px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .section-title {
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title.answer { color: #667eea; }
        .section-title.feedback { color: #f59e0b; }
        .section-title.ideal { color: #10b981; }
        .section-title.missing { color: #ef4444; }
        .section-title.rubric { color: #8b5cf6; }
        .section-content {
            color: #444;
            line-height: 1.8;
        }
        .missing-list {
            list-style: none;
            padding: 0;
        }
        .missing-list li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }
        .missing-list li::before {
            content: '⚠️';
            position: absolute;
            left: 0;
        }
        .rubric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 10px;
        }
        .rubric-item {
            background: #f0f0ff;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .rubric-label {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 5px;
        }
        .rubric-score {
            font-size: 1.8rem;
            font-weight: bold;
            color: #667eea;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎬 Interview Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${session.track || 'MERN'}</div>
                <div class="stat-label">Track</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${questionsCompleted}/${totalQuestions}</div>
                <div class="stat-label">Questions Answered</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalWords}</div>
                <div class="stat-label">Total Words</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${timeSpent}</div>
                <div class="stat-label">Time Spent</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${completionPercent}%</div>
                <div class="stat-label">Completion</div>
            </div>
        </div>

        ${(session.questions || []).map((q, idx) => `
            <div class="question-section">
                <div class="question-title">
                    <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; margin-right: 12px;">Q${idx + 1}</span>
                    ${q.question || '(question unavailable)'}
                </div>

                ${q.answer ? `
                    <div class="section">
                        <div class="section-title answer">
                            <span>💬</span> Your Answer
                        </div>
                        <div class="section-content">${q.answer.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}

                ${q.feedback ? `
                    <div class="section">
                        <div class="section-title feedback">
                            <span>⭐</span> AI Feedback
                        </div>
                        <div class="section-content">${q.feedback.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}

                ${q.idealAnswer ? `
                    <div class="section">
                        <div class="section-title ideal">
                            <span>🎯</span> Ideal Answer
                        </div>
                        <div class="section-content">${q.idealAnswer.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}

                ${q.missingPoints?.length > 0 ? `
                    <div class="section">
                        <div class="section-title missing">
                            <span>⚠️</span> Missing Points
                        </div>
                        <ul class="missing-list">
                            ${q.missingPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${q.rubric ? `
                    <div class="section">
                        <div class="section-title rubric">
                            <span>📊</span> Rubric Scores
                        </div>
                        <div class="rubric-grid">
                            ${Object.entries(rubricLabels)
                                .filter(([key]) => typeof q.rubric[key] === 'number')
                                .map(([key, label]) => `
                                    <div class="rubric-item">
                                        <div class="rubric-label">${label}</div>
                                        <div class="rubric-score">${q.rubric[key]}/10</div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('')}

        <div class="footer">
            <p>Thank you for using Interview Prep! 🚀</p>
        </div>
    </div>
</body>
</html>
        `.trim()

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `interview-report-${sessionId || 'session'}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setSaveMessage('Report downloaded')
        setTimeout(() => setSaveMessage(''), 2200)
    }

    const applyImprovementTip = () => {
        if (!improvementTip) return

        setAnswer((prev) => {
            const separator = prev.trim() ? '\n\n' : ''
            return `${prev}${separator}${improvementTip}`
        })

        document.getElementById('answer-box')?.focus()
        setSaveMessage('Improvement tip added to editor')
        setTimeout(() => setSaveMessage(''), 2200)
    }

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
    const currentQuestionNumber = (session?.currentStep ?? 0) + 1
    const draftStatus = answer.trim()
        ? wordCount < 30
            ? 'Needs a bit more detail'
            : wordCount < 80
                ? 'Strong draft in progress'
                : 'Detailed and ready to refine'
        : 'Start with your opening line'
    const focusHint = answer.trim() ? 'Keep your answer structured and specific.' : 'Answer with a clear opening, evidence, and result.'

    // Fetch Session Effect
    const fetchSession = async () => {
        try {
            setLoading(true)
            setFetchError(null)
            const data = await getInterviewSession(sessionId)
            const fetchedSession = data.session
            setSession(fetchedSession)

            if (!fetchedSession.completed) {
                const saved = getSaved()
                if (saved) {
                    setPendingSavedData(saved)
                    setShowResumePrompt(true)
                } else {
                    const step = fetchedSession.currentStep ?? 0
                    setAnswer(fetchedSession.questions?.[step]?.answer ?? "")
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
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        speechBaseRef.current = answer
        speechFinalRef.current = ''

        recognition.onresult = (e) => {
            let interim = ''
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const transcript = e.results[i][0].transcript
                if (e.results[i].isFinal) {
                    speechFinalRef.current += transcript
                } else {
                    interim += transcript
                }
            }
            const base = speechBaseRef.current
            const spoken = (speechFinalRef.current + interim).trimStart()
            const separator = base.trim() && spoken
                ? (base.endsWith('\n') ? '\n' : ' ')
                : ''
            setAnswer(base + separator + spoken)
            setRecordingStatus('recording')
        }
        recognition.onerror = () => {
            setIsListening(false)
            setRecordingStatus('idle')
        }
        recognition.onend = () => {
            setIsListening(false)
            setRecordingStatus('processing')
            setTimeout(() => setRecordingStatus('idle'), 900)
        }
        recognitionRef.current = recognition
        recognition.start()
        setIsListening(true)
        setRecordingStatus('listening')
    }

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop()
        setIsListening(false)
        setRecordingStatus('processing')
        setTimeout(() => setRecordingStatus('idle'), 700)
    }

    const submitAnswer = async () => {
        if (!answer.trim()) return
        try {
            setLoading(true)
            setSubmitError(null)
            setRecordingStatus('processing')
            // persist locally before sending
            setSession(prev => {
                if (!prev) return prev
                const idx = prev.currentStep ?? 0
                const questions = (prev.questions || []).map(q => ({ ...q }))
                if (questions[idx]) questions[idx] = { ...questions[idx], answer }
                return { ...prev, questions }
            })

            const data = await submitInterviewAnswer({ sessionId: session._id, answer })
            // server returns authoritative session; replace local session
            setSession(data.session)
            setAnswer("")
        } catch (err) {
            console.log(err)
            setSubmitError(err)
            setRecordingStatus('idle')
        } finally {
            setLoading(false)
            setTimeout(() => setRecordingStatus('idle'), 400)
        }
    }

    // Navigation handlers (Previous / Next)
    const goToPrevious = async () => {
        if (!session) return
        setSubmitError(null)
        setSession(prev => {
            if (!prev) return prev
            const current = prev.currentStep ?? 0
            const questions = (prev.questions || []).map(q => ({ ...q }))
            if (questions[current]) questions[current] = { ...questions[current], answer }

            const newStep = Math.max(0, current - 1)
            const nextAnswer = questions[newStep]?.answer || ""
            setAnswer(nextAnswer)
            const el = document.getElementById('answer-box')
            if (el) {
                el.classList.add('highlight-flash')
                setTimeout(() => el.classList.remove('highlight-flash'), 800)
            }
            try { localStorage.setItem(`prepwise_session_${sessionId}`, JSON.stringify({ answer: nextAnswer, timer, currentStep: newStep, completed: prev.completed ?? false, savedAt: new Date().toISOString() })) } catch (e) {}
            return { ...prev, questions, currentStep: newStep }
        })

        try {
            await updateInterviewSessionProgress({ sessionId, currentStep: Math.max(0, (session.currentStep ?? 0) - 1) })
        } catch (err) {
            console.log(err)
        }
    }

    const goToNext = async () => {
        if (!session) return
        setSubmitError(null)
        setSession(prev => {
            if (!prev) return prev
            const current = prev.currentStep ?? 0
            const questions = (prev.questions || []).map(q => ({ ...q }))
            if (questions[current]) questions[current] = { ...questions[current], answer }

            const maxIndex = (prev.questions?.length ?? 1) - 1
            const newStep = Math.min(maxIndex, current + 1)
            const nextAnswer = questions[newStep]?.answer || ""
            setAnswer(nextAnswer)
            const el = document.getElementById('answer-box')
            if (el) {
                el.classList.add('highlight-flash')
                setTimeout(() => el.classList.remove('highlight-flash'), 800)
            }
            try { localStorage.setItem(`prepwise_session_${sessionId}`, JSON.stringify({ answer: nextAnswer, timer, currentStep: newStep, completed: prev.completed ?? false, savedAt: new Date().toISOString() })) } catch (e) {}
            return { ...prev, questions, currentStep: newStep }
        })

        try {
            await updateInterviewSessionProgress({ sessionId, currentStep: Math.min((session.questions?.length ?? 1) - 1, (session.currentStep ?? 0) + 1) })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Submit: Ctrl+Enter
            if (e.ctrlKey && e.key === 'Enter' && answer.trim() && !loading) {
                e.preventDefault(); submitAnswer()
                return
            }

            // Navigation: Alt+ArrowLeft / Alt+ArrowRight (also support Meta on mac)
            if ((e.altKey || e.metaKey) && e.key === 'ArrowLeft') {
                e.preventDefault(); goToPrevious()
                return
            }

            if ((e.altKey || e.metaKey) && e.key === 'ArrowRight') {
                e.preventDefault(); goToNext()
                return
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [answer, loading, submitAnswer, goToPrevious, goToNext])

    // Resume prompt handlers
    const handleResume = () => {
        if (pendingSavedData) {
            setAnswer(pendingSavedData.answer || "")
            setTimer(pendingSavedData.timer || 0)
            if (pendingSavedData.currentStep != null) {
                setSession((prev) =>
                    prev ? { ...prev, currentStep: pendingSavedData.currentStep } : prev
                )
                updateInterviewSessionProgress({
                    sessionId,
                    currentStep: pendingSavedData.currentStep
                }).catch((err) => console.log(err))
            }
        }
        setShowResumePrompt(false)
        setPendingSavedData(null)
    }

    const handleStartFresh = () => {
        clearSaved()
        if (session) {
            const step = session.currentStep ?? 0
            setAnswer(session.questions?.[step]?.answer ?? "")
        }
        setShowResumePrompt(false)
        setPendingSavedData(null)
    }

    const currentQuestion = session?.questions?.[session.currentStep]?.question
    const currentFeedback = session?.questions?.[session.currentStep - 1]?.feedback

    const parseFeedbackSections = (feedback = "") => {
        const raw = feedback.trim()
        if (!raw) return { strengths: [], fixes: [], examples: [] }

        const sentences = raw
            .split(/\r?\n+|(?<=[.?!])\s+/)
            .map((sentence) => sentence.trim())
            .filter(Boolean)

        const strengths = []
        const fixes = []
        const examples = []

        sentences.forEach((sentence) => {
            const normalized = sentence.toLowerCase()
            if (/strengths?|strong|excellent|clear|confident|positive|well|good/.test(normalized)) {
                strengths.push(sentence)
            } else if (/fix|improv|avoid|need|better|more|clarify|too short|too long|weak|practice|focus/.test(normalized)) {
                fixes.push(sentence)
            } else if (/example|rewrite|try|structure|format|response|answer/.test(normalized)) {
                examples.push(sentence)
            } else if (!fixes.length) {
                fixes.push(sentence)
            } else if (!strengths.length) {
                strengths.push(sentence)
            } else {
                examples.push(sentence)
            }
        })

        if (!examples.length && sentences.length > 1) {
            examples.push(sentences[sentences.length - 1])
        }

        return { strengths, fixes, examples }
    }

    const feedbackSections = parseFeedbackSections(currentFeedback)
    const improvementTip = feedbackSections.fixes[0] || feedbackSections.strengths[0] || 'Try structuring your answer with a short opening, concrete action, and clear result.'

    // Failed to load session — full error view, no blank screen
    if (fetchError && !session) {
        return (
            <div className='interview-page'>
                <div className='interview-container interview-error'>
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

    if (!session) {
        return (
            <div className='interview-page'>
                <div className='interview-container'>
                    <LoadingSpinner size='lg' text='Loading your interview session...' />
                </div>
            </div>
        )
    }

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

            <div className={`interview-container ${session.completed ? 'interview-container--wide' : ''}`}>

                {session.completed ? (
                    /* ── COMPLETED VIEW ─────────────────────────────────── */
                    <>
                        <CompletionCard
                            questionsCompleted={questionsCompleted} totalQuestions={totalQuestions}
                            totalWords={totalWords} timeSpent={timeSpent} completionPercent={completionPercent}
                        />
                        <PerformanceInsights questions={session.questions} />
                        
                        {/* ── COMPLETION CTA SECTION ─────────────────────────────────── */}
                        <div className='completion-cta'>
                            <h3 className='completion-cta__title'>What's Next?</h3>
                            <button 
                                type="button"
                                className='btn btn--primary'
                                aria-label="Download your interview report"
                                onClick={downloadReport}
                            >
                                📥 Download Report
                            </button>
                            <button 
                                type="button"
                                className='btn btn--secondary'
                                aria-label="Start another practice interview"
                                onClick={() => navigate('/')}
                            >
                                🔄 Practice Again
                            </button>
                            <button 
                                type="button"
                                className='btn btn--ghost'
                                aria-label="Return to dashboard"
                                onClick={() => navigate(-1)}
                            >
                                ← Back To Dashboard
                            </button>
                        </div>
                        
                        <InterviewReplay questions={session.questions} />
                    </>
                ) : (
                    /* ── ACTIVE INTERVIEW WORKSPACE ───────────────────────── */
                    <>
                        <div className='session-topbar'>
                            <div className='topbar-left'>
                                <ProgressHeader currentStep={session.currentStep} totalQuestions={totalQuestions} timer={timer} />
                            </div>
                            <div className='topbar-right'>
                                <QuestionNavigator questions={session.questions} currentStep={session.currentStep} />
                            </div>
                        </div>

                        <div className={`session-workspace ${isSidebarCollapsed ? 'session-workspace--sidebar-collapsed' : ''}`}>
                            <section className='workspace-main'>
                                <div className='workspace-card workspace-card--question'>
                                    <div className='workspace-card__label'>Interview Question</div>
                                    <div className='workspace-card__meta'>
                                        <span className='meta-pill meta-pill--primary'>Q{currentQuestionNumber}/{totalQuestions}</span>
                                        <span className='meta-pill'>Focus: {focusHint}</span>
                                        <span className={`meta-pill ${answer.trim() ? 'meta-pill--success' : 'meta-pill--muted'}`}>{draftStatus}</span>
                                    </div>
                                    <h2 className='workspace-card__title'>{currentQuestion}</h2>
                                </div>

                                <div className='workspace-card workspace-card--utility'>
                                    <div className='session-utility-bar'>
                                        <AutoSaveStatus isSaving={isAutoSaving} lastSavedAt={lastSavedAt} />
                                        <RecordingStatus status={recordingStatus} />
                                        <button
                                            type='button'
                                            className='btn btn--ghost sidebar-inline-toggle'
                                            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                                            title={isSidebarCollapsed ? 'Show AI side panel' : 'Hide AI side panel'}
                                        >
                                            {isSidebarCollapsed ? 'Show AI Panel' : 'Hide AI Panel'}
                                        </button>
                                    </div>
                                </div>

                                <div className='workspace-card workspace-card--editor'>
                                    <div className='workspace-card__header'>
                                        <div>
                                            <h3 className='workspace-card__heading'>Answer Editor</h3>
                                            <p className='workspace-card__subtitle'>Speak or type your response and review feedback in real time.</p>
                                        </div>
                                        <span className='workspace-card__badge'>Live AI workspace</span>
                                    </div>

                                    <AnswerContainer
                                        answer={answer}
                                        setAnswer={setAnswer}
                                    />

                                    {submitError && (
                                        <ErrorCard
                                            error={submitError}
                                            message="Failed to submit your answer. Please try again."
                                            onRetry={() => { setSubmitError(null); submitAnswer() }}
                                            retryLabel="Retry Submit"
                                        />
                                    )}

                                    {loading && <AIThinkingLoader />}
                                </div>
                            </section>

                            <aside className={`workspace-sidebar ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
                                <div className='sidebar-panel'>
                                    <div className='sidebar-panel__title-row'>
                                        <div className='sidebar-panel__title'>AI Assistant</div>
                                        <button
                                            type='button'
                                            className='sidebar-collapse-toggle'
                                            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                                            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                        >
                                            {isSidebarCollapsed ? '↗' : '↖'}
                                        </button>
                                    </div>
                                    {currentFeedback && (
                                        <div className='feedback-box'>
                                            <div className='feedback-box__header'>
                                                <h4>AI Feedback</h4>
                                                <span className='feedback-box__hint'>Structured insights for stronger answers</span>
                                            </div>

                                            {feedbackSections.strengths.length > 0 && (
                                                <div className='feedback-section'>
                                                    <h5>Strengths</h5>
                                                    <ul className='feedback-list'>
                                                        {feedbackSections.strengths.map((section, index) => (
                                                            <li key={`strength-${index}`}>{section}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedbackSections.fixes.length > 0 && (
                                                <div className='feedback-section'>
                                                    <h5>Fixes</h5>
                                                    <ul className='feedback-list'>
                                                        {feedbackSections.fixes.map((section, index) => (
                                                            <li key={`fix-${index}`}>{section}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedbackSections.examples.length > 0 && (
                                                <div className='feedback-section'>
                                                    <h5>Example rewrite</h5>
                                                    <p className='feedback-example'>{feedbackSections.examples[0]}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <QuestionDetailsCard
                                        difficulty="Medium"
                                        expectedTime="2–3 Minutes"
                                        idealAnswerLength="150–250 Words"
                                        category="MERN"
                                    />

                                    <NextImprovementCard tip={improvementTip} onApplyTip={applyImprovementTip} />
                                    <AIHintCard />

                                    <div className='sidebar-panel sidebar-panel--metrics'>
                                        <h4 className='sidebar-panel__title'>Session Insights</h4>
                                        <div className='metrics-grid'>
                                            <div className='metric-card metric-card--small'>
                                                <span className='metric-card__label'>Answer Quality</span>
                                                <span className={`quality-status ${qualityClass}`}>{answerQuality}</span>
                                            </div>
                                            <div className='metric-card metric-card--small'>
                                                <span className='metric-card__label'>Confidence</span>
                                                <strong>{confidencePercent}%</strong>
                                            </div>
                                            <div className='metric-card metric-card--small'>
                                                <span className='metric-card__label'>Word Count</span>
                                                <strong>{wordCount}</strong>
                                            </div>
                                            <div className='metric-card metric-card--small'>
                                                <span className='metric-card__label'>Session Time</span>
                                                <strong>{timeSpent}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <div className='action-bar'>
                            <div className='action-bar__status'>
                                <span className='action-bar__status-pill'>{saveMessage || 'Session ready'}</span>
                                <span className='action-bar__shortcut'>Ctrl + Enter</span>
                                <span className='action-bar__caption'>submit instantly</span>
                            </div>
                            <div className='action-bar__actions'>
                                <div className='action-bar__voice-wrap'>
                                    <button
                                        type='button'
                                        className='btn btn--primary btn--strong'
                                        onClick={isListening ? stopListening : startListening}
                                        disabled={loading}
                                        title='Start or stop speech input'
                                    >
                                        {isListening ? 'Stop Speaking' : 'Start Speaking'}
                                    </button>
                                    <RecordingStatus status={recordingStatus} />
                                </div>
                                <button type='button' className='btn btn--ghost' onClick={saveDraft} title='Save your current answer draft'>
                                    Save Draft
                                </button>
                                <button type='button' className='btn btn--ghost' onClick={handleSaveAndExit} title='Save your progress and leave the session'>
                                    Save & Exit
                                </button>
                                <button
                                    type='button'
                                    className='btn btn--ghost'
                                    onClick={goToPrevious}
                                    disabled={(session?.currentStep ?? 0) <= 0}
                                    title='Previous question'
                                >
                                    Previous
                                </button>
                                <button
                                    type='button'
                                    className='btn btn--ghost'
                                    onClick={goToNext}
                                    disabled={(session?.currentStep ?? 0) >= ((session?.questions?.length ?? 1) - 1)}
                                    title='Next question'
                                >
                                    Next Question
                                </button>
                                <button
                                    type='button'
                                    className='btn btn--primary btn--strong'
                                    onClick={submitAnswer}
                                    disabled={loading || !answer.trim()}
                                    title='Submit your answer or press Ctrl + Enter'
                                >
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default InterviewSession