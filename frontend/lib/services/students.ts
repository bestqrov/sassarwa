import api from '../api';
import type { Student, StudentFormData, ApiResponse } from '@/types';

export interface StudentGroup {
    id: string;
    name: string;
    subject: string;
    level: string;
    room?: string;
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    teacher: {
        name: string;
        email?: string;
    };
    status: string;
}

export interface AttendanceRecord {
    id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    group: {
        name: string;
        subject: string;
    };
    session?: {
        startTime: string;
        endTime: string;
        room?: string;
    };
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isRead: boolean;
    createdAt: string;
    relatedTo?: {
        type: 'course' | 'attendance' | 'payment' | 'general';
        id?: string;
        name?: string;
    };
}

export interface StudentStats {
    totalCourses: number;
    totalAttendance: number;
    upcomingSessions: number;
    unreadNotifications: number;
}

export interface CreateStudentResponse extends Student {
    generatedPassword?: string;
}

export async function getStudents(): Promise<Student[]> {
    const response = await api.get<ApiResponse<Student[]>>('/students');
    return response.data.data;
}

export async function getStudentById(id: string): Promise<Student> {
    const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
}

export async function createStudent(data: StudentFormData): Promise<CreateStudentResponse> {
    const response = await api.post<ApiResponse<CreateStudentResponse>>('/students', data);
    return response.data.data;
}

export async function updateStudent(id: string, data: Partial<StudentFormData>): Promise<Student> {
    const response = await api.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data.data;
}

export async function deleteStudent(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
}

export async function searchStudents(query: string): Promise<Student[]> {
    const response = await api.get<ApiResponse<Student[]>>(`/students?search=${encodeURIComponent(query)}`);
    return response.data.data;
}

export async function getStudentAnalytics() {
    const response = await api.get<ApiResponse<{
        totalStudents: number;
        totalInscriptions: number;
        totalRevenue: number;
        recentInscriptions: any[];
    }>>('/students/analytics');
    return response.data.data;
}

// Student portal functions
export async function getStudentProfile(): Promise<Student> {
    const response = await api.get<ApiResponse<Student>>('/students/profile');
    return response.data.data;
}

export async function updateStudentProfile(data: Partial<Student>): Promise<Student> {
    const response = await api.patch<ApiResponse<Student>>('/students/profile', data);
    return response.data.data;
}

export async function getStudentCourses(): Promise<StudentGroup[]> {
    const response = await api.get<ApiResponse<StudentGroup[]>>('/students/courses');
    return response.data.data;
}

export async function getStudentAttendance(): Promise<AttendanceRecord[]> {
    const response = await api.get<ApiResponse<AttendanceRecord[]>>('/students/attendance');
    return response.data.data;
}

export async function getStudentNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>('/students/notifications');
    return response.data.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
    await api.patch(`/students/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
    await api.patch('/students/notifications/read-all');
}

export async function getStudentStats(): Promise<StudentStats> {
    const response = await api.get<ApiResponse<StudentStats>>('/students/stats');
    return response.data.data;
}

export async function getUpcomingSessions(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>('/students/upcoming-sessions');
    return response.data.data;
}
