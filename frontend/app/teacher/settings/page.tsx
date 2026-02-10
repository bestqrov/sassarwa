'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
import TeacherLayout from '../layout';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import notifications from '@/lib/utils/notifications';

interface TeacherSettings {
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        homeworkReminders: boolean;
        examReminders: boolean;
        paymentNotifications: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private' | 'students-only';
        showEmail: boolean;
        showPhone: boolean;
    };
    preferences: {
        language: 'ar' | 'fr' | 'en';
        theme: 'light' | 'dark' | 'auto';
        timezone: string;
        dateFormat: string;
        currency: string;
    };
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
    };
}

export default function TeacherSettingsPage() {
    const [activeTab, setActiveTab] = useState('settings');
    const [settings, setSettings] = useState<TeacherSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers/settings');
            setSettings(response.data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            notifications.error('فشل في تحميل الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (section: keyof TeacherSettings, data: any) => {
        if (!settings) return;

        try {
            setSaving(true);
            const updatedSettings = { ...settings, [section]: { ...settings[section], ...data } };
            await api.put('/teachers/settings', updatedSettings);
            setSettings(updatedSettings);
            notifications.success('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            console.error('Failed to update settings:', error);
            notifications.error('فشل في حفظ الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            notifications.error('كلمة المرور الجديدة غير متطابقة');
            return;
        }

        if (newPassword.length < 6) {
            notifications.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        try {
            setSaving(true);
            await api.put('/teachers/change-password', {
                currentPassword,
                newPassword
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            notifications.success('تم تغيير كلمة المرور بنجاح');
        } catch (error) {
            console.error('Failed to change password:', error);
            notifications.error('فشل في تغيير كلمة المرور');
        } finally {
            setSaving(false);
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

    if (!settings) {
        return (
            <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="text-center py-12">
                    <p className="text-gray-600">فشل في تحميل الإعدادات</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
                        <p className="text-gray-600">إدارة إعدادات حسابك وتفضيلاتك</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifications Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">إعدادات الإشعارات</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={(e) => updateSettings('notifications', { email: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">الإشعارات الفورية</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.push}
                                    onChange={(e) => updateSettings('notifications', { push: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">الرسائل النصية</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.sms}
                                    onChange={(e) => updateSettings('notifications', { sms: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">تذكيرات الواجبات</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.homeworkReminders}
                                    onChange={(e) => updateSettings('notifications', { homeworkReminders: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">تذكيرات الامتحانات</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.examReminders}
                                    onChange={(e) => updateSettings('notifications', { examReminders: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">إشعارات الدفع</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.paymentNotifications}
                                    onChange={(e) => updateSettings('notifications', { paymentNotifications: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-bold text-gray-900">إعدادات الخصوصية</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رؤية الملف الشخصي
                                </label>
                                <select
                                    value={settings.privacy.profileVisibility}
                                    onChange={(e) => updateSettings('privacy', { profileVisibility: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="public">عام</option>
                                    <option value="students-only">للطلاب فقط</option>
                                    <option value="private">خاص</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">إظهار البريد الإلكتروني</label>
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.showEmail}
                                    onChange={(e) => updateSettings('privacy', { showEmail: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">إظهار رقم الهاتف</label>
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.showPhone}
                                    onChange={(e) => updateSettings('privacy', { showPhone: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Palette className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900">التفضيلات</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اللغة
                                </label>
                                <select
                                    value={settings.preferences.language}
                                    onChange={(e) => updateSettings('preferences', { language: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="ar">العربية</option>
                                    <option value="fr">الفرنسية</option>
                                    <option value="en">الإنجليزية</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المظهر
                                </label>
                                <select
                                    value={settings.preferences.theme}
                                    onChange={(e) => updateSettings('preferences', { theme: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="light">فاتح</option>
                                    <option value="dark">داكن</option>
                                    <option value="auto">تلقائي</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المنطقة الزمنية
                                </label>
                                <select
                                    value={settings.preferences.timezone}
                                    onChange={(e) => updateSettings('preferences', { timezone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Africa/Casablanca">المغرب (GMT+1)</option>
                                    <option value="Europe/Paris">فرنسا (GMT+1)</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-bold text-gray-900">إعدادات الأمان</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">التحقق بخطوتين</label>
                                <input
                                    type="checkbox"
                                    checked={settings.security.twoFactorEnabled}
                                    onChange={(e) => updateSettings('security', { twoFactorEnabled: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    مهلة الجلسة (دقائق)
                                </label>
                                <select
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => updateSettings('security', { sessionTimeout: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="15">15 دقيقة</option>
                                    <option value="30">30 دقيقة</option>
                                    <option value="60">ساعة</option>
                                    <option value="240">4 ساعات</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">تغيير كلمة المرور</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                كلمة المرور الحالية
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="أدخل كلمة المرور الحالية"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                كلمة المرور الجديدة
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="أدخل كلمة المرور الجديدة"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                تأكيد كلمة المرور الجديدة
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="أعد إدخال كلمة المرور الجديدة"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button
                            onClick={changePassword}
                            isLoading={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            تغيير كلمة المرور
                        </Button>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}