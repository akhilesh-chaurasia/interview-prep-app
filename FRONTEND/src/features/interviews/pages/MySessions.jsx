import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import '../style/interviewDashboard.scss'
import './style/MySessions.scss'

const MySessions = () => {
  const navigate = useNavigate()
  const { sessions, getSessions, loading } = useInterview()

  const fetchSessions = useCallback(() => {
    getSessions(true) // Force refresh
  }, [getSessions])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  if (loading) {
    return (
      <div className="my-sessions-loading">
        <h2>Loading your sessions...</h2>
      </div>
    )
  }

  return (
    <div className="interview-page">
      <div className="interview-container my-sessions-container">
        <div className="my-sessions-header">
          <h1>My Mock Interviews</h1>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="my-sessions-empty">
            <h3>No sessions yet</h3>
            <p>Start a mock interview to practice!</p>
          </div>
        ) : (
          <div className="my-sessions-list">
            {sessions.map(session => (
              <div
                key={session._id}
                onClick={() => navigate(`/interview/session/${session._id}`)}
                className="my-session-card"
              >
                <div className="my-session-card__header">
                  <h3>
                    {session.track ? `${session.track} Track` : 'Interview'}
                  </h3>
                  <span className={`my-session-card__status ${session.completed ? 'completed' : 'in-progress'}`}>
                    {session.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <p className="my-session-card__details">
                  {session.questions.length} Question{session.questions.length !== 1 ? 's' : ''} • {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MySessions
