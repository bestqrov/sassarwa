'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface PaymentRecord {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
    method: string;
    date: string;
    status: string;
    note?: string;
    inscription?: {
        type: string;
        category: string;
    };
}

interface PaymentStats {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    recentPayments: number;
}

export default function ParentPayments() {
    const [activeTab, setActiveTab] = useState('payments');
    const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
    const [paymentStats, setPaymentStats] = useState<PaymentStats>({
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        recentPayments: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        if (activeTab === 'payments') {
            fetchPaymentData();
        }
    }, [activeTab]);

    const fetchPaymentData = async () => {
        try {
            const [recordsResponse, statsResponse] = await Promise.all([
                api.get('/parents/payment-history'),
                api.get('/parents/payment-stats')
            ]);

            setPaymentRecords(recordsResponse.data);
            setPaymentStats(statsResponse.data);
        } catch (error) {
            console.error('Failed to fetch payment data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'overdue':
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'مدفوع';
            case 'pending':
                return 'في الانتظار';
            case 'overdue':
                return 'متأخر';
            case 'failed':
                return 'فاشل';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            case 'overdue':
            case 'failed':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getMethodText = (method: string) => {
        switch (method.toLowerCase()) {
            case 'cash':
                return 'نقدي';
            case 'card':
                return 'بطاقة';
            case 'transfer':
                return 'تحويل';
            case 'check':
                return 'شيك';
            default:
                return method;
        }
    };

    const filteredRecords = selectedChild === 'all'
        ? paymentRecords
        : paymentRecords.filter(record => record.studentId === selectedChild);

    const statCards = [
        {
            title: 'إجمالي المدفوعات',
            value: `${paymentStats.totalPaid} درهم`,
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'مدفوعات معلقة',
            value: `${paymentStats.totalPending} درهم`,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'مدفوعات متأخرة',
            value: `${paymentStats.totalOverdue} درهم`,
            icon: AlertCircle,
            color: 'bg-red-500'
        },
        {
            title: 'المدفوعات الأخيرة',
            value: paymentStats.recentPayments,
            icon: Calendar,
            color: 'bg-blue-500'
        }
    ];

    const renderPayments = () => (
        <div className="space-y-6">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment Records */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">تاريخ المدفوعات</h2>

                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="all">جميع الأبناء</option>
                        {Array.from(new Set(paymentRecords.map(r => r.studentId)))
                            .map(studentId => {
                                const student = paymentRecords.find(r => r.studentId === studentId);
                                return (
                                    <option key={studentId} value={studentId}>
                                        {student?.studentName}
                                    </option>
                                );
                            })}
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
                                        {record.inscription && (
                                            <p className="text-sm text-gray-600">
                                                {record.inscription.type} - {record.inscription.category}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {new Date(record.date).toLocaleDateString('ar-MA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        {record.note && (
                                            <p className="text-sm text-gray-500 mt-1">{record.note}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-left">
                                    <div className="text-lg font-bold text-gray-900">{record.amount} درهم</div>
                                    <div className="text-sm text-gray-500 mb-2">{getMethodText(record.method)}</div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                                        {getStatusText(record.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مدفوعات</h3>
                        <p className="text-gray-600">لم يتم تسجيل أي مدفوعات بعد</p>
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
            {activeTab === 'payments' && renderPayments()}
        </ParentLayout>
    );
}