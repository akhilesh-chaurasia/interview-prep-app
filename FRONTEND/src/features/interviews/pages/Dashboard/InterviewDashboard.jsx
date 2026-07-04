// InterviewDashboard.jsx - Premium SaaS Design
import React, { useState, useCallback } from 'react'
import '../../style/interviewDashboard.scss'
import { useInterview } from '../../hooks/useInterview.js'
import { startInterviewSession } from '../../services/interview.api'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-hot-toast'
import ErrorCard from '../../components/ErrorCard'

// Premium Components
import DashboardHero from '../../components/DashboardHero'
import StatsGrid from '../../components/StatsGrid'
import QuickActions from '../../components/QuickActions'
import InterviewOverview from '../../components/InterviewOverview'
import RecentActivity from '../../components/RecentActivity'
import AICoachCard from '../../components/AICoachCard'
import NextImprovementCard from '../../components/NextImprovementCard'
import DashboardPreparationCard from '../../components/DashboardPreparationCard'
import DashboardReminderCard from '../../components/DashboardReminderCard'

// Sub-component Import
import TrackModal from './TrackModal'

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const navigate = useNavigate()
    const { interviewId } = useParams()
    
    const [startingInterview, setStartingInterview] = useState(false)
    const [showTrackModal, setShowTrackModal] = useState(false)
    const [overviewTab, setOverviewTab] = useState('technical')
    
    const { report, getReportById, loading, getResumePdf, error, sessions, getSessions } = useInterview(interviewId)

    // Memoized callbacks to prevent unnecessary re-renders
    const startMockInterview = useCallback(async (trackName) => {
        try {
            setStartingInterview(true)
            const data = await startInterviewSession({
                interviewReportId: interviewId,
                track: trackName
            })

            const sessionId = data.session._id
            setShowTrackModal(false)
            toast.success("Interview Session Started! All the best 👍")
            navigate(`/interview/session/${sessionId}`)
        } catch (err) {
            console.log(err)
            toast.error("Failed to start mock interview ❌")
        } finally {
            setStartingInterview(false)
        }
    }, [interviewId, navigate])

    const handleStartInterview = useCallback(() => {
        setShowTrackModal(true)
    }, [])

    const handleViewRoadmap = useCallback(() => {
        setOverviewTab('roadmap')
        const overviewSection = document.getElementById('interview-overview')
        if (overviewSection) {
            overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    const handleViewFullReport = useCallback(() => {
        setOverviewTab('technical')
        const overviewSection = document.getElementById('interview-overview')
        if (overviewSection) {
            overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    const handleReviewSkills = useCallback(() => {
        navigate('/analytics')
    }, [navigate])

    const handleDownloadResume = useCallback(() => {
        getResumePdf(interviewId)
    }, [getResumePdf, interviewId])

    // Note: report + sessions are already fetched automatically by useInterview(interviewId)
    // (see the hook's internal auto-fetch effect). No need to duplicate that here —
    // doing so previously caused a race condition between this effect and the hook's
    // own fetch, which could leave the page stuck on the loading spinner forever.

    // Failed to load report
    if (!loading && !report && error) {
        return (
            <main className='dashboard-page'>
                <div className='dashboard-container' style={{ maxWidth: 600, margin: '4rem auto' }}>
                    <ErrorCard
                        error={error}
                        message="Failed to load your interview plan. Please try again."
                        onRetry={() => getReportById(interviewId)}
                        retryLabel="Reload Plan"
                    />
                </div>
            </main>
        )
    }

    if (loading || !report) {
        return (
            <main className='dashboard-page'>
                <div className='dashboard-loading'>
                    <div className='dashboard-loading__spinner'></div>
                    <p>Loading your interview plan...</p>
                </div>
            </main>
        )
    }

    return (
        <main className='dashboard-page'>
            <div className='dashboard-container'>
                {/* Hero Section */}
                <DashboardHero
                    report={report}
                    onStartInterview={handleStartInterview}
                    onViewFullReport={handleViewFullReport}
                />

                <div className='dashboard-grid dashboard-grid--primary'>
                    <div className='dashboard-grid__column dashboard-grid__column--main'>
                        {/* AI Coach Card */}
                        <AICoachCard
                            report={report}
                            onStartInterview={handleStartInterview}
                            userName={report?.username || 'User'}
                        />

                        {/* Stats Grid */}
                        <StatsGrid report={report} />

                        {/* Quick Actions */}
                        <QuickActions
                            onStartInterview={handleStartInterview}
                            onDownloadResume={handleDownloadResume}
                            onViewRoadmap={handleViewRoadmap}
                            onReviewSkills={handleReviewSkills}
                        />
                    </div>

                    <aside className='dashboard-grid__column dashboard-grid__column--side'>
                        {/* Next Improvement */}
                        <NextImprovementCard
                            report={report}
                            onReviewSkills={handleReviewSkills}
                            onStartInterview={handleStartInterview}
                        />

                        <DashboardPreparationCard
                            report={report}
                            onViewRoadmap={handleViewRoadmap}
                        />

                        <DashboardReminderCard
                            sessions={sessions || []}
                            onStartInterview={handleStartInterview}
                        />
                    </aside>
                </div>

                <div className='dashboard-grid dashboard-grid--secondary'>
                    {/* Recent Activity */}
                    <RecentActivity sessions={sessions || []} />

                    {/* Interview Overview */}
                    <InterviewOverview report={report} activeTab={overviewTab} onTabChange={setOverviewTab} />
                </div>
            </div>

            {/* Track Selection Modal */}
            <TrackModal 
                isOpen={showTrackModal} 
                onClose={() => setShowTrackModal(false)} 
                onSelectTrack={startMockInterview} 
                isStarting={startingInterview} 
            />
        </main>
    )
}

export default Interview;