import React from 'react'
import { useNavigate } from 'react-router'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className='not-found'>
            <div className='not-found__content'>
                <h1 className='not-found__code'>404</h1>
                <h2 className='not-found__title'>Page Not Found</h2>
                <p className='not-found__sub'>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    className='btn btn--primary'
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    )
}

export default NotFound