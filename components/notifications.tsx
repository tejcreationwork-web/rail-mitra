import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const clearAll = async () => {
    setNotifications([]);
    await AsyncStorage.setItem('notifications', JSON.stringify([]));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}