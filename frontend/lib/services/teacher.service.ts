import api from '@/lib/api';

export interface TeacherProfile {
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

export interface Group {
    id: string;
    name: string;
    type: string;
    level?: string;
    subject?: string;
    formation?: any;
    room?: string;
    whatsappUrl?: string;
    status: string;
    timeSlots?: any[];
    sessions?: any[];
    students: Student[];
    formation?: any;
    _count: {
        students: number;
    };
}

export interface Student {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    status: string;
    schoolLevel?: string;
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    groupId: string;
    date: string;
    status: string;
    notes?: string;
    student: Student;
    group: {
        id: string;
        name: string;
        formation?: {
            name: string;
            level: string;
        };
    };
}

export interface Homework {
    id: string;
    title: string;
    description?: string;
    groupId: string;
    teacherId: string;
    dueDate: string;
    attachments: string[];
    maxScore: number;
    createdAt: string;
    updatedAt: string;
    group: {
        id: string;
        name: string;
        formation?: {
            name: string;
            level: string;
        };
    };
    submissions: HomeworkSubmission[];
    _count: {
        submissions: number;
    };
}

export interface HomeworkSubmission {
    id: string;
    student: Student;
    submittedAt: string;
    attachments: string[];
    notes?: string;
    score?: number;
    feedback?: string;
}

export interface Exam {
    id: string;
    title: string;
    description?: string;
    groupId: string;
    teacherId: string;
    date: string;
    duration: number;
    maxScore: number;
    type: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
    group: {
        id: string;
        name: string;
        formation?: {
            name: string;
            level: string;
        };
    };
    results: ExamResult[];
    _count: {
        results: number;
    };
}

export interface ExamResult {
    id: string;
    student: Student;
    score: number;
    grade?: string;
    notes?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    recipientId?: string;
    recipientType?: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherSettings {
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

export interface ReportData {
    totalStudents: number;
    totalGroups: number;
    totalSessions: number;
    totalHours: number;
    attendanceRate: number;
    monthlyRevenue: number;
    groupPerformance: {
        name: string;
        students: number;
        attendanceRate: number;
    }[];
    recentActivity: {
        description: string;
        date: string;
    }[];
}

class TeacherAPI {
    // Authentication
    async login(email: string, password: string) {
        const response = await api.post('/teachers/login', { email, password });
        return response.data;
    }

    // Profile Management
    async getProfile(): Promise<TeacherProfile> {
        const response = await api.get('/teachers/profile');
        return response.data;
    }

    async updateProfile(data: Partial<TeacherProfile>): Promise<TeacherProfile> {
        const response = await api.put('/teachers/profile', data);
        return response.data;
    }

    async changePassword(currentPassword: string, newPassword: string) {
        const response = await api.put('/teachers/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    }

    // Groups Management
    async getGroups(): Promise<Group[]> {
        const response = await api.get('/teachers/groups');
        return response.data;
    }

    async getGroupDetails(groupId: string): Promise<Group> {
        const response = await api.get(`/teachers/groups/${groupId}`);
        return response.data;
    }

    // Attendance Management
    async getAttendance(params?: { groupId?: string; date?: string }): Promise<AttendanceRecord[]> {
        const response = await api.get('/teachers/attendance', { params });
        return response.data;
    }

    async markAttendance(groupId: string, date: string, attendanceData: any[]) {
        const response = await api.post('/teachers/attendance', {
            groupId,
            date,
            attendanceData
        });
        return response.data;
    }

    // Homework Management
    async getHomework(params?: { groupId?: string }): Promise<Homework[]> {
        const response = await api.get('/teachers/homework', { params });
        return response.data;
    }

    async createHomework(data: {
        title: string;
        description?: string;
        groupId: string;
        dueDate: string;
        attachments?: string[];
        maxScore?: number;
    }): Promise<Homework> {
        const response = await api.post('/teachers/homework', data);
        return response.data;
    }

    // Exams Management
    async getExams(params?: { groupId?: string; upcoming?: boolean }): Promise<Exam[]> {
        const response = await api.get('/teachers/exams', { params });
        return response.data;
    }

    async createExam(data: {
        title: string;
        description?: string;
        groupId: string;
        date: string;
        duration: number;
        maxScore?: number;
        type?: string;
        attachments?: string[];
    }): Promise<Exam> {
        const response = await api.post('/teachers/exams', data);
        return response.data;
    }

    // Notifications
    async getNotifications(params?: { read?: boolean; limit?: number }): Promise<Notification[]> {
        const response = await api.get('/teachers/notifications', { params });
        return response.data;
    }

    async markNotificationRead(notificationId: string) {
        const response = await api.put(`/teachers/notifications/${notificationId}/read`);
        return response.data;
    }

    // Settings
    async getSettings(): Promise<TeacherSettings> {
        const response = await api.get('/teachers/settings');
        return response.data;
    }

    async updateSettings(settings: Partial<TeacherSettings>): Promise<TeacherSettings> {
        const response = await api.put('/teachers/settings', settings);
        return response.data;
    }

    // Reports
    async getReports(params?: { startDate?: string; endDate?: string }): Promise<ReportData> {
        const response = await api.get('/teachers/reports', { params });
        return response.data;
    }

    async generateReport(type: 'attendance' | 'performance' | 'revenue', params?: { startDate?: string; endDate?: string }) {
        const response = await api.get(`/teachers/reports/${type}`, {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
}

const teacherAPI = new TeacherAPI();
export default teacherAPI;