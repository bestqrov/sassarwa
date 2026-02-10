'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, CreditCard, Bell, TrendingUp, User, AlertCircle, CheckCircle } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface ParentStats {
    totalChildren: number;
    totalAttendance: number;
    totalPayments: number;
    unreadNotifications: number;
    recentAlerts: number;
}

interface RecentActivity {
    id: string;
    type: 'attendance' | 'payment' | 'course';
    title: string;
    description: string;
    studentName: string;
    date: string;
    status?: 'success' | 'warning' | 'error';
}

export default function ParentDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<ParentStats>({
        totalChildren: 0,
        totalAttendance: 0,
        totalPayments: 0,
        unreadNotifications: 0,
        recentAlerts: 0
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, activitiesResponse] = await Promise.all([
                api.get('/parents/stats'),
                api.get('/parents/recent-activities')
            ]);

            setStats(statsResponse.data);
            setRecentActivities(activitiesResponse.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'عدد الأبناء',
            value: stats.totalChildren,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'متوسط الحضور',
            value: `${stats.totalAttendance}%`,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'إجمالي المدفوعات',
            value: `${stats.totalPayments} درهم`,
            icon: CreditCard,
            color: 'bg-purple-500'
        },
        {
            title: 'إشعارات غير مقروءة',
            value: stats.unreadNotifications,
            icon: Bell,
            color: 'bg-orange-500'
        }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'attendance':
                return <Clock className="w-5 h-5 text-blue-600" />;
            case 'payment':
                return <CreditCard className="w-5 h-5 text-green-600" />;
            case 'course':
                return <Calendar className="w-5 h-5 text-purple-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const getActivityStatusIcon = (status?: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">مرحباً بك في مساحة الوالد</h2>
                        <p className="text-gray-600">تابع أبناءك وحضورهم ومدفوعاتهم</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">النشاطات الأخيرة</h3>
                {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    {getActivityIcon(activity.type)}
                                    <div>
                                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                        <p className="text-sm text-gray-500">الطالب: {activity.studentName}</p>
                                    </div>
                                </div>
                                <div className="text-left flex items-center gap-2">
                                    {getActivityStatusIcon(activity.status)}
                                    <p className="text-sm text-gray-500">
                                        {new Date(activity.date).toLocaleDateString('ar-MA', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">لا توجد نشاطات حديثة</p>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                    <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">حضور اليوم</h3>
                    <p className="text-sm text-gray-600 mb-4">تحقق من حضور أبنائك اليوم</p>
                    <button
                        onClick={() => router.push('/parent/attendance')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        عرض الحضور
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                    <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">المدفوعات</h3>
                    <p className="text-sm text-gray-600 mb-4">عرض تاريخ المدفوعات</p>
                    <button
                        onClick={() => router.push('/parent/payments')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        عرض المدفوعات
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                    <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">مواعيد الدروس</h3>
                    <p className="text-sm text-gray-600 mb-4">جدولة دروس أبنائك</p>
                    <button
                        onClick={() => router.push('/parent/courses')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        عرض المواعيد
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <ParentLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </ParentLayout>
        );
    }

    return (
        <ParentLayout>
            {renderDashboard()}
        </ParentLayout>
    );
}