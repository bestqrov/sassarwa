'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Edit, Save, X } from 'lucide-react';
import StudentLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface StudentProfile {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    cin?: string;
    address?: string;
    schoolLevel?: string;
    currentSchool?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function StudentProfile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<StudentProfile>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (activeTab === 'profile') {
            fetchProfile();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/students/profile');
            setProfile(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setFormData(profile || {});
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData(profile || {});
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.patch('/students/profile', formData);
            setProfile(response.data);
            setEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const renderProfile = () => (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {profile?.name} {profile?.surname}
                            </h2>
                            <p className="text-gray-600">{profile?.email}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                                profile?.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {profile?.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>
                    </div>
                    {!editing && (
                        <Button onClick={handleEdit} variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            تعديل
                        </Button>
                    )}
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">معلومات شخصية</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الاسم الأول
                        </label>
                        {editing ? (
                            <Input
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                placeholder="أدخل الاسم الأول"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile?.name || 'غير محدد'}
                            </p>
                        )}
                    </div>

                    {/* Surname */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الاسم العائلي
                        </label>
                        {editing ? (
                            <Input
                                name="surname"
                                value={formData.surname || ''}
                                onChange={handleChange}
                                placeholder="أدخل الاسم العائلي"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile?.surname || 'غير محدد'}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            البريد الإلكتروني
                        </label>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم الهاتف
                        </label>
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <Input
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    placeholder="أدخل رقم الهاتف"
                                    className="flex-1"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                    {profile?.phone || 'غير محدد'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CIN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم البطاقة الوطنية
                        </label>
                        {editing ? (
                            <Input
                                name="cin"
                                value={formData.cin || ''}
                                onChange={handleChange}
                                placeholder="أدخل رقم البطاقة الوطنية"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile?.cin || 'غير محدد'}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان
                        </label>
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <Input
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    placeholder="أدخل العنوان"
                                    className="flex-1"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                    {profile?.address || 'غير محدد'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* School Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المستوى الدراسي
                        </label>
                        {editing ? (
                            <select
                                name="schoolLevel"
                                value={formData.schoolLevel || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">اختر المستوى الدراسي</option>
                                <option value="ابتدائي">ابتدائي</option>
                                <option value="إعدادي">إعدادي</option>
                                <option value="ثانوي">ثانوي</option>
                                <option value="جامعي">جامعي</option>
                            </select>
                        ) : (
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                    {profile?.schoolLevel || 'غير محدد'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Current School */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المدرسة الحالية
                        </label>
                        {editing ? (
                            <Input
                                name="currentSchool"
                                value={formData.currentSchool || ''}
                                onChange={handleChange}
                                placeholder="أدخل اسم المدرسة"
                            />
                        ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile?.currentSchool || 'غير محدد'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Edit Actions */}
                {editing && (
                    <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            إلغاء
                        </Button>
                    </div>
                )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الحساب</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">تاريخ الإنشاء:</span>
                        <p className="text-gray-900 mt-1">
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-MA') : 'غير محدد'}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">آخر تحديث:</span>
                        <p className="text-gray-900 mt-1">
                            {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('ar-MA') : 'غير محدد'}
                        </p>
                    </div>
                </div>
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
            {activeTab === 'profile' && renderProfile()}
        </StudentLayout>
    );
}