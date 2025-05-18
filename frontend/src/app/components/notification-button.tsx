"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, Info, AlertTriangle } from "lucide-react";
import { useNotifications, NotificationType } from "../context/notification-context";

function formatTime(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (60 * 1000));
  
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInMinutes / (24 * 60));
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
}

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "success":
      return <Check className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "error":
      return <X className="h-5 w-5 text-red-500" />;
    case "info":
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
}

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, clearNotification, unreadCount } = useNotifications();
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-3 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.read ? "" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex">
                      <div className="mr-3">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className={`font-medium ${notification.read ? "" : "text-blue-600"}`}>
                            {notification.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="text-gray-300 hover:text-gray-500 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
