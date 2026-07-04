import React, { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(), // Unique ID using timestamp
      timestamp: new Date(),
      ...notification
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isCenterOpen,
        setIsCenterOpen,
        addNotification,
        markAsRead,
        deleteNotification,
        clearAllNotifications,
        unreadCount
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook for easy access
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
};
