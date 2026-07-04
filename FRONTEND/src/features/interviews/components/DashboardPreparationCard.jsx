import React, { useMemo, memo, useCallback } from 'react'
import './DashboardPreparationCard.scss'

const DashboardPreparationCard = ({ report = {}, onViewRoadmap }) => {
  // Memoize derived values
  const { nextPlan, totalDays, nextTasks } = useMemo(() => {
    const preparationPlan = report?.preparationPlan || []
    const nextPlan = preparationPlan[0]
    const totalDays = preparationPlan.length
    const nextTasks = nextPlan?.tasks?.length ? nextPlan.tasks.slice(0, 3) : []
    
    return { nextPlan, totalDays, nextTasks }
  }, [report])

  const handleClick = useCallback(() => {
    onViewRoadmap?.()
  }, [onViewRoadmap])

  return (
    <div className="dashboard-preparation-card">
      <div className="dashboard-preparation-card__header">
        <div>
          <p className="dashboard-preparation-card__eyebrow">Preparation Snapshot</p>
          <h2 className="dashboard-preparation-card__title">Next task in your plan</h2>
        </div>
        <span className="dashboard-preparation-card__tag">{totalDays} Day Plan</span>
      </div>

      {nextPlan ? (
        <div className="dashboard-preparation-card__body">
          <div className="dashboard-preparation-card__section">
            <span className="dashboard-preparation-card__section-label">Day {nextPlan.day} focus</span>
            <p className="dashboard-preparation-card__section-value">{nextPlan.focus}</p>
          </div>

          <div className="dashboard-preparation-card__section">
            <span className="dashboard-preparation-card__section-label">Top tasks</span>
            <ul className="dashboard-preparation-card__tasks">
              {nextTasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="dashboard-preparation-card__empty">
          <p>No preparation plan found yet.</p>
          <p>Generate or review your roadmap to start a focused study path.</p>
        </div>
      )}

      <button className="dashboard-preparation-card__button" onClick={handleClick}>
        View Full Roadmap
      </button>
    </div>
  )
}

export default memo(DashboardPreparationCard)
