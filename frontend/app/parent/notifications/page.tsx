'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, DollarSign, UserCheck, UserX } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface Notification {
    id: string;
    type: 'payment' | 'attendance' | 'general';
    title: string;
    message: string;
    childName?: string;
    amount?: number;
    date: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high';
}

export default function ParentNotifications() {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'payment' | 'attendance'>('all');

    useEffect(() => {
        if (activeTab === 'notifications') {
            fetchNotifications();
        }
    }, [activeTab]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/parents/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await api.patch(`/parents/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, read: true } : notif
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/parents/notifications/read-all');
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'payment':
                return <DollarSign className="w-5 h-5 text-green-600" />;
            case 'attendance':
                return <UserCheck className="w-5 h-5 text-blue-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.read;
        if (filter === 'payment') return notif.type === 'payment';
        if (filter === 'attendance') return notif.type === 'attendance';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const renderNotifications = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6" />
                            الإشعارات
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-600 mt-1">إشعارات المدفوعات وحضور الأبناء</p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            تحديد الكل كمقروء
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: 'all', label: 'الكل' },
                        { key: 'unread', label: 'غير مقروء' },
                        { key: 'payment', label: 'المدفوعات' },
                        { key: 'attendance', label: 'الحضور' }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === key
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border rounded-lg p-4 transition-all ${
                                    getPriorityColor(notification.priority)
                                } ${!notification.read ? 'border-l-4 border-l-purple-500' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>
                                                {notification.childName && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        الطالب: {notification.childName}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(notification.date).toLocaleDateString('ar-SA')}
                                                </span>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                                    >
                                                        تحديد كمقروء
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mt-2">{notification.message}</p>

                                        {notification.amount && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold text-green-600">
                                                    {notification.amount.toLocaleString()} درهم
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                notification.priority === 'high'
                                                    ? 'bg-red-100 text-red-800'
                                                    : notification.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {notification.priority === 'high' ? 'عالية' :
                                                 notification.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                                            </span>

                                            <span className={`flex items-center gap-1 ${
                                                notification.read ? 'text-green-600' : 'text-gray-400'
                                            }`}>
                                                {notification.read ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        مقروء
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-4 h-4" />
                                                        غير مقروء
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' :
                             filter === 'payment' ? 'لا توجد إشعارات مدفوعات' :
                             filter === 'attendance' ? 'لا توجد إشعارات حضور' :
                             'لا توجد إشعارات'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all' ? 'ستظهر هنا إشعارات المدفوعات وحضور الأبناء' :
                             'لا توجد إشعارات مطابقة للفلتر المحدد'}
                        </p>
                    </div>
                )}
            </div>

            {/* Notification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">إشعارات غير مقروءة</p>
                            <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">إشعارات المدفوعات</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {notifications.filter(n => n.type === 'payment').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">إشعارات الحضور</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {notifications.filter(n => n.type === 'attendance').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </ParentLayout>
        );
    }

    return (
        <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'notifications' && renderNotifications()}
        </ParentLayout>
    );
}