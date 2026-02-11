'use client';
import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useSchoolProfile } from '@/hooks/useSchoolProfile';
import { GraduationCap, X } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const login = useAuthStore(state => state.login);
    const { profile, loading } = useSchoolProfile();

    useEffect(() => {
        const token = (typeof window !== 'undefined') ? localStorage.getItem('accessToken') : null;
        if (token) {
            // Already logged in logic
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const res = await login(email.trim(), password);
        if (!res.success) return setError(res.message || 'Login failed');

        const user = useAuthStore.getState().user;
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') router.push('/admin');
        else if (user?.role === 'SECRETARY') router.push('/secretary');
        else router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Arwa<span className="text-indigo-600">Educ</span>
                    </h1>
                    <p className="text-gray-600">Connectez-vous à votre compte</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <X size={20} className="text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Adresse e-mail"
                        />
                    </div>

                    <div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Mot de passe"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Se connecter
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Besoin d'aide ? Contactez-nous</p>
                    <div className="mt-2 space-y-1">
                        <p>
                            Email: <a href="mailto:contact@arwaeduc.com" className="text-indigo-600 hover:underline">contact@arwaeduc.com</a>
                        </p>
                        <p>
                            WhatsApp: <a href="https://wa.me/212608183886" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">+212 608183886</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
