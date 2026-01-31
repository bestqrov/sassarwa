'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, FileText, Users, Edit, Trash2 } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import notifications from '@/lib/utils/notifications';

interface Homework {
    id: string;
    title: string;
    description?: string;
    subject: string;
    dueDate: string;
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

export default function TeacherHomeworkPage() {
    const [activeTab, setActiveTab] = useState('homework');
    const [homework, setHomework] = useState<Homework[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        groupId: '',
        dueDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [homeworkResponse, groupsResponse] = await Promise.all([
                api.get('/teachers/profile'),
                api.get('/teachers/groups')
            ]);

            setHomework(homeworkResponse.data.homework || []);
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
            dueDate: ''
        });
        setEditingHomework(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.subject || !formData.groupId || !formData.dueDate) {
            notifications.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            setSaving(true);

            if (editingHomework) {
                // تحديث التمرين (سيتم إضافة endpoint لاحقاً)
                notifications.info('تحديث التمارين قيد التطوير');
            } else {
                // إنشاء تمرين جديد (سيتم إضافة endpoint لاحقاً)
                const homeworkData = {
                    title: formData.title,
                    description: formData.description,
                    subject: formData.subject,
                    groupId: formData.groupId,
                    dueDate: new Date(formData.dueDate).toISOString()
                };

                await api.post('/homework', homeworkData);
                notifications.success('تم إضافة التمرين بنجاح');
                resetForm();
                fetchData();
            }
        } catch (error) {
            console.error('Failed to save homework:', error);
            notifications.error('فشل في حفظ التمرين');
        } finally {
            setSaving(false);
        }
    };

    const deleteHomework = async (homeworkId: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا التمرين؟')) return;

        try {
            await api.delete(`/homework/${homeworkId}`);
            notifications.success('تم حذف التمرين بنجاح');
            fetchData();
        } catch (error) {
            console.error('Failed to delete homework:', error);
            notifications.error('فشل في حذف التمرين');
        }
    };

    const getStatusColor = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 bg-red-100';
        if (diffDays <= 1) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    const getStatusText = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'متأخر';
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
                        <h1 className="text-2xl font-bold text-gray-900">التمارين المنزلية</h1>
                        <p className="text-gray-600">إدارة التمارين والواجبات المنزلية</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة تمرين جديد
                    </Button>
                </div>

                {/* Homework Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingHomework ? 'تعديل التمرين' : 'إضافة تمرين جديد'}
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
                                            عنوان التمرين *
                                        </label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="أدخل عنوان التمرين"
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
                                        تاريخ التسليم *
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف التمرين
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="أدخل تفاصيل التمرين..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        isLoading={saving}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {editingHomework ? 'تحديث التمرين' : 'إضافة التمرين'}
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

                {/* Homework List */}
                {homework.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {homework.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{item.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>{item.group.name}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.dueDate)}`}>
                                        {getStatusText(item.dueDate)}
                                    </span>
                                </div>

                                {item.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Calendar className="w-4 h-4" />
                                    <span>تاريخ التسليم: {new Date(item.dueDate).toLocaleDateString('ar-MA')}</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            setEditingHomework(item);
                                            setFormData({
                                                title: item.title,
                                                description: item.description || '',
                                                subject: item.subject,
                                                groupId: item.group.id,
                                                dueDate: new Date(item.dueDate).toISOString().slice(0, 16)
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
                                        onClick={() => deleteHomework(item.id)}
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
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تمارين</h3>
                        <p className="text-gray-600 mb-4">لم تقم بإضافة أي تمارين منزلية بعد</p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة أول تمرين
                        </Button>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}