'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Bell, TrendingUp, User } from 'lucide-react';
import StudentLayout from '../layout'; // Corrected import path
import api from '@/lib/api';

interface StudentStats {
    totalCourses: number;
    totalAttendance: number;
    upcomingSessions: number;
    unreadNotifications: number;
}

interface UpcomingSession {
    id: string;
    groupName: string;
    subject: string;
    room?: string;
    startTime: string;
    endTime: string;
    teacher: string;
}

export default function StudentDashboard() {
    const [stats, setStats] = useState<StudentStats>({
        totalCourses: 0,
        totalAttendance: 0,
        upcomingSessions: 0,
        unreadNotifications: 0
    });
    const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, sessionsResponse] = await Promise.all([
                api.get('/students/stats'),
                api.get('/students/upcoming-sessions')
            ]);

            setStats(statsResponse.data);
            setUpcomingSessions(sessionsResponse.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'إجمالي الدروس',
            value: stats.totalCourses,
            icon: BookOpen,
            color: 'bg-blue-500'
        },
        {
            title: 'الحضور',
            value: `${stats.totalAttendance}%`,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'الجلسات القادمة',
            value: stats.upcomingSessions,
            icon: Calendar,
            color: 'bg-purple-500'
        },
        {
            title: 'إشعارات غير مقروءة',
            value: stats.unreadNotifications,
            icon: Bell,
            color: 'bg-orange-500'
        }
    ];

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">مرحباً بك في مساحة الطالب</h2>
                        <p className="text-gray-600">تابع دروسك وحضورك وإشعاراتك</p>
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

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">الجلسات القادمة</h3>
                {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingSessions.slice(0, 3).map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{session.groupName}</h4>
                                        <p className="text-sm text-gray-600">{session.subject}</p>
                                        <p className="text-sm text-gray-500">الأستاذ: {session.teacher}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{session.startTime} - {session.endTime}</span>
                                    </div>
                                    {session.room && (
                                        <p className="text-sm text-gray-500">الغرفة: {session.room}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">لا توجد جلسات قادمة</p>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            {renderDashboard()}
        </StudentLayout>
    );
}