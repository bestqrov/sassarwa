'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, BookOpen, Calendar, User as UserIcon } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface Child {
    id: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    schoolLevel?: string;
    currentSchool?: string;
    status: string;
    createdAt: string;
    groups: Array<{
        id: string;
        name: string;
        subject: string;
        level: string;
        teacher: {
            name: string;
        };
    }>;
}

export default function ParentChildren() {
    const [activeTab, setActiveTab] = useState('children');
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'children') {
            fetchChildren();
        }
    }, [activeTab]);

    const fetchChildren = async () => {
        try {
            const response = await api.get('/parents/children');
            setChildren(response.data);
        } catch (error) {
            console.error('Failed to fetch children:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderChildren = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">أبنائي</h2>

                {children.length > 0 ? (
                    <div className="grid gap-6">
                        {children.map((child) => (
                            <div key={child.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {child.name} {child.surname}
                                            </h3>
                                            <p className="text-gray-600">{child.schoolLevel} - {child.currentSchool}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        child.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {child.status === 'active' ? 'نشط' : 'غير نشط'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    {child.email && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{child.email}</span>
                                        </div>
                                    )}
                                    {child.phone && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{child.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        المجموعات المسجل بها:
                                    </h4>
                                    {child.groups.length > 0 ? (
                                        <div className="space-y-2">
                                            {child.groups.map((group) => (
                                                <div key={group.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                                    <div>
                                                        <span className="font-medium text-gray-900">{group.name}</span>
                                                        <span className="text-gray-600 mx-2">-</span>
                                                        <span className="text-gray-600">{group.subject}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        الأستاذ: {group.teacher.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">لم يتم تسجيل الطالب في أي مجموعة بعد</p>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        تاريخ التسجيل: {new Date(child.createdAt).toLocaleDateString('ar-MA')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أبناء مسجلين</h3>
                        <p className="text-gray-600">لم يتم تسجيل أي ابن بعد</p>
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
            {activeTab === 'children' && renderChildren()}
        </ParentLayout>
    );
}