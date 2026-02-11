'use client';

import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    School,
    Palette,
    Database,
    Save,
    Download,
    Upload,
    CheckCircle,
    AlertCircle,
    Sun,
    Moon,
    Monitor,
    Users,
    Eye,
    EyeOff
} from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import api from '@/lib/api';
import useAuthStore from '@/store/useAuthStore';
import { BackupService } from '@/lib/utils/backup';
import { getStudents } from '@/lib/services/students';
import { getInscriptions } from '@/lib/services/inscriptions';
import { getPayments } from '@/lib/services/payments';
import { getAllUsers } from '@/lib/services/users';
import notifications from '@/lib/utils/notifications';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'SECRETARY';
    avatar?: string;
    gsm?: string;
    whatsapp?: string;
    address?: string;
    schoolLevel?: string;
    certification?: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'backup' | 'users'>('profile');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // School Profile State
    const [schoolProfile, setSchoolProfile] = useState({
        schoolName: 'INSTITUT INJAHI',
        address: 'Ouarzazate, Maroc',
        phone: '+212 XXX-XXXXXX',
        email: 'contact@injahi.com',
        director: '',
        logo: '',
    });

    // Theme State
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
    const [accentColor, setAccentColor] = useState('#3B82F6');

    // Users State
    const [adminUser, setAdminUser] = useState<User | null>(null);
    const [secretaryUser, setSecretaryUser] = useState<User | null>(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [secretaryPassword, setSecretaryPassword] = useState('');
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [showSecretaryPassword, setShowSecretaryPassword] = useState(false);

    // Load saved school profile on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('school-profile');
        if (savedProfile) {
            try {
                setSchoolProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error('Failed to load school profile', e);
            }
        }
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            console.log('Fetching users with token:', token ? 'Token exists' : 'No token');

            if (!token) {
                setError('Vous devez être connecté pour accéder à cette page.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            // Get current logged-in user (works for both ADMIN and SECRETARY)
            const meResponse = await api.get('/auth/me');

            const currentUser = meResponse.data.data;
            console.log('Current user:', currentUser);

            // If current user is ADMIN, set as admin user
            if (currentUser.role === 'ADMIN') {
                setAdminUser(currentUser);
            }

            // Try to fetch secretary user (only ADMIN can do this)
            try {
                const secretariesResponse = await api.get('/users/secretaries');

                const secretaries = secretariesResponse.data.data;
                console.log('Secretaries:', secretaries);

                if (secretaries && secretaries.length > 0) {
                    setSecretaryUser(secretaries[0]); // Get first secretary
                }
            } catch (secErr) {
                console.log('Could not fetch secretaries (might not be admin):', secErr);
                // If current user is SECRETARY, set as secretary user
                if (currentUser.role === 'SECRETARY') {
                    setSecretaryUser(currentUser);
                }
            }

        } catch (err: any) {
            console.error('Failed to fetch users', err);
            console.error('Error response:', err.response?.data);

            // Check if it's an authentication error
            if (err.response?.status === 401 || err.response?.data?.message?.includes('Authentication')) {
                setError('Session expirée. Redirection...');
                localStorage.removeItem('accessToken');
                setTimeout(() => {
                    window.location.href = 'https://arwaeduc.enovazoneacadimeca.com';
                }, 2000);
            } else {
                setError(`Erreur lors du chargement des utilisateurs: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleSchoolProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchoolProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSchoolProfile = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Save to localStorage
            localStorage.setItem('school-profile', JSON.stringify(schoolProfile));
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setSuccess('Profil de l\'école enregistré avec succès');

            // Trigger a custom event to notify sidebar of logo change
            window.dispatchEvent(new Event('school-profile-updated'));
        } catch (err: any) {
            setError('Échec de l\'enregistrement du profil');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTheme = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement theme saving to localStorage or API
            localStorage.setItem('app-theme', theme);
            localStorage.setItem('accent-color', accentColor);
            await new Promise(resolve => setTimeout(resolve, 500));
            setSuccess('Thème enregistré avec succès');
        } catch (err: any) {
            setError('Échec de l\'enregistrement du thème');
        } finally {
            setSaving(false);
        }
    };

    const handleBackup = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Fetch all data
            const [students, inscriptions, payments, users] = await Promise.all([
                getStudents(),
                getInscriptions(),
                getPayments(),
                getAllUsers()
            ]);

            // Create backup
            const backup = BackupService.createBackup(students, inscriptions, payments, users);

            // Export to JSON
            BackupService.exportToJSON(backup);

            notifications.success('تم إنشاء النسخة الاحتياطية بنجاح');
            setSuccess('تم إنشاء النسخة الاحتياطية بنجاح');
        } catch (err: any) {
            console.error('Backup error:', err);
            notifications.error('فشل في إنشاء النسخة الاحتياطية');
            setError('فشل في إنشاء النسخة الاحتياطية');
        } finally {
            setSaving(false);
        }
    };

    const handleExportStudentsCSV = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const students = await getStudents();
            BackupService.exportStudentsToCSV(students);
            notifications.success('تم تصدير قائمة الطلاب بنجاح');
            setSuccess('تم تصدير قائمة الطلاب بنجاح');
        } catch (err: any) {
            console.error('Export error:', err);
            notifications.error('فشل في تصدير قائمة الطلاب');
            setError('فشل في تصدير قائمة الطلاب');
        } finally {
            setSaving(false);
        }
    };

    const handleRestore = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // TODO: Implement restore API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess('Restauration effectuée avec succès');
        } catch (err: any) {
            setError('Échec de la restauration');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateUser = async (user: User | null, password?: string) => {
        if (!user) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const data: any = {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                gsm: user.gsm,
                whatsapp: user.whatsapp,
                address: user.address,
                schoolLevel: user.schoolLevel,
                certification: user.certification
            };

            if (password && password.trim() !== '') {
                data.password = password;
            }

            await api.put(`/users/${user.id}`, data);

            // If we updated the currently logged in user, refresh global state
            const currentUser = useAuthStore.getState().user;
            if (currentUser && currentUser.id === user.id) {
                await useAuthStore.getState().getMe();
            }

            setSuccess(`Compte ${user.role === 'ADMIN' ? 'Administrateur' : 'Secrétaire'} mis à jour avec succès`);
            if (user.role === 'ADMIN') setAdminPassword('');
            if (user.role === 'SECRETARY') setSecretaryPassword('');
            fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Échec de la mise à jour du compte');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile' as const, label: 'Profil École', icon: School },
        { id: 'users' as const, label: 'Utilisateurs', icon: Users },
        { id: 'theme' as const, label: 'Thème', icon: Palette },
        { id: 'backup' as const, label: 'Sauvegarde', icon: Database },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
                    <p className="text-gray-600 mt-1">Gérer les paramètres de l'application</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                    <SettingsIcon className="text-blue-600" size={32} />
                </div>
            </div>

            {/* Notifications */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-green-800">
                        <p className="font-semibold mb-1">Succès</p>
                        <p>Les paramètres ont été mis à jour avec succès.</p>
                    </div>
                </div>
            )}

            {/* Important Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important</p>
                    <p>Assurez-vous de créer des sauvegardes régulières de vos données. Il est recommandé de faire une sauvegarde avant toute modification importante du système.</p>
                </div>
            </div>
        </div>
    );
}
