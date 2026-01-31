import bcrypt from 'bcrypt';
import { Student } from '@prisma/client';
import { prisma } from '../../config/database';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

export class StudentService {
    static async create(data: CreateStudentDto): Promise<Student & { generatedPassword?: string }> {
        // Generate password if not provided
        let password = data.password;
        let generatedPassword: string | undefined;

        if (!password) {
            // Generate password: first letter of name + random numbers
            const firstLetter = data.name.charAt(0).toUpperCase();
            const randomNumbers = Math.floor(1000 + Math.random() * 9000);
            generatedPassword = `${firstLetter}${randomNumbers}`;
            password = generatedPassword;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await prisma.student.create({
            data: {
                ...data,
                password: hashedPassword,
                status: 'active'
            }
        });

        return {
            ...student,
            generatedPassword
        };
    }

    static async findAll(): Promise<Student[]> {
        return prisma.student.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    static async findOne(id: string): Promise<Student> {
        const student = await prisma.student.findUnique({
            where: { id }
        });

        if (!student) {
            throw new Error('Student not found');
        }

        return student;
    }

    static async update(id: string, data: UpdateStudentDto): Promise<Student> {
        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return prisma.student.update({
            where: { id },
            data
        });
    }

    static async delete(id: string): Promise<void> {
        await prisma.student.delete({
            where: { id }
        });
    }

    // Student portal methods
    static async getStudentCourses(studentId: string) {
        // Get student's groups through inscriptions
        const inscriptions = await prisma.inscription.findMany({
            where: {
                studentId,
                type: 'SOUTIEN'
            },
            include: {
                groups: {
                    include: {
                        teacher: true,
                        timeSlots: true
                    }
                }
            }
        });

        return inscriptions.flatMap(inscription => inscription.groups);
    }

    static async getStudentAttendance(studentId: string) {
        return prisma.attendance.findMany({
            where: { studentId },
            include: {
                group: {
                    select: {
                        name: true,
                        subject: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    static async getStudentNotifications(studentId: string) {
        // For now, return empty array - can be implemented later with notification system
        return [];
    }

    static async markNotificationAsRead(studentId: string, notificationId: string): Promise<void> {
        // Implementation for notification system
    }

    static async markAllNotificationsAsRead(studentId: string): Promise<void> {
        // Implementation for notification system
    }

    static async getStudentStats(studentId: string) {
        const [courses, attendance] = await Promise.all([
            this.getStudentCourses(studentId),
            this.getStudentAttendance(studentId)
        ]);

        const totalCourses = courses.length;
        const totalAttendance = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'present').length;
        const percentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        // Get upcoming sessions (next 7 days)
        const upcomingSessions = await this.getUpcomingSessions(studentId);

        return {
            totalCourses,
            totalAttendance: percentage,
            upcomingSessions: upcomingSessions.length,
            unreadNotifications: 0 // Can be implemented later
        };
    }

    static async getUpcomingSessions(studentId: string) {
        const courses = await this.getStudentCourses(studentId);
        const upcomingSessions: any[] = [];

        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        for (const course of courses) {
            for (const timeSlot of course.timeSlots) {
                // This is a simplified implementation
                // In a real system, you'd need to calculate actual session dates
                const sessionDate = new Date();
                if (sessionDate >= now && sessionDate <= nextWeek) {
                    upcomingSessions.push({
                        id: `${course.id}-${timeSlot.day}`,
                        groupName: course.name,
                        subject: course.subject,
                        room: course.room,
                        startTime: timeSlot.startTime,
                        endTime: timeSlot.endTime,
                        teacher: course.teacher?.name || 'غير محدد'
                    });
                }
            }
        }

        return upcomingSessions.slice(0, 5); // Return next 5 sessions
    }

    static async validateCredentials(email: string, password: string): Promise<Student | null> {
        const student = await prisma.student.findUnique({
            where: { email }
        });

        if (!student || !student.password) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, student.password);
        if (!isValidPassword) {
            return null;
        }

        return student;
    }
}