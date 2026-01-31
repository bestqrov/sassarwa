'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle, Info, Calendar, BookOpen } from 'lucide-react';
import StudentLayout from '../layout';
import api from '@/lib/api';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isRead: boolean;
    createdAt: string;
    relatedTo?: {
        type: 'course' | 'attendance' | 'payment' | 'general';
        id?: string;
        name?: string;
    };
}

export default function StudentNotifications() {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        if (activeTab === 'notifications') {
            fetchNotifications();
        }
    }, [activeTab]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/students/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await api.patch(`/students/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/students/notifications/read-all');
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <Check className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    const getRelatedIcon = (type?: string) => {
        switch (type) {
            case 'course':
                return <BookOpen className="w-4 h-4" />;
            case 'attendance':
                return <Calendar className="w-4 h-4" />;
            default:
                return <Info className="w-4 h-4" />;
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const renderNotifications = () => (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">الإشعارات</h2>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            تحديد الكل كمقروء
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'الكل', count: notifications.length },
                        { key: 'unread', label: 'غير مقروء', count: unreadCount },
                        { key: 'read', label: 'مقروء', count: notifications.filter(n => n.isRead).length }
                    ].map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === key
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {label} ({count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`border rounded-lg p-4 transition-all ${
                                notification.isRead
                                    ? 'border-gray-200 bg-white'
                                    : `${getNotificationColor(notification.type)} border-l-4`
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${
                                    notification.isRead ? 'bg-gray-100' : 'bg-white'
                                }`}>
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-medium ${
                                                notification.isRead ? 'text-gray-900' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            <p className={`text-sm mt-1 ${
                                                notification.isRead ? 'text-gray-600' : 'text-gray-700'
                                            }`}>
                                                {notification.message}
                                            </p>

                                            {notification.relatedTo && (
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                    {getRelatedIcon(notification.relatedTo.type)}
                                                    <span>
                                                        {notification.relatedTo.type === 'course' && 'درس: '}
                                                        {notification.relatedTo.type === 'attendance' && 'حضور: '}
                                                        {notification.relatedTo.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-left ml-4">
                                            <p className="text-sm text-gray-500">
                                                {new Date(notification.createdAt).toLocaleDateString('ar-MA', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                                                >
                                                    تحديد كمقروء
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'unread'
                                ? 'جميع إشعاراتك مقروءة'
                                : 'لم يتم إرسال أي إشعارات بعد'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <StudentLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'notifications' && renderNotifications()}
        </StudentLayout>
    );
}