import React from 'react'
import { useNotifications } from '../features/notifications/notifications.context'
import './NotificationCenter.scss'

const NotificationCenter = () => {
  const { 
    notifications, 
    isCenterOpen, 
    setIsCenterOpen, 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications()

  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now - new Date(date)
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  return (
    <div className='notification-center-container'>
      {isCenterOpen && (
        <div className='notification-center'>
          <div className='notification-center__header'>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className='notification-center__clear-btn'
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          <div className='notification-center__list'>
            {notifications.length === 0 ? (
              <div className='notification-center__empty'>
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'notification-item--read' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className='notification-item__icon'>
                    {notification.type === 'success' ? '✅' : 
                     notification.type === 'error' ? '❌' : 
                     notification.type === 'info' ? 'ℹ️' : '📢'}
                  </div>
                  <div className='notification-item__content'>
                    <p className='notification-item__title'>{notification.title}</p>
                    <p className='notification-item__message'>{notification.message}</p>
                    <span className='notification-item__time'>{formatTime(notification.timestamp)}</span>
                  </div>
                  <button 
                    className='notification-item__delete-btn'
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
