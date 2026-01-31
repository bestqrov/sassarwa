'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Clock, Users, Edit, Trash2, Eye } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import notifications from '@/lib/utils/notifications';

interface Exam {
    id: string;
    title: string;
    description?: string;
    subject: string;
    examDate: string;
    duration: number;
    totalMarks: number;
    group: {
        id: string;
        name: string;
    };
    createdAt: string;
}

interface Group {
    id: string;
    name: string;
    subject?: string;
}

export default function TeacherExamsPage() {
    const [activeTab, setActiveTab] = useState('exams');
    const [exams, setExams] = useState<Exam[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        groupId: '',
        examDate: '',
        duration: '',
        totalMarks: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileResponse, groupsResponse] = await Promise.all([
                api.get('/teachers/profile'),
                api.get('/teachers/groups')
            ]);

            setExams(profileResponse.data.exams || []);
            setGroups(groupsResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            notifications.error('فشل في تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            subject: '',
            groupId: '',
            examDate: '',
            duration: '',
            totalMarks: ''
        });
        setEditingExam(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.subject || !formData.groupId ||
            !formData.examDate || !formData.duration || !formData.totalMarks) {
            notifications.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            setSaving(true);

            const examData = {
                title: formData.title,
                description: formData.description,
                subject: formData.subject,
                groupId: formData.groupId,
                examDate: new Date(formData.examDate).toISOString(),
                duration: parseInt(formData.duration),
                totalMarks: parseFloat(formData.totalMarks)
            };

            if (editingExam) {
                // تحديث الامتحان
                await api.put(`/exams/${editingExam.id}`, examData);
                notifications.success('تم تحديث الامتحان بنجاح');
            } else {
                // إنشاء امتحان جديد
                await api.post('/exams', examData);
                notifications.success('تم إضافة الامتحان بنجاح');
            }

            resetForm();
            fetchData();
        } catch (error) {
            console.error('Failed to save exam:', error);
            notifications.error('فشل في حفظ الامتحان');
        } finally {
            setSaving(false);
        }
    };

    const deleteExam = async (examId: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الامتحان؟')) return;

        try {
            await api.delete(`/exams/${examId}`);
            notifications.success('تم حذف الامتحان بنجاح');
            fetchData();
        } catch (error) {
            console.error('Failed to delete exam:', error);
            notifications.error('فشل في حذف الامتحان');
        }
    };

    const getStatusColor = (examDate: string) => {
        const now = new Date();
        const exam = new Date(examDate);
        const diffTime = exam.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-gray-600 bg-gray-100';
        if (diffDays <= 1) return 'text-orange-600 bg-orange-100';
        return 'text-blue-600 bg-blue-100';
    };

    const getStatusText = (examDate: string) => {
        const now = new Date();
        const exam = new Date(examDate);
        const diffTime = exam.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'انتهى';
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'غداً';
        return `باقي ${diffDays} أيام`;
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
                        <h1 className="text-2xl font-bold text-gray-900">الامتحانات</h1>
                        <p className="text-gray-600">إدارة الامتحانات والاختبارات</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة امتحان جديد
                    </Button>
                </div>

                {/* Exam Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingExam ? 'تعديل الامتحان' : 'إضافة امتحان جديد'}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عنوان الامتحان *
                                        </label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="أدخل عنوان الامتحان"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المادة *
                                        </label>
                                        <Input
                                            value={formData.subject}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                            placeholder="مثال: الرياضيات"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            القسم *
                                        </label>
                                        <select
                                            value={formData.groupId}
                                            onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">اختر قسم...</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>
                                                    {group.name} {group.subject && `(${group.subject})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ الامتحان *
                                        </label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.examDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المدة (بالدقائق) *
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="مثال: 120"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            العلامة الإجمالية *
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.totalMarks}
                                            onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: e.target.value }))}
                                            placeholder="مثال: 20"
                                            min="0"
                                            step="0.5"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف الامتحان
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="أدخل تفاصيل الامتحان..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        isLoading={saving}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {editingExam ? 'تحديث الامتحان' : 'إضافة الامتحان'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Exams List */}
                {exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {exam.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <FileText className="w-4 h-4" />
                                            <span>{exam.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>{exam.group.name}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.examDate)}`}>
                                        {getStatusText(exam.examDate)}
                                    </span>
                                </div>

                                {exam.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {exam.description}
                                    </p>
                                )}

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(exam.examDate).toLocaleDateString('ar-MA')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{exam.duration} دقيقة</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FileText className="w-4 h-4" />
                                        <span>العلامة: {exam.totalMarks}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            setEditingExam(exam);
                                            setFormData({
                                                title: exam.title,
                                                description: exam.description || '',
                                                subject: exam.subject,
                                                groupId: exam.group.id,
                                                examDate: new Date(exam.examDate).toISOString().slice(0, 16),
                                                duration: exam.duration.toString(),
                                                totalMarks: exam.totalMarks.toString()
                                            });
                                            setShowForm(true);
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        تعديل
                                    </Button>
                                    <Button
                                        onClick={() => deleteExam(exam.id)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        حذف
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد امتحانات</h3>
                        <p className="text-gray-600 mb-4">لم تقم بإضافة أي امتحانات بعد</p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة أول امتحان
                        </Button>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}