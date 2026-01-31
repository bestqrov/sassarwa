'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import StudentLayout from '../layout';
import api from '@/lib/api';

interface AttendanceRecord {
    id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    group: {
        name: string;
        subject: string;
    };
    session?: {
        startTime: string;
        endTime: string;
        room?: string;
    };
}

export default function StudentAttendance() {
    const [activeTab, setActiveTab] = useState('attendance');
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0
    });

    useEffect(() => {
        if (activeTab === 'attendance') {
            fetchAttendance();
        }
    }, [activeTab]);

    const fetchAttendance = async () => {
        try {
            const response = await api.get('/students/attendance');
            const records = response.data;
            setAttendanceRecords(records);

            // Calculate stats
            const total = records.length;
            const present = records.filter(r => r.status === 'present').length;
            const absent = records.filter(r => r.status === 'absent').length;
            const late = records.filter(r => r.status === 'late').length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            setStats({ total, present, absent, late, percentage });
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'absent':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'late':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'present':
                return 'حاضر';
            case 'absent':
                return 'غائب';
            case 'late':
                return 'متأخر';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'text-green-600 bg-green-50';
            case 'absent':
                return 'text-red-600 bg-red-50';
            case 'late':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const renderAttendance = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">إجمالي الجلسات</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">نسبة الحضور</p>
                            <p className="text-2xl font-bold text-green-600">{stats.percentage}%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">الحضور</p>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">الغياب</p>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">سجل الحضور</h2>

                {attendanceRecords.length > 0 ? (
                    <div className="space-y-4">
                        {attendanceRecords.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(record.status)}
                                    <div>
                                        <h3 className="font-medium text-gray-900">{record.group.name}</h3>
                                        <p className="text-sm text-gray-600">{record.group.subject}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(record.date).toLocaleDateString('ar-MA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                                        {getStatusText(record.status)}
                                    </span>
                                    {record.session && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {record.session.startTime} - {record.session.endTime}
                                            {record.session.room && ` • الغرفة: ${record.session.room}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد سجلات حضور</h3>
                        <p className="text-gray-600">لم يتم تسجيل أي حضور بعد</p>
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
            {activeTab === 'attendance' && renderAttendance()}
        </StudentLayout>
    );
}