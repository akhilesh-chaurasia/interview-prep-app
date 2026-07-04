import React, { Component } from 'react'
import './ErrorBoundary.scss'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='error-boundary'>
                    <div className='error-boundary__content'>
                        <div className='error-boundary__icon'>⚠️</div>
                        <h2>Oops! Something went wrong</h2>
                        <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
                        <button
                            className='error-boundary__button'
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
