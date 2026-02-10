'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, Eye, EyeOff } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import notifications from '@/lib/utils/notifications';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GENERAL';
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}

export default function TeacherNotificationsPage() {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // في الواقع، سيتم إنشاء endpoint منفصل للإشعارات
            // هنا سنستخدم بيانات وهمية للعرض
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    title: 'تحديث في الجدول الزمني',
                    message: 'تم تحديث مواعيد الحصص لقسم الرياضيات الأولى',
                    type: 'ADMIN',
                    isRead: false,
                    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 دقيقة مضت
                },
                {
                    id: '2',
                    title: 'تمرين جديد',
                    message: 'تم إضافة تمرين جديد في مادة الفيزياء لقسم السنة الثانية',
                    type: 'TEACHER',
                    isRead: true,
                    readAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // قرأ منذ ساعتين
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // منذ 4 ساعات
                },
                {
                    id: '3',
                    title: 'إشعار عام',
                    message: 'سيتم إغلاق المدرسة يوم الجمعة القادمة للصيانة',
                    type: 'GENERAL',
                    isRead: false,
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // منذ يوم
                },
                {
                    id: '4',
                    title: 'تذكير بالامتحان',
                    message: 'امتحان الرياضيات سيكون بعد يومين. تأكد من تجهيز القاعة',
                    type: 'ADMIN',
                    isRead: true,
                    readAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // منذ يومين
                }
            ];

            setNotificationsList(mockNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            notifications.error('فشل في تحميل الإشعارات');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            // في الواقع، سيتم استدعاء API
            setNotificationsList(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true, readAt: new Date().toISOString() }
                        : notif
                )
            );
            notifications.success('تم تحديد الإشعار كمقروء');
        } catch (error) {
            console.error('Failed to mark as read:', error);
            notifications.error('فشل في تحديث حالة الإشعار');
        }
    };

    const markAsUnread = async (notificationId: string) => {
        try {
            setNotificationsList(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: false, readAt: undefined }
                        : notif
                )
            );
            notifications.success('تم تحديد الإشعار كغير مقروء');
        } catch (error) {
            console.error('Failed to mark as unread:', error);
            notifications.error('فشل في تحديث حالة الإشعار');
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotificationsList(prev =>
                prev.map(notif => ({
                    ...notif,
                    isRead: true,
                    readAt: notif.readAt || new Date().toISOString()
                }))
            );
            notifications.success('تم تحديد جميع الإشعارات كمقروءة');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            notifications.error('فشل في تحديث الإشعارات');
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ADMIN': return AlertCircle;
            case 'TEACHER': return Info;
            case 'GENERAL': return Bell;
            default: return Bell;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'ADMIN': return 'text-red-600 bg-red-100';
            case 'TEACHER': return 'text-blue-600 bg-blue-100';
            case 'GENERAL': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ADMIN': return 'إداري';
            case 'TEACHER': return 'أستاذ';
            case 'GENERAL': return 'عام';
            default: return 'غير محدد';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'الآن';
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `منذ ${diffInDays} يوم`;
    };

    const filteredNotifications = notificationsList.filter(notif => {
        switch (filter) {
            case 'unread': return !notif.isRead;
            case 'read': return notif.isRead;
            default: return true;
        }
    });

    const unreadCount = notificationsList.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
                            <p className="text-gray-600">إشعاراتك وتنبيهاتك المهمة</p>
                        </div>
                        {unreadCount > 0 && (
                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                {unreadCount} غير مقروء
                            </div>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            تحديد الكل كمقروء
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            الكل ({notificationsList.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'unread'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            غير مقروء ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'read'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            مقروء ({notificationsList.length - unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                                        !notification.isRead
                                            ? 'border-blue-200 bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className={`text-lg font-semibold ${
                                                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                                                            {getTypeLabel(notification.type)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(notification.createdAt)}
                                                        </span>
                                                        {notification.isRead && notification.readAt && (
                                                            <span className="text-sm text-gray-500">
                                                                (قرأت في {formatDate(notification.readAt)})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    {notification.isRead ? (
                                                        <button
                                                            onClick={() => markAsUnread(notification.id)}
                                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                            title="تحديد كغير مقروء"
                                                        >
                                                            <EyeOff className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="تحديد كمقروء"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className={`text-gray-600 leading-relaxed ${
                                                !notification.isRead ? 'font-medium' : ''
                                            }`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' :
                             filter === 'read' ? 'لا توجد إشعارات مقروءة' :
                             'لا توجد إشعارات'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all' ? 'ستظهر إشعاراتك هنا عند وصولها' :
                             'جرب تغيير الفلتر لعرض إشعارات أخرى'}
                        </p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}