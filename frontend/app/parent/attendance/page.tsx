'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Users } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface ChildAttendance {
    id: string;
    studentId: string;
    studentName: string;
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

interface AttendanceStats {
    studentId: string;
    studentName: string;
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendancePercentage: number;
}

export default function ParentAttendance() {
    const [activeTab, setActiveTab] = useState('attendance');
    const [attendanceRecords, setAttendanceRecords] = useState<ChildAttendance[]>([]);
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        if (activeTab === 'attendance') {
            fetchAttendanceData();
        }
    }, [activeTab]);

    const fetchAttendanceData = async () => {
        try {
            const [recordsResponse, statsResponse] = await Promise.all([
                api.get('/parents/children-attendance'),
                api.get('/parents/attendance-stats')
            ]);

            setAttendanceRecords(recordsResponse.data);
            setAttendanceStats(statsResponse.data);
        } catch (error) {
            console.error('Failed to fetch attendance data:', error);
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

    const filteredRecords = selectedChild === 'all'
        ? attendanceRecords
        : attendanceRecords.filter(record => record.studentId === selectedChild);

    const renderAttendance = () => (
        <div className="space-y-6">
            {/* Attendance Stats */}
            <div className="grid gap-6">
                {attendanceStats.map((stat) => (
                    <div key={stat.studentId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{stat.studentName}</h3>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{stat.attendancePercentage}%</div>
                                <div className="text-sm text-gray-500">نسبة الحضور</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">{stat.totalSessions}</div>
                                <div className="text-sm text-gray-500">إجمالي الجلسات</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-green-600">{stat.presentCount}</div>
                                <div className="text-sm text-gray-500">حاضر</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-red-600">{stat.absentCount}</div>
                                <div className="text-sm text-gray-500">غائب</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-yellow-600">{stat.lateCount}</div>
                                <div className="text-sm text-gray-500">متأخر</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">سجل الحضور</h2>

                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">جميع الأبناء</option>
                        {attendanceStats.map((stat) => (
                            <option key={stat.studentId} value={stat.studentId}>
                                {stat.studentName}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredRecords.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(record.status)}
                                    <div>
                                        <h3 className="font-medium text-gray-900">{record.studentName}</h3>
                                        <p className="text-sm text-gray-600">{record.group.name} - {record.group.subject}</p>
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
                        <p className="text-gray-600">لم يتم تسجيل أي حضور للأبناء بعد</p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </ParentLayout>
        );
    }

    return (
        <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'attendance' && renderAttendance()}
        </ParentLayout>
    );
}