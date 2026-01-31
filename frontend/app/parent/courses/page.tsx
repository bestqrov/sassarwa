'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, MapPin, User, Calendar } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface ChildCourse {
    id: string;
    studentId: string;
    studentName: string;
    groupName: string;
    subject: string;
    level: string;
    room?: string;
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    teacher: {
        name: string;
        email?: string;
    };
    status: string;
}

export default function ParentCourses() {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState<ChildCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        if (activeTab === 'courses') {
            fetchCourses();
        }
    }, [activeTab]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/parents/children-courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (day: string) => {
        const days = {
            'monday': 'الاثنين',
            'tuesday': 'الثلاثاء',
            'wednesday': 'الأربعاء',
            'thursday': 'الخميس',
            'friday': 'الجمعة',
            'saturday': 'السبت',
            'sunday': 'الأحد'
        };
        return days[day as keyof typeof days] || day;
    };

    const filteredCourses = selectedChild === 'all'
        ? courses
        : courses.filter(course => course.studentId === selectedChild);

    const renderCourses = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">مواعيد دروس الأبناء</h2>

                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">جميع الأبناء</option>
                        {Array.from(new Set(courses.map(c => c.studentId)))
                            .map(studentId => {
                                const course = courses.find(c => c.studentId === studentId);
                                return (
                                    <option key={studentId} value={studentId}>
                                        {course?.studentName}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {filteredCourses.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredCourses.map((course) => (
                            <div key={`${course.studentId}-${course.id}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{course.groupName}</h3>
                                        <p className="text-gray-600">{course.subject} - {course.level}</p>
                                        <p className="text-sm text-gray-500 mt-1">الطالب: {course.studentName}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        course.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {course.status === 'active' ? 'نشط' : 'غير نشط'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>الأستاذ: {course.teacher.name}</span>
                                    </div>
                                    {course.room && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>الغرفة: {course.room}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        أوقات الدروس:
                                    </h4>
                                    <div className="grid gap-2">
                                        {course.timeSlots.map((slot, index) => (
                                            <div key={index} className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-medium">{getDayName(slot.day)}:</span>
                                                <span>{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دروس مسجلة</h3>
                        <p className="text-gray-600">لم يتم تسجيل أي دروس للأبناء بعد</p>
                    </div>
                )}
            </div>

            {/* Weekly Schedule */}
            {filteredCourses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">الجدول الأسبوعي</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => {
                            const dayCourses = filteredCourses.filter(course =>
                                course.timeSlots.some(slot => slot.day === day)
                            );

                            return (
                                <div key={day} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 text-center">
                                        {getDayName(day)}
                                    </h4>

                                    {dayCourses.length > 0 ? (
                                        <div className="space-y-2">
                                            {dayCourses.map((course) => {
                                                const timeSlot = course.timeSlots.find(slot => slot.day === day);
                                                return (
                                                    <div key={`${course.studentId}-${course.id}`} className="bg-blue-50 p-2 rounded text-sm">
                                                        <div className="font-medium text-blue-900">{course.groupName}</div>
                                                        <div className="text-blue-700">{course.subject}</div>
                                                        <div className="text-blue-600 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {timeSlot?.startTime} - {timeSlot?.endTime}
                                                        </div>
                                                        <div className="text-blue-600 text-xs mt-1">
                                                            {course.studentName}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center">لا توجد دروس</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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
            {activeTab === 'courses' && renderCourses()}
        </ParentLayout>
    );
}