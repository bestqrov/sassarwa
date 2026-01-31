import prisma from '../../config/database';
import bcrypt from 'bcryptjs';

export interface CreateTeacherData {
    name: string;
    email?: string;
    password?: string;
    phone?: string;
    cin?: string;
    dob?: Date | string;
    gender?: string;
    picture?: string;
    status?: string;
    socialMedia?: any;
    hourlyRate?: number;
    paymentType?: string;
    commission?: number;
    specialties?: string[];
    levels?: string[];
}

export const createTeacher = async (data: CreateTeacherData) => {
    // Generate password if not provided
    let password = data.password;
    if (!password) {
        // Generate a random password: first letter of name + random numbers
        const firstLetter = data.name.charAt(0).toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        password = `${firstLetter}${randomNum}`;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.teacher.create({
        data: {
            ...data,
            password: hashedPassword,
            role: 'TEACHER'
        }
    });
};

export const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { groups: true }
            }
        }
    });
};

export const updateTeacher = async (id: string, data: Partial<CreateTeacherData>) => {
    return await prisma.teacher.update({
        where: { id },
        data
    });
};

export const deleteTeacher = async (id: string) => {
    return await prisma.teacher.delete({
        where: { id }
    });
};

export const calculateMonthlyTeacherExpenses = async () => {
    // Get all teachers with their groups
    const teachers = await prisma.teacher.findMany({
        include: {
            groups: {
                include: {
                    students: true,
                    _count: {
                        select: { students: true }
                    }
                }
            }
        }
    });

    let totalExpenses = 0;

    for (const teacher of teachers) {
        let teacherExpense = 0;

        if (teacher.paymentType === 'FIXED') {
            // Fixed salary - pay the hourlyRate as monthly salary
            teacherExpense = teacher.hourlyRate || 0;
        } else if (teacher.paymentType === 'HOURLY') {
            // Hourly rate - estimate based on groups
            // Assume each group has 8 hours per month (2 hours/week * 4 weeks)
            const totalHours = teacher.groups.length * 8;
            teacherExpense = totalHours * (teacher.hourlyRate || 0);
        } else if (teacher.paymentType === 'PERCENTAGE') {
            // Percentage based - calculate from student count
            // This is an estimate - actual would need inscription amounts
            const totalStudents = teacher.groups.reduce((sum, group) => sum + group._count.students, 0);
            // Estimate: 500 MAD per student * commission percentage
            const estimatedRevenue = totalStudents * 500;
            teacherExpense = estimatedRevenue * ((teacher.commission || 0) / 100);
        }

        totalExpenses += teacherExpense;
    }

    return {
        totalTeacherExpenses: totalExpenses,
        teacherCount: teachers.length
    };
};

