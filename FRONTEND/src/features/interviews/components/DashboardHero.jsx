import React, { memo, useMemo } from 'react';
import './DashboardHero.scss';

// Static icons to prevent re-creation on every render
const Icons = {
    badge: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
        </svg>
    ),
    play: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    ),
    report: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    )
};

const DashboardHero = ({ report, onStartInterview, onViewFullReport }) => {
    // Memoize computed values to prevent unnecessary recalculations
    const { matchScore, scoreColor, highGaps, mediumGaps, lowGaps, placementReadiness, atsScore, readinessLabel, readinessTier } = useMemo(() => {
        const matchScore = report?.matchScore ?? 0;
        const scoreColor = matchScore >= 80 ? 'score-emerald' : matchScore >= 60 ? 'score-amber' : 'score-red';
        const skillGaps = report?.skillGaps || [];
        const highGaps = skillGaps.filter((gap) => gap.severity === 'high').length;
        const mediumGaps = skillGaps.filter((gap) => gap.severity === 'medium').length;
        const lowGaps = skillGaps.filter((gap) => gap.severity === 'low').length;

        const placementReadiness = Math.max(
            30,
            Math.min(100, Math.round(matchScore - highGaps * 8 - mediumGaps * 4 - lowGaps * 2))
        );

        const atsScore = Math.max(
            30,
            Math.min(100, Math.round(matchScore - highGaps * 5 - mediumGaps * 2))
        );

        const readinessLabel = placementReadiness >= 80 ? 'Strong' : placementReadiness >= 60 ? 'Growing' : 'Needs Focus';
        const readinessTier = readinessLabel.toLowerCase().replace(' ', '-');

        return { matchScore, scoreColor, highGaps, mediumGaps, lowGaps, placementReadiness, atsScore, readinessLabel, readinessTier };
    }, [report]);

    // Memoize derived values
    const questionCounts = useMemo(() => ({
        technical: report?.technicalQuestions?.length || 0,
        behavioral: report?.behavioralQuestions?.length || 0,
        preparation: report?.preparationPlan?.length || 0
    }), [report]);

    return (
        <div className="dashboard-hero">
            <div className="dashboard-hero__background">
                <div className="dashboard-hero__gradient dashboard-hero__gradient--1"></div>
                <div className="dashboard-hero__gradient dashboard-hero__gradient--2"></div>
                <div className="dashboard-hero__gradient dashboard-hero__gradient--3"></div>
            </div>
            
            <div className="dashboard-hero__content">
                <div className="dashboard-hero__main">
                    <div className="dashboard-hero__badge">
                        {Icons.badge}
                        <span>AI-Powered Interview Prep</span>
                    </div>
                    
                    <h1 className="dashboard-hero__title">
                        Your Interview Plan is Ready
                    </h1>
                    
                    <p className="dashboard-hero__subtitle">
                        Based on your resume analysis, we've generated a personalized interview strategy with {questionCounts.technical} technical questions, {questionCounts.behavioral} behavioral questions, and a {questionCounts.preparation}-day preparation roadmap.
                    </p>
                    
                    <div className="dashboard-hero__actions">
                        <button className="dashboard-hero__cta dashboard-hero__cta--primary" onClick={onStartInterview}>
                            {Icons.play}
                            Start Mock Interview
                        </button>
                        <button className="dashboard-hero__cta dashboard-hero__cta--secondary" onClick={onViewFullReport}>
                            {Icons.report}
                            View Full Report
                        </button>
                    </div>
                </div>
                
                <div className="dashboard-hero__score">
                    <div className="dashboard-hero__score-ring">
                        <svg viewBox="0 0 120 120" className="dashboard-hero__score-svg">
                            <circle className="dashboard-hero__score-track" cx="60" cy="60" r="52" />
                            <circle
                                className={`dashboard-hero__score-arc dashboard-hero__score-arc--${scoreColor}`}
                                cx="60" cy="60" r="52"
                                style={{
                                    strokeDasharray: 2 * Math.PI * 52,
                                    strokeDashoffset: 2 * Math.PI * 52 * (1 - matchScore / 100)
                                }}
                            />
                        </svg>
                        <div className="dashboard-hero__score-center">
                            <span className={`dashboard-hero__score-value dashboard-hero__score-value--${scoreColor}`}>{matchScore}</span>
                            <span className="dashboard-hero__score-pct">%</span>
                        </div>
                    </div>
                    <p className="dashboard-hero__score-label">Match Score</p>
                    <div className="dashboard-hero__score-summary">
                        <div className="dashboard-hero__summary-item dashboard-hero__summary-item--placement">
                            <div className="dashboard-hero__summary-row">
                                <span className="dashboard-hero__summary-label">Placement Readiness</span>
                                <strong className="dashboard-hero__summary-value">{placementReadiness}%</strong>
                            </div>
                            <div className={`dashboard-hero__progress-bar dashboard-hero__progress-bar--${readinessTier}`}>
                                <div className="dashboard-hero__progress-fill" style={{ width: `${placementReadiness}%` }} />
                            </div>
                            <span className="dashboard-hero__summary-tag">{readinessLabel}</span>
                        </div>
                        <div className="dashboard-hero__summary-item dashboard-hero__summary-item--ats">
                            <div className="dashboard-hero__summary-row">
                                <span className="dashboard-hero__summary-label">ATS Score</span>
                                <strong className="dashboard-hero__summary-value">{atsScore}%</strong>
                            </div>
                            <span className="dashboard-hero__summary-tag">Gap-aware</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DashboardHero);
