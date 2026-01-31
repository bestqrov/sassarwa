'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit, Camera } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import notifications from '@/lib/utils/notifications';

interface TeacherProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cin?: string;
    dob?: string;
    gender?: string;
    picture?: string;
    status: string;
    role: string;
    address?: string;
    schoolLevel?: string;
    certification?: string;
    hourlyRate: number;
    paymentType: string;
    commission?: number;
    specialties: string[];
    levels: string[];
    socialMedia?: any;
    createdAt: string;
    updatedAt: string;
}

export default function TeacherProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        schoolLevel: '',
        certification: '',
        hourlyRate: '',
        specialties: [] as string[],
        levels: [] as string[]
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers/profile');
            const teacherData = response.data;
            setProfile(teacherData);

            setFormData({
                name: teacherData.name || '',
                email: teacherData.email || '',
                phone: teacherData.phone || '',
                address: teacherData.address || '',
                schoolLevel: teacherData.schoolLevel || '',
                certification: teacherData.certification || '',
                hourlyRate: teacherData.hourlyRate?.toString() || '',
                specialties: teacherData.specialties || [],
                levels: teacherData.levels || []
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            notifications.error('فشل في تحميل الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                schoolLevel: formData.schoolLevel,
                certification: formData.certification,
                hourlyRate: parseFloat(formData.hourlyRate) || 0,
                specialties: formData.specialties,
                levels: formData.levels
            };

            await api.put('/teachers/profile', updateData);

            setProfile(prev => prev ? { ...prev, ...updateData } : null);
            setIsEditing(false);
            notifications.success('تم حفظ التغييرات بنجاح');
        } catch (error) {
            console.error('Failed to save profile:', error);
            notifications.error('فشل في حفظ التغييرات');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                schoolLevel: profile.schoolLevel || '',
                certification: profile.certification || '',
                hourlyRate: profile.hourlyRate?.toString() || '',
                specialties: profile.specialties || [],
                levels: profile.levels || []
            });
        }
        setIsEditing(false);
    };

    const addSpecialty = () => {
        const specialty = prompt('أدخل التخصص الجديد:');
        if (specialty && !formData.specialties.includes(specialty)) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, specialty]
            }));
        }
    };

    const removeSpecialty = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter(s => s !== specialty)
        }));
    };

    const addLevel = () => {
        const level = prompt('أدخل المستوى الجديد:');
        if (level && !formData.levels.includes(level)) {
            setFormData(prev => ({
                ...prev,
                levels: [...prev.levels, level]
            }));
        }
    };

    const removeLevel = (level: string) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.filter(l => l !== level)
        }));
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

    if (!profile) {
        return (
            <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="text-center py-12">
                    <p className="text-gray-600">فشل في تحميل الملف الشخصي</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
                        <p className="text-gray-600">إدارة معلوماتك الشخصية</p>
                    </div>
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            تعديل الملف
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSave}
                                isLoading={saving}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                حفظ
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                disabled={saving}
                            >
                                إلغاء
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Picture & Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {profile.picture ? (
                                        <img
                                            src={profile.picture}
                                            alt={profile.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-blue-600" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                                <p className="text-gray-600 mb-4">{profile.email}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {profile.status === 'Active' ? 'نشط' : 'غير نشط'}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">الأجر بالساعة</span>
                                    <span className="font-semibold text-gray-900">
                                        {profile.hourlyRate} درهم
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">نوع الدفع</span>
                                    <span className="font-semibold text-gray-900">
                                        {profile.paymentType === 'HOURLY' ? 'بالساعة' :
                                         profile.paymentType === 'FIXED' ? 'ثابت' : 'نسبة مئوية'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">تاريخ الانضمام</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(profile.createdAt).toLocaleDateString('ar-MA')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات الشخصية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الاسم الكامل
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <p className="text-gray-900 py-2">{profile.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="أدخل رقم هاتفك"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.phone || 'غير محدد'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        العنوان
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            placeholder="أدخل عنوانك"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.address || 'غير محدد'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات المهنية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المستوى التعليمي
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.schoolLevel}
                                            onChange={(e) => setFormData(prev => ({ ...prev, schoolLevel: e.target.value }))}
                                            placeholder="مثال: باكالوريا"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.schoolLevel || 'غير محدد'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الشهادات
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.certification}
                                            onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                                            placeholder="أدخل شهاداتك"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.certification || 'غير محدد'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الأجر بالساعة
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                                            placeholder="أدخل الأجر بالساعة"
                                            min="0"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{profile.hourlyRate} درهم</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Specialties and Levels */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">التخصصات والمستويات</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            التخصصات
                                        </label>
                                        {isEditing && (
                                            <button
                                                onClick={addSpecialty}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                + إضافة
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(isEditing ? formData.specialties : profile.specialties)?.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                            >
                                                {specialty}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeSpecialty(specialty)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </span>
                                        )) || (
                                            <p className="text-gray-500 text-sm">لا توجد تخصصات محددة</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            المستويات
                                        </label>
                                        {isEditing && (
                                            <button
                                                onClick={addLevel}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                + إضافة
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(isEditing ? formData.levels : profile.levels)?.map((level, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                            >
                                                {level}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeLevel(level)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </span>
                                        )) || (
                                            <p className="text-gray-500 text-sm">لا توجد مستويات محددة</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}