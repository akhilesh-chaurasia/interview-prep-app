import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")

    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {

        const resumeFile = resumeInputRef.current.files[0]

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        } else {
            toast.error("Failed to generate report")
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Generating Your AI Interview Plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* HERO SECTION */}
            <header className='page-header'>

                <div className='hero-glow'></div>

                <div className='hero-badge'>
                    AI Powered Interview Preparation
                </div>

                <h1>
                    Crack Your Next
                    <span className='highlight'> Dream Job Interview</span>
                </h1>

                <p>
                    Generate personalized interview questions,
                    resume analysis, AI feedback, and preparation
                    roadmaps tailored to your target role.
                </p>

            </header>

            {/* FEATURE CARDS */}
            <section className='feature-grid'>

                <div className='feature-card'>
                    <div className='feature-icon'>🎯</div>
                    <h3>AI Mock Interviews</h3>
                    <p>
                        Practice real interview questions with
                        intelligent AI-generated feedback.
                    </p>
                </div>

                <div className='feature-card'>
                    <div className='feature-icon'>📄</div>
                    <h3>Resume Analysis</h3>
                    <p>
                        Match your resume against job descriptions
                        and identify skill gaps instantly.
                    </p>
                </div>

                <div className='feature-card'>
                    <div className='feature-icon'>🚀</div>
                    <h3>Preparation Roadmaps</h3>
                    <p>
                        Get personalized preparation plans to improve
                        your interview performance.
                    </p>
                </div>

            </section>

            {/* MAIN CARD */}
            <div className='interview-card'>

                <div className='interview-card__body'>

                    {/* LEFT PANEL */}
                    <div className='panel panel--left'>

                        <div className='panel__header'>

                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>

                            <h2>Target Job Description</h2>

                            <span className='badge badge--required'>
                                Required
                            </span>

                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...

Example:
"Frontend Engineer with experience in React, TypeScript, REST APIs, and responsive UI development..."`}
                            maxLength={5000}
                        />

                        <div className='char-counter'>
                            {jobDescription.length} / 5000 chars
                        </div>

                    </div>

                    {/* DIVIDER */}
                    <div className='panel-divider' />

                    {/* RIGHT PANEL */}
                    <div className='panel panel--right'>

                        <div className='panel__header'>

                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>

                            <h2>Your Profile</h2>

                        </div>

                        {/* RESUME UPLOAD */}
                        <div className='upload-section'>

                            <label className='section-label'>

                                Upload Resume

                                <span className='badge badge--best'>
                                    Best Results
                                </span>

                            </label>

                            <label className='dropzone' htmlFor='resume'>

                                <span className='dropzone__icon'>
                                    📤
                                </span>

                                <p className='dropzone__title'>
                                    Click to upload or drag & drop
                                </p>

                                <p className='dropzone__subtitle'>
                                    PDF or DOCX (Max 5MB)
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                />

                            </label>

                        </div>

                        {/* OR DIVIDER */}
                        <div className='or-divider'>
                            <span>OR</span>
                        </div>

                        {/* SELF DESCRIPTION */}
                        <div className='self-description'>

                            <label
                                className='section-label'
                                htmlFor='selfDescription'
                            >
                                Quick Self Description
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder='Describe your experience, skills, projects, and strengths...'
                            />

                        </div>

                        {/* INFO BOX */}
                        <div className='info-box'>

                            <span className='info-box__icon'>
                                ℹ️
                            </span>

                            <p>
                                Either a <strong>Resume</strong> or a
                                <strong> Self Description</strong> is required
                                to generate your personalized interview plan.
                            </p>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}
                <div className='interview-card__footer'>

                    <span className='footer-info'>
                        AI-Powered Strategy Generation • Approx 30 Seconds
                    </span>

                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                    >
                        ✨ Generate AI Interview Plan
                    </button>

                </div>

            </div>

            {/* RECENT REPORTS */}
            {reports.length > 0 && (

                <section className='recent-reports'>

                    <h2>Recent Interview Plans</h2>

                    <ul className='reports-list'>

                        {reports.map(report => (

                            <li
                                key={report._id}
                                className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >

                                <h3>
                                    {report.title || 'Untitled Position'}
                                </h3>

                                <p className='report-meta'>
                                    Generated on{" "}
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </p>

                                <p className={`match-score ${
                                    report.matchScore >= 80
                                        ? 'score--high'
                                        : report.matchScore >= 60
                                            ? 'score--mid'
                                            : 'score--low'
                                }`}>
                                    Match Score: {report.matchScore}%
                                </p>

                            </li>

                        ))}

                    </ul>

                </section>

            )}

            {/* FOOTER */}
            <footer className='page-footer'>

                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>

            </footer>

        </div>
    )
}

export default Home