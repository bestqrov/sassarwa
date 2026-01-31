'use client';

import { useState } from 'react';
import { HelpCircle, MessageCircle, FileText, Phone, Mail, ChevronDown, ChevronUp, Search } from 'lucide-react';
import TeacherLayout from '../layout';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQ[] = [
    {
        id: '1',
        question: 'كيف يمكنني إضافة واجب منزلي جديد؟',
        answer: 'لإضافة واجب منزلي جديد، انتقل إلى صفحة "الواجبات" من القائمة الجانبية، ثم انقر على زر "إضافة واجب جديد". املأ التفاصيل المطلوبة مثل العنوان، الوصف، تاريخ التسليم، والمجموعة المستهدفة.',
        category: 'الواجبات'
    },
    {
        id: '2',
        question: 'كيف أقوم بتسجيل حضور الطلاب؟',
        answer: 'في صفحة "الحضور"، اختر التاريخ والمجموعة، ثم انقر على أسماء الطلاب الحاضرين. يمكنك أيضًا استخدام زر "تحديد الكل" لتسجيل حضور جميع الطلاب، أو إلغاء تحديد الطلاب الغائبين.',
        category: 'الحضور'
    },
    {
        id: '3',
        question: 'كيف أضيف امتحانًا جديدًا؟',
        answer: 'انتقل إلى صفحة "الامتحانات"، انقر على "إضافة امتحان جديد"، ثم املأ معلومات الامتحان مثل الموضوع، التاريخ، الوقت، والمجموعة. يمكنك أيضًا إضافة ملاحظات إضافية.',
        category: 'الامتحانات'
    },
    {
        id: '4',
        question: 'كيف أرى تقارير أدائي؟',
        answer: 'في صفحة "التقارير"، يمكنك عرض إحصائيات مفصلة عن الطلاب، المجموعات، معدلات الحضور، والإيرادات. يمكنك تحميل التقارير بتنسيق PDF للمراجعة لاحقًا.',
        category: 'التقارير'
    },
    {
        id: '5',
        question: 'كيف أغير إعدادات الإشعارات؟',
        answer: 'انتقل إلى صفحة "الإعدادات"، ثم اختر قسم "إعدادات الإشعارات". يمكنك تفعيل أو إلغاء تفعيل الإشعارات للبريد الإلكتروني، الرسائل الفورية، والرسائل النصية.',
        category: 'الإعدادات'
    },
    {
        id: '6',
        question: 'كيف أتواصل مع الإدارة؟',
        answer: 'يمكنك التواصل مع الإدارة من خلال صفحة "الإشعارات" حيث يمكنك إرسال رسائل، أو استخدام معلومات الاتصال المتاحة في صفحة "المساعدة".',
        category: 'الاتصال'
    },
    {
        id: '7',
        question: 'ما هي سياسة الدفع للأساتذة؟',
        answer: 'يتم الدفع حسب نوع العقد المحدد في ملفك الشخصي. يمكن أن يكون بالساعة، ثابت، أو نسبة مئوية. تتم عملية الدفع شهريًا في نهاية كل شهر.',
        category: 'الدفع'
    },
    {
        id: '8',
        question: 'كيف أقوم بتحديث معلوماتي الشخصية؟',
        answer: 'في صفحة "الملف الشخصي"، انقر على زر "تعديل الملف" لتحديث معلوماتك الشخصية، التخصصات، والمستويات التي تدرسها.',
        category: 'الملف الشخصي'
    }
];

const categories = ['الكل', 'الواجبات', 'الحضور', 'الامتحانات', 'التقارير', 'الإعدادات', 'الاتصال', 'الدفع', 'الملف الشخصي'];

export default function TeacherHelpPage() {
    const [activeTab, setActiveTab] = useState('help');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'الكل' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (faqId: string) => {
        setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
    };

    return (
        <TeacherLayout activeTab={activeTab} onTabChange={setActiveTab}>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">المساعدة والدعم</h1>
                    <p className="text-gray-600 mt-2">كل ما تحتاجه لاستخدام النظام بفعالية</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="البحث في الأسئلة الشائعة..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">الدردشة المباشرة</h3>
                        <p className="text-gray-600 mb-4">تواصل مع الدعم الفني مباشرة</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            بدء المحادثة
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">دليل المستخدم</h3>
                        <p className="text-gray-600 mb-4">دليل شامل لاستخدام النظام</p>
                        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            تحميل الدليل
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">الدعم الهاتفي</h3>
                        <p className="text-gray-600 mb-4">اتصل بنا للمساعدة الفورية</p>
                        <div className="text-sm text-gray-600">
                            <p>+212 6XX XXX XXX</p>
                            <p className="text-xs">متوفر من 9 صباحًا إلى 6 مساءً</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">الأسئلة الشائعة</h3>
                    </div>

                    {filteredFAQs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFAQs.map(faq => (
                                <div key={faq.id} className="border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                {faq.category}
                                            </span>
                                            <span className="font-medium text-gray-900">{faq.question}</span>
                                        </div>
                                        {expandedFAQ === faq.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedFAQ === faq.id && (
                                        <div className="px-4 pb-4">
                                            <div className="border-t border-gray-200 pt-4">
                                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">لا توجد نتائج مطابقة لبحثك</p>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">معلومات الاتصال</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-900">البريد الإلكتروني</p>
                                <p className="text-gray-600">support@arwaeduc.ma</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-gray-900">الهاتف</p>
                                <p className="text-gray-600">+212 6XX XXX XXX</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>ملاحظة:</strong> للاستفسارات الطارئة أو المشاكل الفنية، يرجى الاتصال بنا مباشرة.
                            نحن نسعى للرد على جميع الاستفسارات خلال 24 ساعة.
                        </p>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}