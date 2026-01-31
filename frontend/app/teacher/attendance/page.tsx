'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Calendar, Search } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import notifications from '@/lib/utils/notifications';

interface Group {
    id: string;
    name: string;
    students: Array<{
        id: string;
        name: string;
        surname: string;
    }>;
}

interface AttendanceRecord {
    studentId: string;
    status: 'present' | 'absent';
}

export default function TeacherAttendancePage() {
    const [activeTab, setActiveTab] = useState('attendance');
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchStudentsAndAttendance();
        }
    }, [selectedGroup, selectedDate]);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/teachers/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            notifications.error('فشل في تحميل الأقسام');
        }
    };

    const fetchStudentsAndAttendance = async () => {
        try {
            setLoading(true);
            const [studentsResponse, attendanceResponse] = await Promise.all([
                api.get(`/teachers/groups/${selectedGroup}/students`),
                api.get(`/teachers/groups/${selectedGroup}/attendance`, {
                    params: {
                        startDate: selectedDate,
                        endDate: selectedDate
                    }
                })
            ]);

            const students = studentsResponse.data;
            const existingAttendance = attendanceResponse.data;

            // إنشاء سجل حضور لكل طالب
            const attendanceRecords: AttendanceRecord[] = students.map((student: any) => {
                const existing = existingAttendance.find((att: any) => att.studentId === student.id);
                return {
                    studentId: student.id,
                    status: existing ? existing.status : 'present'
                };
            });

            setAttendance(attendanceRecords);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            notifications.error('فشل في تحميل بيانات الطلاب والحضور');
        } finally {
            setLoading(false);
        }
    };

    const updateAttendance = (studentId: string, status: 'present' | 'absent') => {
        setAttendance(prev =>
            prev.map(record =>
                record.studentId === studentId
                    ? { ...record, status }
                    : record
            )
        );
    };

    const saveAttendance = async () => {
        try {
            setSaving(true);

            // حفظ حضور كل طالب
            const promises = attendance.map(record =>
                api.post('/teachers/attendance', {
                    studentId: record.studentId,
                    groupId: selectedGroup,
                    date: selectedDate,
                    status: record.status
                })
            );

            await Promise.all(promises);

            notifications.success('تم حفظ الحضور بنجاح');
        } catch (error) {
            console.error('Failed to save attendance:', error);
            notifications.error('فشل في حفظ الحضور');
        } finally {
            setSaving(false);
        }
    };

    const selectedGroupData = groups.find(g => g.id === selectedGroup);

    return (
        <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">تسجيل الحضور</h1>
                        <p className="text-gray-600">إدارة حضور الطلاب في الأقسام</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                اختر القسم
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">اختر قسم...</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                تاريخ الحضور
                            </label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Attendance List */}
                {selectedGroup && selectedGroupData && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        حضور قسم: {selectedGroupData.name}
                                    </h2>
                                    <p className="text-gray-600">
                                        {selectedGroupData.students.length} طالب
                                    </p>
                                </div>
                                <Button
                                    onClick={saveAttendance}
                                    isLoading={saving}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    حفظ الحضور
                                </Button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {selectedGroupData.students.map((student) => {
                                    const attendanceRecord = attendance.find(a => a.studentId === student.id);
                                    const status = attendanceRecord?.status || 'present';

                                    return (
                                        <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {student.name} {student.surname}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateAttendance(student.id, 'present')}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        status === 'present'
                                                            ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                                                    }`}
                                                >
                                                    <CheckCircle className="w-4 h-4 inline mr-2" />
                                                    حاضر
                                                </button>
                                                <button
                                                    onClick={() => updateAttendance(student.id, 'absent')}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        status === 'absent'
                                                            ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                                                    }`}
                                                >
                                                    <XCircle className="w-4 h-4 inline mr-2" />
                                                    غائب
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {!selectedGroup && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">اختر قسم لتسجيل الحضور</h3>
                        <p className="text-gray-600">اختر قسم من القائمة أعلاه لبدء تسجيل حضور الطلاب</p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}