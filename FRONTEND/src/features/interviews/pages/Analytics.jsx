import React, { useEffect, useMemo } from 'react'
import { useInterview } from '../hooks/useInterview'
import './style/analytics.scss'

const Analytics = () => {
  const { sessions, getSessions, loading } = useInterview()

  useEffect(() => {
    getSessions()
  }, [])

  const analytics = useMemo(() => {
    // Filter completed sessions only
    const completedSessions = sessions.filter(s => s.completed)

    // Calculate total interviews
    const totalInterviews = completedSessions.length

    // Calculate average score
    let totalScore = 0
    let scoresByDate = []
    let topicScores = {}

    completedSessions.forEach(session => {
      let sessionScore = 0
      let questionCount = 0

      session.questions.forEach(q => {
        if (q.rubric) {
          const { clarity, structure, depth, technicalAccuracy, communication } = q.rubric
          const qScore = (clarity + structure + depth + technicalAccuracy + communication) / 5
          sessionScore += qScore
          questionCount++
        }
      })

      if (questionCount > 0) {
        const avgSessionScore = Math.round(sessionScore / questionCount)
        totalScore += avgSessionScore

        // Add to scores by date
        scoresByDate.push({
          date: new Date(session.createdAt).toLocaleDateString(),
          score: avgSessionScore
        })

        // Add to topic scores
        const topic = session.track
        if (!topicScores[topic]) {
          topicScores[topic] = { total: 0, count: 0 }
        }
        topicScores[topic].total += avgSessionScore
        topicScores[topic].count++
      }
    })

    const avgScore = totalInterviews > 0 ? Math.round(totalScore / totalInterviews) : 0

    // Calculate streak (simple version: consecutive days with interviews)
    const uniqueDates = [...new Set(completedSessions.map(s => 
      new Date(s.createdAt).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a))

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0,0,0,0)

    for (let dateStr of uniqueDates) {
      const date = new Date(dateStr)
      date.setHours(0,0,0,0)
      
      const diffDays = Math.round((currentDate - date) / (1000*60*60*24))
      
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }

    // Prepare topic-wise average scores
    const topicWiseScores = Object.keys(topicScores).map(topic => ({
      topic,
      avgScore: Math.round(topicScores[topic].total / topicScores[topic].count)
    }))

    const weakestTopic = topicWiseScores.length > 0
      ? topicWiseScores.reduce((weakest, current) => current.avgScore < weakest.avgScore ? current : weakest, topicWiseScores[0])
      : null

    const nextImprovement = weakestTopic
      ? `Focus on ${weakestTopic.topic} and review the concepts that lower your score.`
      : 'Complete your first mock interview to generate actionable improvement insights.'

    return {
      totalInterviews,
      avgScore,
      streak,
      topicWiseScores,
      scoresByDate,
      weakestTopic,
      nextImprovement
    }
  }, [sessions])

  const handleReviewWeakTopic = () => {
    const section = document.getElementById('topic-performance')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return <div className="analytics-page loading-screen"><h1>Loading Analytics...</h1></div>
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>📊 Your Interview Performance</h1>
        <p>Track your progress and improve over time</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{analytics.totalInterviews}</div>
          <div className="stat-label">Total Mock Interviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{analytics.avgScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{analytics.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <section className="analytics-section analytics-highlight">
        <h2>💡 Next Improvement</h2>
        <p>{analytics.nextImprovement}</p>
        {analytics.weakestTopic && (
          <>
            <div className="analytics-highlight__badge">
              Lowest Score: {analytics.weakestTopic.topic} ({analytics.weakestTopic.avgScore}%)
            </div>
            <button className="analytics-highlight__button" onClick={handleReviewWeakTopic}>
              Review {analytics.weakestTopic.topic} Performance
            </button>
          </>
        )}
      </section>

      {/* Topic-wise Performance */}
      <section className="analytics-section" id="topic-performance">
        <h2>📚 Topic-wise Performance</h2>
        <div className="topic-list">
          {analytics.topicWiseScores.length > 0 ? (
            analytics.topicWiseScores.map(({ topic, avgScore }) => (
              <div key={topic} className="topic-item">
                <div className="topic-name">{topic}</div>
                <div className="topic-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${Math.min(avgScore, 100)}%` }}
                    />
                  </div>
                  <span className="score-text">{avgScore}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No data yet! Complete an interview to see your performance!</div>
          )}
        </div>
      </section>

      {/* Interview History */}
      <section className="analytics-section">
        <h2>📋 Interview History</h2>
        <div className="history-list">
          {sessions.filter(s => s.completed).length > 0 ? (
            sessions.filter(s => s.completed).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(session => {
              let sessionScore = 0
              let qCount = 0
              session.questions.forEach(q => {
                if(q.rubric) {
                  const { clarity, structure, depth, technicalAccuracy, communication } = q.rubric
                  sessionScore += (clarity + structure + depth + technicalAccuracy + communication)/5
                  qCount++
                }
              })
              const avg = qCount >0 ? Math.round(sessionScore/qCount) : 0
              
              return (
                <div key={session._id} className="history-item">
                  <div className="history-main">
                    <div className="history-topic">{session.track}</div>
                    <div className="history-date">
                      {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="history-score">{avg}%</div>
                </div>
              )
            })
          ) : (
            <div className="empty-state">No completed interviews yet!</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Analytics
