'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from 'lucide-react';
import ParentLayout from '../layout';
import api from '@/lib/api';

interface ParentProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
    createdAt: string;
    childrenCount: number;
}

export default function ParentProfile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState<ParentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (activeTab === 'profile') {
            fetchProfile();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/parents/profile');
            setProfile(response.data);
            setFormData({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phone: response.data.phone || '',
                address: response.data.address || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.patch('/parents/profile', formData);
            setProfile(response.data);
            setEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone || '',
                address: profile.address || ''
            });
        }
        setEditing(false);
    };

    const renderProfile = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">الملف الشخصي</h2>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            تعديل
                        </button>
                    )}
                </div>

                {profile && (
                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-purple-600" />
                                    )}
                                </div>
                                {editing && (
                                    <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {profile.firstName} {profile.lastName}
                                </h3>
                                <p className="text-gray-600">{profile.email}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    عضو منذ {new Date(profile.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الاسم الأول
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الاسم الأخير
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.lastName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    البريد الإلكتروني
                                </label>
                                {editing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <p className="text-gray-900">{profile.email}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رقم الهاتف
                                </label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="أدخل رقم الهاتف"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <p className="text-gray-900">{profile.phone || 'غير محدد'}</p>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    العنوان
                                </label>
                                {editing ? (
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="أدخل العنوان"
                                    />
                                ) : (
                                    <div className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <p className="text-gray-900">{profile.address || 'غير محدد'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Actions */}
                        {editing && (
                            <div className="flex gap-4 pt-6 border-t">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    حفظ
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    إلغاء
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            {profile && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">عدد الأبناء</p>
                                <p className="text-2xl font-bold text-gray-900">{profile.childrenCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                                <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Phone className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">رقم الهاتف</p>
                                <p className="text-sm font-medium text-gray-900">{profile.phone || 'غير محدد'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الحساب</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">تاريخ الإنشاء</span>
                        <span className="font-medium">
                            {profile ? new Date(profile.createdAt).toLocaleDateString('ar-SA') : ''}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">نوع الحساب</span>
                        <span className="font-medium">ولي أمر</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">الحالة</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            نشط
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </ParentLayout>
        );
    }

    return (
        <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'profile' && renderProfile()}
        </ParentLayout>
    );
}