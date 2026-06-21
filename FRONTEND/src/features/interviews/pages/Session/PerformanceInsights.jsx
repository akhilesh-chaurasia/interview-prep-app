import React from 'react'

const RUBRIC_META = {
    clarity:            { label: 'Clarity',            icon: '💡' },
    structure:          { label: 'Structure',          icon: '🧩' },
    depth:              { label: 'Depth',               icon: '🔍' },
    technicalAccuracy:  { label: 'Technical Accuracy',  icon: '⚙️' },
    communication:      { label: 'Communication',       icon: '🗣️' },
}

const RUBRIC_KEYS = Object.keys(RUBRIC_META)

const PerformanceInsights = ({ questions }) => {
    if (!Array.isArray(questions) || questions.length === 0) return null

    // Collect only questions that actually have a usable rubric object
    const rubricSets = questions
        .map(q => q?.rubric)
        .filter(r => r && typeof r === 'object')

    if (rubricSets.length === 0) return null

    // Average each metric across all available rubrics, skipping missing/non-numeric values per metric
    const averages = {}
    RUBRIC_KEYS.forEach(key => {
        const values = rubricSets
            .map(r => r[key])
            .filter(v => typeof v === 'number' && !Number.isNaN(v))

        averages[key] = values.length
            ? values.reduce((sum, v) => sum + v, 0) / values.length
            : null
    })

    const validAverages = RUBRIC_KEYS
        .map(key => ({ key, value: averages[key] }))
        .filter(a => a.value !== null)

    if (validAverages.length === 0) return null

    // Overall score: mean of the 5 metric averages, scaled from /10 to /100
    const meanOfAverages = validAverages.reduce((sum, a) => sum + a.value, 0) / validAverages.length
    const overallScore = Math.round(meanOfAverages * 10)

    // Rank metrics high to low
    const ranked = [...validAverages].sort((a, b) => b.value - a.value)

    const strengths = ranked.slice(0, 2)
    const improvements = ranked.slice(-2).reverse()

    const scoreColor = overallScore >= 80 ? '#3fb950' : overallScore >= 60 ? '#f5a623' : '#ff6b6b'
    const scoreLabel = overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'

    return (
        <div className='insights-card'>
            <div className='insights-card__header'>
                <span className='insights-card__title'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24'
                        fill='none' stroke='currentColor' strokeWidth='2'
                        strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                        <path d='M3 3v18h18' />
                        <path d='M18.7 8l-5.1 5.1-2.8-2.8L7 14' />
                    </svg>
                    Performance Insights
                </span>
            </div>

            <div className='insights-grid'>

                {/* Overall Score */}
                <div className='insight-block insight-block--score'>
                    <span className='insight-block__label'>Overall Interview Score</span>
                    <div className='score-ring-row'>
                        <div className='score-ring'>
                            <svg viewBox='0 0 120 120' className='score-ring__svg'>
                                <circle
                                    className='score-ring__track'
                                    cx='60' cy='60' r='52'
                                    fill='none' strokeWidth='10'
                                />
                                <circle
                                    className='score-ring__fill'
                                    cx='60' cy='60' r='52'
                                    fill='none' strokeWidth='10'
                                    strokeLinecap='round'
                                    style={{
                                        stroke: scoreColor,
                                        strokeDasharray: 2 * Math.PI * 52,
                                        strokeDashoffset: 2 * Math.PI * 52 * (1 - overallScore / 100),
                                    }}
                                />
                            </svg>
                            <div className='score-ring__center'>
                                <span className='score-ring__value' style={{ color: scoreColor }}>
                                    {overallScore}%
                                </span>
                                <span className='score-ring__sub'>Score</span>
                            </div>
                        </div>
                        <div className='score-ring__details'>
                            <div className='insight-score'>
                                <span className='insight-score__value' style={{ color: scoreColor }}>
                                    {overallScore}
                                </span>
                                <span className='insight-score__max'>/ 100</span>
                            </div>
                            <span className='insight-score__tag' style={{ color: scoreColor, borderColor: scoreColor + '40', background: scoreColor + '14' }}>
                                {scoreLabel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Strengths */}
                <div className='insight-block'>
                    <span className='insight-block__label'>Top Strengths</span>
                    <ul className='insight-list'>
                        {strengths.map(({ key, value }) => (
                            <li key={key} className='insight-list__item insight-list__item--positive'>
                                <span className='insight-list__icon'>{RUBRIC_META[key].icon}</span>
                                <span className='insight-list__text'>{RUBRIC_META[key].label}</span>
                                <span className='insight-list__score'>{value.toFixed(1)}/10</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Areas To Improve */}
                <div className='insight-block'>
                    <span className='insight-block__label'>Areas To Improve</span>
                    <ul className='insight-list'>
                        {improvements.map(({ key, value }) => (
                            <li key={key} className='insight-list__item insight-list__item--negative'>
                                <span className='insight-list__icon'>{RUBRIC_META[key].icon}</span>
                                <span className='insight-list__text'>{RUBRIC_META[key].label}</span>
                                <span className='insight-list__score'>{value.toFixed(1)}/10</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default PerformanceInsights