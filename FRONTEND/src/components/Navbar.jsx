import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useTheme } from '../features/theme/theme.context.jsx'
import { useNotifications } from '../features/notifications/notifications.context.jsx'
import toast from 'react-hot-toast'
import NotificationCenter from './NotificationCenter'
import './Navbar.scss'
import './NotificationCenter.scss'

const Navbar = () => {
    const { user, setUser } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { isCenterOpen, setIsCenterOpen, unreadCount, addNotification } = useNotifications()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            const { logout } = await import('../features/auth/services/auth.api')
            await logout()
            setUser(null)
            toast.success('Logged out successfully!')
            navigate('/login')
        } catch (err) {
            console.error('Logout error:', err)
            toast.error('Failed to log out')
            // Force logout even if API fails
            setUser(null)
            navigate('/login')
        }
    }

    // Don't show navbar on login/register pages
    if (['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].includes(location.pathname)) {
        return null
    }

    return (
        <nav className='navbar'>
            <div className='navbar__container'>
                <NavLink to='/' className='navbar__logo'>
                    🎯 Interview Prep
                </NavLink>
                <div className='navbar__links'>
                    <NavLink to='/' className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                        Home
                    </NavLink>
                    {user && (
                        <>
                            <NavLink to='/sessions' className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                                My Sessions
                            </NavLink>
                            <NavLink to='/analytics' className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                                Analytics
                            </NavLink>
                            <NavLink to='/collaborative' className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                                Collaborative
                            </NavLink>
                            {user.role === 'admin' && (
                                <NavLink to='/admin' className={({ isActive }) => `navbar__link navbar__link--admin ${isActive ? 'navbar__link--active' : ''}`}>
                                    Admin Panel
                                </NavLink>
                            )}
                            <span className='navbar__user'>
                                Hi, {user.username}
                            </span>
                            <div className='notification-center-container'>
                                <button
                                    onClick={() => setIsCenterOpen(!isCenterOpen)}
                                    className='navbar__link navbar__link--notification'
                                >
                                    🔔
                                    {unreadCount > 0 && (
                                        <span className='navbar__notification-badge'>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <NotificationCenter />
                            </div>
                            <button
                                onClick={toggleTheme}
                                className='navbar__link navbar__link--theme'
                            >
                                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className='navbar__link navbar__link--logout'
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
