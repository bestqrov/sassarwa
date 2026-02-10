'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    FileText,
    CheckCircle,
    Calendar,
    Bell,
    TrendingUp,
    Clock
} from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import notifications from '@/lib/utils/notifications';

interface TeacherStats {
    totalGroups: number;
    totalStudents: number;
    pendingHomework: number;
    upcomingExams: number;
    todayAttendance: number;
}

interface RecentActivity {
    id: string;
    type: 'homework' | 'exam' | 'attendance';
    title: string;
    groupName: string;
    date: string;
}

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<TeacherStats>({
        totalGroups: 0,
        totalStudents: 0,
        pendingHomework: 0,
        upcomingExams: 0,
        todayAttendance: 0
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers/profile');
            const teacherData = response.data;

            // حساب الإحصائيات
            const totalGroups = teacherData.groups?.length || 0;
            const totalStudents = teacherData.groups?.reduce((sum: number, group: any) =>
                sum + (group.students?.length || 0), 0) || 0;

            const pendingHomework = teacherData.homework?.filter((hw: any) =>
                new Date(hw.dueDate) > new Date()).length || 0;

            const upcomingExams = teacherData.exams?.filter((exam: any) =>
                new Date(exam.examDate) > new Date()).length || 0;

            setStats({
                totalGroups,
                totalStudents,
                pendingHomework,
                upcomingExams,
                todayAttendance: 0 // سيتم حسابه لاحقاً
            });

            // إنشاء قائمة الأنشطة الأخيرة
            const activities: RecentActivity[] = [];

            teacherData.homework?.slice(0, 3).forEach((hw: any) => {
                activities.push({
                    id: hw.id,
                    type: 'homework',
                    title: hw.title,
                    groupName: hw.group.name,
                    date: new Date(hw.createdAt).toLocaleDateString('ar-MA')
                });
            });

            teacherData.exams?.slice(0, 3).forEach((exam: any) => {
                activities.push({
                    id: exam.id,
                    type: 'exam',
                    title: exam.title,
                    groupName: exam.group.name,
                    date: new Date(exam.createdAt).toLocaleDateString('ar-MA')
                });
            });

            setRecentActivities(activities.slice(0, 6));

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            notifications.error('فشل في تحميل بيانات لوحة التحكم');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'الأقسام',
            value: stats.totalGroups,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'الطلاب',
            value: stats.totalStudents,
            icon: Users,
            color: 'bg-green-500'
        },
        {
            title: 'تمارين معلقة',
            value: stats.pendingHomework,
            icon: BookOpen,
            color: 'bg-yellow-500'
        },
        {
            title: 'امتحانات قادمة',
            value: stats.upcomingExams,
            icon: FileText,
            color: 'bg-purple-500'
        }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'homework': return BookOpen;
            case 'exam': return FileText;
            case 'attendance': return CheckCircle;
            default: return Bell;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'homework': return 'text-blue-600';
            case 'exam': return 'text-red-600';
            case 'attendance': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

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
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة تحكم الأستاذ</h1>
                    <p className="text-blue-100">إدارة أقسامك والطلاب والأنشطة التعليمية</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => setActiveTab('groups')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-900">إدارة الأقسام</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-900">تسجيل الحضور</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('homework')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <BookOpen className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-900">إضافة تمرين</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('exams')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-900">إضافة امتحان</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">الأنشطة الأخيرة</h2>
                    {recentActivities.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = getActivityIcon(activity.type);
                                return (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} bg-opacity-10`}>
                                            <Icon className={`w-5 h-5 ${getActivityColor(activity.type)}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-sm text-gray-600">{activity.groupName}</p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {activity.date}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>لا توجد أنشطة حديثة</p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}