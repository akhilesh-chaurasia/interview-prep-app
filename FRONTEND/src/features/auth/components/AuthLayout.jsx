import React from 'react';
import { Link } from 'react-router';
import './AuthLayout.scss';

const AuthLayout = ({ children, title, subtitle, showBackLink = false, backLinkText = 'Back to Login', backLinkTo = '/login' }) => {
    return (
        <div className="auth-layout">
            <div className="auth-layout__left">
                <div className="auth-layout__content">
                    <Link to="/" className="auth-layout__logo">
                        <span className="auth-layout__logo-icon">🎯</span>
                        <span className="auth-layout__logo-text">Interview Prep</span>
                    </Link>
                    
                    <h1 className="auth-layout__title">
                        Crack Your Next<br />
                        <span className="auth-layout__title-gradient">Dream Job Interview</span>
                    </h1>
                    
                    <p className="auth-layout__subtitle">
                        AI-powered interview preparation platform that helps you land your dream job with personalized mock interviews and resume analysis.
                    </p>
                    
                    <div className="auth-layout__features">
                        <div className="auth-layout__feature">
                            <div className="auth-layout__feature-icon">🤖</div>
                            <div className="auth-layout__feature-text">
                                <h3>AI Mock Interviews</h3>
                                <p>Practice with AI-generated questions tailored to your role</p>
                            </div>
                        </div>
                        
                        <div className="auth-layout__feature">
                            <div className="auth-layout__feature-icon">📄</div>
                            <div className="auth-layout__feature-text">
                                <h3>Resume Analysis</h3>
                                <p>Get ATS-optimized resume suggestions</p>
                            </div>
                        </div>
                        
                        <div className="auth-layout__feature">
                            <div className="auth-layout__feature-icon">📊</div>
                            <div className="auth-layout__feature-text">
                                <h3>Performance Tracking</h3>
                                <p>Track your progress and improve over time</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="auth-layout__security">
                        <div className="auth-layout__security-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Secure & Private</span>
                        </div>
                        <div className="auth-layout__security-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span>Enterprise Grade</span>
                        </div>
                    </div>
                </div>
                
                <div className="auth-layout__shapes">
                    <div className="auth-layout__shape auth-layout__shape--1"></div>
                    <div className="auth-layout__shape auth-layout__shape--2"></div>
                    <div className="auth-layout__shape auth-layout__shape--3"></div>
                </div>
            </div>
            
            <div className="auth-layout__right">
                <div className="auth-layout__card">
                    {title && (
                        <div className="auth-layout__card-header">
                            <h2 className="auth-layout__card-title">{title}</h2>
                            {subtitle && <p className="auth-layout__card-subtitle">{subtitle}</p>}
                        </div>
                    )}
                    
                    <div className="auth-layout__card-body">
                        {children}
                    </div>
                    
                    {showBackLink && (
                        <div className="auth-layout__card-footer">
                            <Link to={backLinkTo} className="auth-layout__back-link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                {backLinkText}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
