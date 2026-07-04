import React, { useMemo, memo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import './DashboardReminderCard.scss'

// Helper function outside component to prevent re-creation
const getSessionProgress = (session) => {
  const steps = session?.questions?.length || 0
  const completed = session?.currentStep || 0
  return steps ? Math.round((completed / steps) * 100) : 0
}

const DashboardReminderCard = ({ sessions = [], onStartInterview }) => {
  const navigate = useNavigate()

  // Memoize derived values
  const { pendingSessions, nextSession, progress } = useMemo(() => {
    const pending = sessions.filter((session) => !session.completed)
    const next = pending.length > 0
      ? [...pending].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]
      : null
    
    return {
      pendingSessions: pending,
      nextSession: next,
      progress: next ? getSessionProgress(next) : 0
    }
  }, [sessions])

  const handleResume = useCallback(() => {
    if (nextSession?._id) {
      navigate(`/interview/session/${nextSession._id}`)
    }
  }, [nextSession, navigate])

  const handleStart = useCallback(() => {
    onStartInterview?.()
  }, [onStartInterview])

  return (
    <div className="dashboard-reminder-card">
      <div className="dashboard-reminder-card__header">
        <div>
          <p className="dashboard-reminder-card__eyebrow">Action Reminder</p>
          <h2 className="dashboard-reminder-card__title">Keep your momentum going</h2>
        </div>
        <span className="dashboard-reminder-card__tag">
          {pendingSessions.length > 0 ? `${pendingSessions.length} pending` : 'On track'}
        </span>
      </div>

      {nextSession ? (
        <div className="dashboard-reminder-card__body">
          <div className="dashboard-reminder-card__section">
            <span className="dashboard-reminder-card__label">Resume interview</span>
            <p className="dashboard-reminder-card__value">{nextSession.track || 'Interview'} track session</p>
          </div>
          <div className="dashboard-reminder-card__section">
            <span className="dashboard-reminder-card__label">Progress</span>
            <div className="dashboard-reminder-card__progress">
              <div
                className="dashboard-reminder-card__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="dashboard-reminder-card__small">{progress}% completed</p>
          </div>
        </div>
      ) : (
        <div className="dashboard-reminder-card__body dashboard-reminder-card__body--empty">
          <p className="dashboard-reminder-card__empty-title">No pending sessions yet</p>
          <p className="dashboard-reminder-card__empty-text">Start a mock interview to create study momentum and gather actionable performance insights.</p>
        </div>
      )}

      <div className="dashboard-reminder-card__actions">
        {nextSession ? (
          <button className="dashboard-reminder-card__button" onClick={handleResume}>
            Resume Session
          </button>
        ) : (
          <button className="dashboard-reminder-card__button" onClick={handleStart}>
            Start First Interview
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(DashboardReminderCard)
