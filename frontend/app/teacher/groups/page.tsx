'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import notifications from '@/lib/utils/notifications';

interface Group {
    id: string;
    name: string;
    type: 'SOUTIEN' | 'FORMATION';
    level?: string;
    subject?: string;
    room?: string;
    whatsappUrl?: string;
    timeSlots?: any[];
    _count: {
        students: number;
    };
    students: Array<{
        id: string;
        name: string;
        surname: string;
    }>;
}

export default function TeacherGroupsPage() {
    const [activeTab, setActiveTab] = useState('groups');
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            notifications.error('فشل في تحميل الأقسام');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeSlots = (timeSlots: any[]) => {
        if (!timeSlots || timeSlots.length === 0) return 'غير محدد';

        return timeSlots.map(slot => {
            const day = slot.day || 'غير محدد';
            const start = slot.startTime || '';
            const end = slot.endTime || '';
            return `${day}: ${start}-${end}`;
        }).join(', ');
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">إدارة الأقسام</h1>
                        <p className="text-gray-600">عرض وإدارة الأقسام التي تدرسها</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        إجمالي الأقسام: {groups.length}
                    </div>
                </div>

                {/* Groups Grid */}
                {groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => (
                            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                {/* Group Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {group.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                group.type === 'SOUTIEN'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {group.type === 'SOUTIEN' ? 'دعم' : 'تكوين'}
                                            </span>
                                            {group.level && (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                    {group.level}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Group Details */}
                                <div className="space-y-3 mb-4">
                                    {group.subject && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{group.subject}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>{group._count.students} طالب</span>
                                    </div>

                                    {group.room && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>القاعة: {group.room}</span>
                                        </div>
                                    )}

                                    {group.timeSlots && group.timeSlots.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatTimeSlots(group.timeSlots)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setSelectedGroup(group)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        عرض التفاصيل
                                    </Button>
                                    <Button
                                        onClick={() => setActiveTab('attendance')}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        الحضور
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أقسام</h3>
                        <p className="text-gray-600">لم يتم تعيينك لأي قسم بعد</p>
                    </div>
                )}

                {/* Group Details Modal */}
                {selectedGroup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        تفاصيل القسم: {selectedGroup.name}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedGroup(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Students List */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        الطلاب ({selectedGroup.students.length})
                                    </h3>
                                    {selectedGroup.students.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedGroup.students.map((student) => (
                                                <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {student.name} {student.surname}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">لا يوجد طلاب في هذا القسم</p>
                                    )}
                                </div>

                                {/* Group Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">النوع:</span>
                                        <span className="mr-2 text-gray-600">
                                            {selectedGroup.type === 'SOUTIEN' ? 'دعم' : 'تكوين'}
                                        </span>
                                    </div>
                                    {selectedGroup.level && (
                                        <div>
                                            <span className="font-medium text-gray-700">المستوى:</span>
                                            <span className="mr-2 text-gray-600">{selectedGroup.level}</span>
                                        </div>
                                    )}
                                    {selectedGroup.subject && (
                                        <div>
                                            <span className="font-medium text-gray-700">المادة:</span>
                                            <span className="mr-2 text-gray-600">{selectedGroup.subject}</span>
                                        </div>
                                    )}
                                    {selectedGroup.room && (
                                        <div>
                                            <span className="font-medium text-gray-700">القاعة:</span>
                                            <span className="mr-2 text-gray-600">{selectedGroup.room}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}