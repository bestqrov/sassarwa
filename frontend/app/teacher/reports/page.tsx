'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, BookOpen, TrendingUp, Filter } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import notifications from '@/lib/utils/notifications';

interface ReportData {
    totalStudents: number;
    totalGroups: number;
    totalSessions: number;
    totalHours: number;
    attendanceRate: number;
    monthlyRevenue: number;
    recentActivity: any[];
    groupPerformance: any[];
}

export default function TeacherReportsPage() {
    const [activeTab, setActiveTab] = useState('reports');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [generatingReport, setGeneratingReport] = useState(false);

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers/reports', {
                params: {
                    startDate: dateRange.start,
                    endDate: dateRange.end
                }
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report data:', error);
            notifications.error('فشل في تحميل بيانات التقارير');
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async (type: 'attendance' | 'performance' | 'revenue') => {
        try {
            setGeneratingReport(true);
            const response = await api.get(`/teachers/reports/${type}`, {
                params: {
                    startDate: dateRange.start,
                    endDate: dateRange.end
                },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `teacher-report-${type}-${dateRange.start}-to-${dateRange.end}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            notifications.success('تم إنشاء التقرير بنجاح');
        } catch (error) {
            console.error('Failed to generate report:', error);
            notifications.error('فشل في إنشاء التقرير');
        } finally {
            setGeneratingReport(false);
        }
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
                        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
                        <p className="text-gray-600">عرض وتحميل تقارير الأداء والإحصائيات</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => generateReport('attendance')}
                            isLoading={generatingReport}
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            تقرير الحضور
                        </Button>
                        <Button
                            onClick={() => generateReport('performance')}
                            isLoading={generatingReport}
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            تقرير الأداء
                        </Button>
                        <Button
                            onClick={() => generateReport('revenue')}
                            isLoading={generatingReport}
                            variant="outline"
                            className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            تقرير الإيرادات
                        </Button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    من تاريخ
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    إلى تاريخ
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {reportData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                                    <p className="text-2xl font-bold text-gray-900">{reportData.totalStudents}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي المجموعات</p>
                                    <p className="text-2xl font-bold text-gray-900">{reportData.totalGroups}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">إجمالي الساعات</p>
                                    <p className="text-2xl font-bold text-gray-900">{reportData.totalHours}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="mr-4">
                                    <p className="text-sm font-medium text-gray-600">معدل الحضور</p>
                                    <p className="text-2xl font-bold text-gray-900">{reportData.attendanceRate}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts and Detailed Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Group Performance */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">أداء المجموعات</h3>
                        {reportData?.groupPerformance && reportData.groupPerformance.length > 0 ? (
                            <div className="space-y-4">
                                {reportData.groupPerformance.map((group, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{group.name}</p>
                                            <p className="text-sm text-gray-600">{group.students} طالب</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">{group.attendanceRate}%</p>
                                            <p className="text-sm text-gray-600">معدل الحضور</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">لا توجد بيانات متاحة</p>
                        )}
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">الإيرادات الشهرية</h3>
                        <div className="text-center py-8">
                            <p className="text-3xl font-bold text-green-600 mb-2">
                                {reportData?.monthlyRevenue || 0} درهم
                            </p>
                            <p className="text-gray-600">إجمالي الإيرادات لهذا الشهر</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">النشاط الأخير</h3>
                    {reportData?.recentActivity && reportData.recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {reportData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-600">
                                            {new Date(activity.date).toLocaleDateString('ar-MA')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">لا يوجد نشاط حديث</p>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}