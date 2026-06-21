import React from 'react'

const RUBRIC_LABELS = [
    { key: 'clarity',           label: 'Clarity',            color: '#7ecfff' },
    { key: 'structure',         label: 'Structure',          color: '#b89cff' },
    { key: 'depth',             label: 'Depth',              color: '#3fb950' },
    { key: 'technicalAccuracy', label: 'Technical Accuracy', color: '#ff6eb0' },
    { key: 'communication',     label: 'Communication',      color: '#f5a623' },
]

const RubricBreakdown = ({ rubric }) => {
    if (!rubric || typeof rubric !== 'object') return null

    const scores = RUBRIC_LABELS.map(item => ({
        ...item,
        score: typeof rubric[item.key] === 'number' ? rubric[item.key] : null
    }))

    const validScores = scores.filter(s => s.score !== null)
    const average = validScores.length
        ? (validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length).toFixed(1)
        : null

    const avgColor = average >= 7 ? '#3fb950' : average >= 5 ? '#f5a623' : '#ff6b6b'

    return (
        <div className='rubric-card'>
            <div className='rubric-card__header'>
                <span className='rubric-card__title'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'
                        fill='none' stroke='currentColor' strokeWidth='2'
                        strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                        <polyline points='22 4 12 14.01 9 11.01' />
                    </svg>
                    Rubric Breakdown
                </span>
                {average !== null && (
                    <span className='rubric-card__avg' style={{ color: avgColor }}>
                        Avg {average} / 10
                    </span>
                )}
            </div>

            <div className='rubric-scores'>
                {scores.map(({ key, label, color, score }) => (
                    <div key={key} className='rubric-row'>
                        <span className='rubric-row__label'>{label}</span>
                        <div className='rubric-row__bar-wrap'>
                            <div className='rubric-row__bar'>
                                <div
                                    className='rubric-row__fill'
                                    style={{
                                        width: score !== null ? `${score * 10}%` : '0%',
                                        background: color,
                                    }}
                                />
                            </div>
                        </div>
                        <span className='rubric-row__score' style={{ color: score !== null ? color : 'var(--text-muted, #8b949e)' }}>
                            {score !== null ? `${score}/10` : '—'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RubricBreakdown