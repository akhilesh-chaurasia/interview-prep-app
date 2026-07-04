import React from 'react'
import './LoadingSpinner.scss'

const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizeClasses = {
        sm: 'loading-spinner--sm',
        md: 'loading-spinner--md',
        lg: 'loading-spinner--lg'
    }

    return (
        <div className='loading-spinner-container'>
            <div className={`loading-spinner ${sizeClasses[size]}`}>
                <div className='loading-spinner__circle'></div>
            </div>
            {text && <p className='loading-spinner__text'>{text}</p>}
        </div>
    )
}

export default LoadingSpinner
