import React, { useState, useEffect, useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

let notificationListeners: Array<(n: Notification) => void> = [];

export const notify = (message: string, type: NotificationType = 'success') => {
  const n: Notification = { id: Math.random().toString(36).slice(2), message, type };
  notificationListeners.forEach(l => l(n));
};

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handler = (n: Notification) => {
      setNotifications(prev => [...prev, n]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(item => item.id !== n.id));
      }, 3000);
    };
    notificationListeners.push(handler);
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== handler);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="mcms-fixed mcms-bottom-4 mcms-right-4 mcms-z-[10000] mcms-flex mcms-flex-col mcms-gap-2">
      {notifications.map(n => (
        <div 
          key={n.id}
          className={cn(
            "mcms-px-6 mcms-py-3 mcms-rounded-lg mcms-shadow-lg mcms-text-white mcms-font-medium mcms-animate-in mcms-slide-in-from-right-full mcms-duration-300",
            n.type === 'success' ? 'mcms-bg-green-600' : n.type === 'error' ? 'mcms-bg-red-600' : 'mcms-bg-blue-600'
          )}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};
