'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Clock, Bell, Settings, LogOut, Users, CreditCard, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/Button';

interface ParentProfile {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    cin?: string;
    address?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    children: Array<{
        id: string;
        name: string;
        surname: string;
        schoolLevel?: string;
        status: string;
    }>;
}

export default function ParentLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState<ParentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/parents/profile');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            router.push('/parent-login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/parent-login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: User, href: '/parent/dashboard' },
        { id: 'children', label: 'أبنائي', icon: Users, href: '/parent/children' },
        { id: 'attendance', label: 'حضور الأبناء', icon: Clock, href: '/parent/attendance' },
        { id: 'payments', label: 'المدفوعات', icon: CreditCard, href: '/parent/payments' },
        { id: 'courses', label: 'مواعيد الدروس', icon: Calendar, href: '/parent/courses' },
        { id: 'notifications', label: 'الإشعارات', icon: Bell, href: '/parent/notifications' },
        { id: 'profile', label: 'الملف الشخصي', icon: Settings, href: '/parent/profile' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">مساحة الوالد</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {profile && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {profile.name} {profile.surname}
                                    </span>
                                </div>
                            )}
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                خروج
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}