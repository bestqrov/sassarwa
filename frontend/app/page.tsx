'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, UserCheck, BookOpen, Users } from 'lucide-react';
import Button from '@/components/Button';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <GraduationCap className="w-8 h-8 text-blue-600 ml-2" />
                            <h1 className="text-xl font-bold text-gray-900">ArwaEduc</h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                تسجيل دخول المشرف
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        نظام إدارة التعليم
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        منصة شاملة لإدارة المدارس والطلاب والأساتذة والدروس
                    </p>
                </div>

                {/* Access Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Admin Access */}
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">المشرف</h3>
                        <p className="text-gray-600 mb-6">
                            إدارة النظام والطلاب والأساتذة والتقارير
                        </p>
                        <Link href="/login">
                            <Button className="w-full">
                                دخول المشرف
                            </Button>
                        </Link>
                    </div>

                    {/* Teacher Access */}
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">الأستاذ</h3>
                        <p className="text-gray-600 mb-6">
                            إدارة الدروس والحضور والتقييمات
                        </p>
                        <Link href="/teacher-login">
                            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                دخول الأستاذ
                            </Button>
                        </Link>
                    </div>

                    {/* Student Access */}
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">الطالب</h3>
                        <p className="text-gray-600 mb-6">
                            متابعة الدروس والحضور والإشعارات
                        </p>
                        <Link href="/student-login">
                            <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                                دخول الطالب
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center mt-16 text-gray-500">
                    <p>&copy; 2024 ArwaEduc. جميع الحقوق محفوظة.</p>
                </footer>
            </main>
        </div>
    );
}
