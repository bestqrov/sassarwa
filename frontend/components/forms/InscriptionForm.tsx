'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {
    Save,
    Printer,
    User,
    MapPin,
    Users,
    CreditCard,
    GraduationCap,
    BookOpen,
    Calculator,
    ShoppingCart,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';

interface InscriptionFormProps {
    onSuccess?: () => void;
    onSuccessRedirect?: string;
    onCancel?: () => void;
    initialType?: 'SOUTIEN' | 'FORMATION';
}

export default function InscriptionForm({
    onSuccess,
    onSuccessRedirect,
    onCancel,
    initialType = 'SOUTIEN'
}: InscriptionFormProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [lastRegisteredStudent, setLastRegisteredStudent] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [inscriptionType, setInscriptionType] = useState<'SOUTIEN' | 'FORMATION'>(initialType);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthDate: '',
        birthPlace: '',
        fatherName: '',
        motherName: '',
        cin: '',
        address: '',
        phone: '',
        parentName: '',
        parentPhone: '',
        parentRelation: '',
        schoolLevel: '',
        inscriptionType: initialType,
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        // Formation specific fields
        email: '',
        previousDiploma: '',
        motivation: '',
        objectives: '',
        // Soutien specific fields
        currentYear: '',
        subjects: [] as string[],
        schedule: '',
        transport: false,
        meals: false,
    });

    // Categories based on type
    const soutienCategories = [
        'Soutien Scolaire Primaire',
        'Soutien Scolaire Collège',
        'Soutien Scolaire Lycée',
        'Cours Particuliers',
        'Préparation Examens',
        'Stages Intensifs'
    ];

    const formationCategories = [
        'Développement Personnel',
        'Informatique',
        'Langues',
        'Comptabilité',
        'Gestion d\'Entreprise',
        'Marketing Digital',
        'Design Graphique',
        'Photographie',
        'Cuisine',
        'Autre'
    ];

    const categories = inscriptionType === 'SOUTIEN' ? soutienCategories : formationCategories;

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            inscriptionType,
            category: '' // Reset category when type changes
        }));
    }, [inscriptionType]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubjectChange = (subject: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            subjects: checked
                ? [...prev.subjects, subject]
                : prev.subjects.filter(s => s !== subject)
        }));
    };

    const validateForm = () => {
        const required = ['name', 'surname', 'phone', 'category', 'amount'];
        for (const field of required) {
            if (!formData[field as keyof typeof formData]) {
                setError(`Le champ ${field} est requis`);
                return false;
            }
        }

        if (inscriptionType === 'FORMATION' && !formData.email) {
            setError('L\'email est requis pour les formations');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Create student first
            const studentData = {
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                email: formData.email || undefined,
                cin: formData.cin || undefined,
                address: formData.address || undefined,
                birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
                birthPlace: formData.birthPlace || undefined,
                fatherName: formData.fatherName || undefined,
                motherName: formData.motherName || undefined,
                parentName: formData.parentName || undefined,
                parentPhone: formData.parentPhone || undefined,
                parentRelation: formData.parentRelation || undefined,
                schoolLevel: formData.schoolLevel || undefined,
                // Formation specific
                previousDiploma: formData.previousDiploma || undefined,
                motivation: formData.motivation || undefined,
                objectives: formData.objectives || undefined,
                // Soutien specific
                currentYear: formData.currentYear || undefined,
                subjects: formData.subjects.length > 0 ? formData.subjects : undefined,
                schedule: formData.schedule || undefined,
                transport: formData.transport || undefined,
                meals: formData.meals || undefined,
            };

            const studentResponse = await api.post('/students', studentData);
            const student = studentResponse.data.data;

            // Create inscription
            const inscriptionData = {
                studentId: student.id,
                type: inscriptionType,
                category: formData.category,
                amount: parseFloat(formData.amount),
                date: formData.date,
                note: formData.note || undefined,
            };

            await api.post('/inscriptions', inscriptionData);

            setLastRegisteredStudent(student);
            setRegistrationSuccess(true);
            setShowSuccessModal(true);

            // Reset form
            setFormData({
                name: '',
                surname: '',
                birthDate: '',
                birthPlace: '',
                fatherName: '',
                motherName: '',
                cin: '',
                address: '',
                phone: '',
                parentName: '',
                parentPhone: '',
                parentRelation: '',
                schoolLevel: '',
                inscriptionType: initialType,
                category: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                note: '',
                email: '',
                previousDiploma: '',
                motivation: '',
                objectives: '',
                currentYear: '',
                subjects: [],
                schedule: '',
                transport: false,
                meals: false,
            });

            if (onSuccess) onSuccess();
            if (onSuccessRedirect) {
                setTimeout(() => router.push(onSuccessRedirect), 2000);
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const printReceipt = () => {
        if (!lastRegisteredStudent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const receiptHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reçu d'Inscription</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .student-info { margin: 20px 0; }
                    .amount { font-size: 18px; font-weight: bold; color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>INSTITUT INJAHI</h1>
                    <p>Reçu d'Inscription</p>
                </div>
                <div class="student-info">
                    <p><strong>Étudiant:</strong> ${lastRegisteredStudent.name} ${lastRegisteredStudent.surname}</p>
                    <p><strong>Type:</strong> ${inscriptionType}</p>
                    <p><strong>Catégorie:</strong> ${formData.category}</p>
                    <p><strong>Montant:</strong> <span class="amount">${formData.amount} MAD</span></p>
                    <p><strong>Date:</strong> ${new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div style="margin-top: 50px; text-align: center;">
                    <p>Signature: ____________________</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(receiptHtml);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Inscription Étudiant</h1>
                </div>
                {onCancel && (
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Type Selection */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Type d'Inscription</h2>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="SOUTIEN"
                                checked={inscriptionType === 'SOUTIEN'}
                                onChange={(e) => setInscriptionType(e.target.value as 'SOUTIEN')}
                                className="mr-2"
                            />
                            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                            Soutien Scolaire
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="FORMATION"
                                checked={inscriptionType === 'FORMATION'}
                                onChange={(e) => setInscriptionType(e.target.value as 'FORMATION')}
                                className="mr-2"
                            />
                            <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                            Formation Professionnelle
                        </label>
                    </div>
                </div>

                {/* Student Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informations de l'Étudiant
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nom *"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                        <Input
                            label="Prénom *"
                            value={formData.surname}
                            onChange={(e) => handleInputChange('surname', e.target.value)}
                            required
                        />
                        <Input
                            label="Date de naissance"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        />
                        <Input
                            label="Lieu de naissance"
                            value={formData.birthPlace}
                            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                        />
                        <Input
                            label="CIN"
                            value={formData.cin}
                            onChange={(e) => handleInputChange('cin', e.target.value)}
                        />
                        <Input
                            label="Téléphone *"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                        />
                        {inscriptionType === 'FORMATION' && (
                            <Input
                                label="Email *"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                            />
                        )}
                        <Input
                            label="Adresse"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                        />
                        <Input
                            label="Niveau scolaire"
                            value={formData.schoolLevel}
                            onChange={(e) => handleInputChange('schoolLevel', e.target.value)}
                        />
                    </div>
                </div>

                {/* Parent Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Informations des Parents
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nom du père"
                            value={formData.fatherName}
                            onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        />
                        <Input
                            label="Nom de la mère"
                            value={formData.motherName}
                            onChange={(e) => handleInputChange('motherName', e.target.value)}
                        />
                        <Input
                            label="Nom du parent responsable"
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                        />
                        <Input
                            label="Téléphone du parent"
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                        />
                        <Input
                            label="Lien de parenté"
                            value={formData.parentRelation}
                            onChange={(e) => handleInputChange('parentRelation', e.target.value)}
                        />
                    </div>
                </div>

                {/* Type-specific fields */}
                {inscriptionType === 'SOUTIEN' && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Détails du Soutien Scolaire
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Année scolaire actuelle"
                                value={formData.currentYear}
                                onChange={(e) => handleInputChange('currentYear', e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Matières</label>
                                <div className="space-y-2">
                                    {['Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'Histoire-Géographie', 'Philosophie'].map(subject => (
                                        <label key={subject} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.subjects.includes(subject)}
                                                onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                                                className="mr-2"
                                            />
                                            {subject}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Input
                                label="Emploi du temps souhaité"
                                value={formData.schedule}
                                onChange={(e) => handleInputChange('schedule', e.target.value)}
                            />
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.transport}
                                        onChange={(e) => handleInputChange('transport', !formData.transport)}
                                        className="mr-2"
                                    />
                                    Transport
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.meals}
                                        onChange={(e) => handleInputChange('meals', !formData.meals)}
                                        className="mr-2"
                                    />
                                    Repas
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {inscriptionType === 'FORMATION' && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Détails de la Formation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Diplôme précédent"
                                value={formData.previousDiploma}
                                onChange={(e) => handleInputChange('previousDiploma', e.target.value)}
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Motivation</label>
                                <textarea
                                    value={formData.motivation}
                                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Pourquoi souhaitez-vous suivre cette formation ?"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs</label>
                                <textarea
                                    value={formData.objectives}
                                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Quels sont vos objectifs professionnels ?"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Inscription Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Détails de l'Inscription
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Montant (MAD) *"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            required
                        />
                        <Input
                            label="Date d'inscription"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes supplémentaires..."
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Inscription en cours...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Inscrire l'Étudiant
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription Réussie !</h2>
                            <p className="text-gray-600 mb-6">
                                L'étudiant {lastRegisteredStudent?.name} {lastRegisteredStudent?.surname} a été inscrit avec succès.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button onClick={printReceipt} className="flex items-center gap-2">
                                    <Printer className="h-4 w-4" />
                                    Imprimer Reçu
                                </Button>
                                <Button
                                    onClick={() => setShowSuccessModal(false)}
                                    variant="secondary"
                                >
                                    Fermer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}