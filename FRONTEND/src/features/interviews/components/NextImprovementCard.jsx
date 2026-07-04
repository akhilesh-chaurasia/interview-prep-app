import React, { useMemo } from 'react'
import './NextImprovementCard.scss'

const severityWeight = {
  high: 3,
  medium: 2,
  low: 1
}

const NextImprovementCard = ({ report = {}, onReviewSkills, onStartInterview }) => {
  const skillGaps = report.skillGaps || []

  const topGap = useMemo(() => {
    if (!skillGaps.length) return null
    return [...skillGaps].sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0))[0]
  }, [skillGaps])

  const nextImprovementText = topGap
    ? `Focus on ${topGap.skill}. Review core concepts and practice targeted questions to improve this weakness.`
    : 'Start a mock interview to get the first actionable improvement insight for your preparation.'

  const badgeText = topGap ? `${topGap.severity || 'medium'} gap` : 'Ready to begin'
  const badgeClass = topGap ? topGap.severity : 'ready'
  const actionLabel = topGap ? 'Review Weak Topic' : 'Start Interview'
  const actionHandler = topGap ? onReviewSkills : onStartInterview

  return (
    <div className="next-improvement-card">
      <div className="next-improvement-card__head">
        <div>
          <p className="next-improvement-card__eyebrow">Next Improvement</p>
          <h2 className="next-improvement-card__title">What should you improve next?</h2>
        </div>
        <span className={`next-improvement-card__badge next-improvement-card__badge--${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <p className="next-improvement-card__message">{nextImprovementText}</p>

      {topGap && (
        <div className="next-improvement-card__details">
          <div>
            <p className="next-improvement-card__detail-label">Weakest Skill</p>
            <p className="next-improvement-card__detail-value">{topGap.skill}</p>
          </div>
          <div>
            <p className="next-improvement-card__detail-label">Gap Level</p>
            <p className="next-improvement-card__detail-value">{topGap.severity}</p>
          </div>
        </div>
      )}

      <div className="next-improvement-card__footer">
        <button className="next-improvement-card__button" onClick={actionHandler}>
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

export default NextImprovementCard
