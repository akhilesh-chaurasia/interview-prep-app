import React from 'react'

const getMessage = (error) => {
    const status = error?.status ?? error?.response?.status
    if (status === 503) return "The AI service is temporarily overloaded. This usually resolves in a minute."
    const msg = (error?.message ?? error?.toString() ?? "").toLowerCase()
    if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("err_")) return "Network error. Check your connection and try again."
    if (status >= 500) return "The server encountered an error. Please try again."
    if (status === 429) return "Too many requests. Please wait a moment before retrying."
    return "Something went wrong. Please try again."
}

const ErrorCard = ({ error, message, onRetry, retryLabel = "Try Again" }) => (
    <div className='error-card'>
        <span className='error-card__icon'>⚠️</span>
        <h3 className='error-card__title'>Something went wrong</h3>
        <p className='error-card__message'>{message ?? getMessage(error)}</p>
        {onRetry && (
            <button className='error-card__retry' onClick={onRetry}>
                {retryLabel}
            </button>
        )}
    </div>
)

export default ErrorCard