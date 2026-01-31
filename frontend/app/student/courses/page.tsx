'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, MapPin, User, Calendar } from 'lucide-react';
import StudentLayout from '../layout';
import api from '@/lib/api';

interface StudentGroup {
    id: string;
    name: string;
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

export default function StudentCourses() {
    const [activeTab, setActiveTab] = useState('courses');
    const [groups, setGroups] = useState<StudentGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'courses') {
            fetchCourses();
        }
    }, [activeTab]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/students/courses');
            setGroups(response.data);
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

    const renderCourses = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">دروسي</h2>

                {groups.length > 0 ? (
                    <div className="grid gap-6">
                        {groups.map((group) => (
                            <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                                        <p className="text-gray-600">{group.subject} - {group.level}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        group.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {group.status === 'active' ? 'نشط' : 'غير نشط'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>الأستاذ: {group.teacher.name}</span>
                                    </div>
                                    {group.room && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>الغرفة: {group.room}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        أوقات الدروس:
                                    </h4>
                                    {group.timeSlots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded">
                                            <Clock className="w-4 h-4" />
                                            <span>{getDayName(slot.day)}: {slot.startTime} - {slot.endTime}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دروس مسجلة</h3>
                        <p className="text-gray-600">لم يتم تسجيلك في أي مجموعة دراسية بعد</p>
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
            {activeTab === 'courses' && renderCourses()}
        </StudentLayout>
    );
}