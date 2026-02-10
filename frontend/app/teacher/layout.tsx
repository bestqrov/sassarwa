'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    GraduationCap,
    FileText,
    CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/Button';
import notifications from '@/lib/utils/notifications';

interface TeacherLayoutProps {
    children: React.ReactNode;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export default function TeacherLayout({ children, activeTab = 'dashboard', onTabChange }: TeacherLayoutProps) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [teacherData, setTeacherData] = useState<any>(null);

    useEffect(() => {
        // جلب بيانات الأستاذ
        fetchTeacherData();
    }, []);

    const fetchTeacherData = async () => {
        try {
            const response = await fetch('/api/teachers/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTeacherData(data);
            }
        } catch (error) {
            console.error('Failed to fetch teacher data:', error);
        }
    };

    const handleLogout = () => {
        logout();
        notifications.success('تم تسجيل الخروج بنجاح');
        router.push('/teacher-login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        { id: 'groups', label: 'الأقسام', icon: Users },
        { id: 'attendance', label: 'الحضور', icon: CheckCircle },
        { id: 'homework', label: 'التمارين', icon: BookOpen },
        { id: 'exams', label: 'الامتحانات', icon: FileText },
        { id: 'schedule', label: 'الجدول الزمني', icon: Calendar },
        { id: 'notifications', label: 'الإشعارات', icon: Bell },
        { id: 'profile', label: 'الملف الشخصي', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">أستاذ</h2>
                                <p className="text-sm text-gray-600">{user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => {
                                                onTabChange?.(item.id);
                                                setSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                                                activeTab === item.id
                                                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:mr-64">
                {/* Top bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <h1 className="text-lg font-semibold text-gray-900">
                                    مرحباً {user?.name}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {teacherData?.groups?.length || 0} أقسام
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}