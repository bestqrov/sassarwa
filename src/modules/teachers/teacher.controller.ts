import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const teacherController = {
    // تسجيل دخول الأستاذ
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const teacher = await prisma.teacher.findUnique({
                where: { email }
            });

            if (!teacher || !teacher.password) {
                return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
            }

            const isValidPassword = await bcrypt.compare(password, teacher.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
            }

            if (teacher.status !== 'Active') {
                return res.status(403).json({ message: 'الحساب غير نشط' });
            }

            const token = jwt.sign(
                { id: teacher.id, role: 'TEACHER' },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                teacher: {
                    id: teacher.id,
                    name: teacher.name,
                    email: teacher.email,
                    role: teacher.role
                }
            });
        } catch (error) {
            console.error('Teacher login error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على بيانات الأستاذ الحالي
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const teacher = await prisma.teacher.findUnique({
                where: { id: req.user!.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    cin: true,
                    dob: true,
                    gender: true,
                    picture: true,
                    status: true,
                    role: true,
                    address: true,
                    schoolLevel: true,
                    certification: true,
                    hourlyRate: true,
                    paymentType: true,
                    commission: true,
                    specialties: true,
                    levels: true,
                    socialMedia: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!teacher) {
                return res.status(404).json({ message: 'الأستاذ غير موجود' });
            }

            res.json(teacher);
        } catch (error) {
            console.error('Get teacher profile error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // تحديث بيانات الأستاذ
    async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                name,
                phone,
                address,
                schoolLevel,
                certification,
                hourlyRate,
                specialties,
                levels
            } = req.body;

            const updatedTeacher = await prisma.teacher.update({
                where: { id: req.user!.id },
                data: {
                    name,
                    phone,
                    address,
                    schoolLevel,
                    certification,
                    hourlyRate: parseFloat(hourlyRate),
                    specialties,
                    levels
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    schoolLevel: true,
                    certification: true,
                    hourlyRate: true,
                    specialties: true,
                    levels: true,
                    updatedAt: true
                }
            });

            res.json(updatedTeacher);
        } catch (error) {
            console.error('Update teacher profile error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // تغيير كلمة المرور
    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body;

            const teacher = await prisma.teacher.findUnique({
                where: { id: req.user!.id }
            });

            if (!teacher) {
                return res.status(404).json({ message: 'الأستاذ غير موجود' });
            }

            const isValidPassword = await bcrypt.compare(currentPassword, teacher.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.teacher.update({
                where: { id: req.user!.id },
                data: { password: hashedPassword }
            });

            res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على الأقسام الخاصة بالأستاذ
    async getGroups(req: AuthenticatedRequest, res: Response) {
        try {
            const groups = await prisma.group.findMany({
                where: {
                    teacherId: req.user!.id,
                    status: 'Active'
                },
                include: {
                    students: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            status: true
                        }
                    },
                    formation: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                            subject: true
                        }
                    },
                    _count: {
                        select: { students: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json(groups);
        } catch (error) {
            console.error('Get teacher groups error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على تفاصيل قسم معين
    async getGroupDetails(req: AuthenticatedRequest, res: Response) {
        try {
            const { groupId } = req.params;

            const group = await prisma.group.findFirst({
                where: {
                    id: groupId,
                    teacherId: req.user!.id
                },
                include: {
                    students: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            status: true,
                            schoolLevel: true
                        }
                    },
                    formation: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                            subject: true,
                            description: true
                        }
                    },
                    sessions: {
                        orderBy: { date: 'desc' },
                        take: 10
                    }
                }
            });

            if (!group) {
                return res.status(404).json({ message: 'المجموعة غير موجودة' });
            }

            res.json(group);
        } catch (error) {
            console.error('Get group details error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على سجلات الحضور
    async getAttendance(req: AuthenticatedRequest, res: Response) {
        try {
            const { groupId, date } = req.query;

            let whereClause: any = {
                group: {
                    teacherId: req.user!.id
                }
            };

            if (groupId) {
                whereClause.groupId = groupId;
            }

            if (date) {
                whereClause.date = new Date(date as string);
            }

            const attendance = await prisma.attendance.findMany({
                where: whereClause,
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    group: {
                        select: {
                            id: true,
                            name: true,
                            formation: {
                                select: {
                                    name: true,
                                    level: true
                                }
                            }
                        }
                    }
                },
                orderBy: { date: 'desc' }
            });

            res.json(attendance);
        } catch (error) {
            console.error('Get attendance error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // تسجيل الحضور
    async markAttendance(req: AuthenticatedRequest, res: Response) {
        try {
            const { groupId, date, attendanceData } = req.body;

            // التحقق من أن المجموعة تنتمي للأستاذ
            const group = await prisma.group.findFirst({
                where: {
                    id: groupId,
                    teacherId: req.user!.id
                }
            });

            if (!group) {
                return res.status(404).json({ message: 'المجموعة غير موجودة' });
            }

            const attendanceRecords = attendanceData.map((record: any) => ({
                studentId: record.studentId,
                groupId,
                date: new Date(date),
                status: record.status,
                notes: record.notes || null
            }));

            // حذف سجلات الحضور الموجودة لهذا التاريخ والمجموعة
            await prisma.attendance.deleteMany({
                where: {
                    groupId,
                    date: new Date(date)
                }
            });

            // إنشاء سجلات حضور جديدة
            const createdAttendance = await prisma.attendance.createMany({
                data: attendanceRecords
            });

            res.json({
                message: 'تم تسجيل الحضور بنجاح',
                count: createdAttendance.count
            });
        } catch (error) {
            console.error('Mark attendance error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على الواجبات
    async getHomework(req: AuthenticatedRequest, res: Response) {
        try {
            const { groupId } = req.query;

            let whereClause: any = {
                teacherId: req.user!.id
            };

            if (groupId) {
                whereClause.groupId = groupId;
            }

            const homework = await prisma.homework.findMany({
                where: whereClause,
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true,
                            formation: {
                                select: {
                                    name: true,
                                    level: true
                                }
                            }
                        }
                    },
                    submissions: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { submissions: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json(homework);
        } catch (error) {
            console.error('Get homework error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // إنشاء واجب جديد
    async createHomework(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                description,
                groupId,
                dueDate,
                attachments,
                maxScore
            } = req.body;

            // التحقق من أن المجموعة تنتمي للأستاذ
            const group = await prisma.group.findFirst({
                where: {
                    id: groupId,
                    teacherId: req.user!.id
                }
            });

            if (!group) {
                return res.status(404).json({ message: 'المجموعة غير موجودة' });
            }

            const homework = await prisma.homework.create({
                data: {
                    title,
                    description,
                    groupId,
                    teacherId: req.user!.id,
                    dueDate: new Date(dueDate),
                    attachments: attachments || [],
                    maxScore: maxScore || 20
                },
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            res.status(201).json(homework);
        } catch (error) {
            console.error('Create homework error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على الامتحانات
    async getExams(req: AuthenticatedRequest, res: Response) {
        try {
            const { groupId, upcoming } = req.query;

            let whereClause: any = {
                teacherId: req.user!.id
            };

            if (groupId) {
                whereClause.groupId = groupId;
            }

            if (upcoming === 'true') {
                whereClause.date = {
                    gte: new Date()
                };
            }

            const exams = await prisma.exam.findMany({
                where: whereClause,
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true,
                            formation: {
                                select: {
                                    name: true,
                                    level: true
                                }
                            }
                        }
                    },
                    results: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { results: true }
                    }
                },
                orderBy: { date: 'asc' }
            });

            res.json(exams);
        } catch (error) {
            console.error('Get exams error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // إنشاء امتحان جديد
    async createExam(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                description,
                groupId,
                date,
                duration,
                maxScore,
                type,
                attachments
            } = req.body;

            // التحقق من أن المجموعة تنتمي للأستاذ
            const group = await prisma.group.findFirst({
                where: {
                    id: groupId,
                    teacherId: req.user!.id
                }
            });

            if (!group) {
                return res.status(404).json({ message: 'المجموعة غير موجودة' });
            }

            const exam = await prisma.exam.create({
                data: {
                    title,
                    description,
                    groupId,
                    teacherId: req.user!.id,
                    date: new Date(date),
                    duration: parseInt(duration),
                    maxScore: maxScore || 20,
                    type: type || 'WRITTEN',
                    attachments: attachments || []
                },
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            res.status(201).json(exam);
        } catch (error) {
            console.error('Create exam error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على الإشعارات
    async getNotifications(req: AuthenticatedRequest, res: Response) {
        try {
            const { read, limit = 20 } = req.query;

            let whereClause: any = {
                OR: [
                    { recipientId: req.user!.id },
                    { recipientType: 'TEACHER' }
                ]
            };

            if (read !== undefined) {
                whereClause.read = read === 'true';
            }

            const notifications = await prisma.notification.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit as string)
            });

            res.json(notifications);
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // تحديث حالة الإشعار كمقروء
    async markNotificationRead(req: AuthenticatedRequest, res: Response) {
        try {
            const { notificationId } = req.params;

            const notification = await prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    OR: [
                        { recipientId: req.user!.id },
                        { recipientType: 'TEACHER' }
                    ]
                }
            });

            if (!notification) {
                return res.status(404).json({ message: 'الإشعار غير موجود' });
            }

            await prisma.notification.update({
                where: { id: notificationId },
                data: { read: true, readAt: new Date() }
            });

            res.json({ message: 'تم تحديث الإشعار' });
        } catch (error) {
            console.error('Mark notification read error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على الإعدادات
    async getSettings(req: AuthenticatedRequest, res: Response) {
        try {
            const teacher = await prisma.teacher.findUnique({
                where: { id: req.user!.id },
                select: {
                    notifications: true,
                    privacy: true,
                    preferences: true,
                    security: true
                }
            });

            if (!teacher) {
                return res.status(404).json({ message: 'الأستاذ غير موجود' });
            }

            // إرجاع الإعدادات الافتراضية إذا لم تكن محددة
            const settings = {
                notifications: teacher.notifications || {
                    email: true,
                    push: true,
                    sms: false,
                    homeworkReminders: true,
                    examReminders: true,
                    paymentNotifications: true
                },
                privacy: teacher.privacy || {
                    profileVisibility: 'public',
                    showEmail: true,
                    showPhone: true
                },
                preferences: teacher.preferences || {
                    language: 'ar',
                    theme: 'light',
                    timezone: 'Africa/Casablanca',
                    dateFormat: 'DD/MM/YYYY',
                    currency: 'MAD'
                },
                security: teacher.security || {
                    twoFactorEnabled: false,
                    sessionTimeout: 60
                }
            };

            res.json(settings);
        } catch (error) {
            console.error('Get settings error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // تحديث الإعدادات
    async updateSettings(req: AuthenticatedRequest, res: Response) {
        try {
            const { notifications, privacy, preferences, security } = req.body;

            const updatedTeacher = await prisma.teacher.update({
                where: { id: req.user!.id },
                data: {
                    notifications,
                    privacy,
                    preferences,
                    security
                },
                select: {
                    notifications: true,
                    privacy: true,
                    preferences: true,
                    security: true
                }
            });

            res.json(updatedTeacher);
        } catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    },

    // الحصول على التقارير
    async getReports(req: AuthenticatedRequest, res: Response) {
        try {
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const end = endDate ? new Date(endDate as string) : new Date();

            // الحصول على مجموعات الأستاذ
            const groups = await prisma.group.findMany({
                where: { teacherId: req.user!.id },
                select: { id: true, name: true }
            });

            const groupIds = groups.map(g => g.id);

            // حساب الإحصائيات
            const totalStudents = await prisma.student.count({
                where: {
                    groups: {
                        some: {
                            id: { in: groupIds }
                        }
                    }
                }
            });

            const totalGroups = groups.length;

            const attendanceRecords = await prisma.attendance.findMany({
                where: {
                    groupId: { in: groupIds },
                    date: {
                        gte: start,
                        lte: end
                    }
                }
            });

            const totalSessions = attendanceRecords.length;
            const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT').length;
            const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;

            // حساب الساعات والإيرادات (مبسط)
            const totalHours = totalSessions; // بافتراض جلسة واحدة = ساعة واحدة
            const teacher = await prisma.teacher.findUnique({
                where: { id: req.user!.id },
                select: { hourlyRate: true, paymentType: true, commission: true }
            });

            let monthlyRevenue = 0;
            if (teacher) {
                if (teacher.paymentType === 'HOURLY') {
                    monthlyRevenue = totalHours * teacher.hourlyRate;
                } else if (teacher.paymentType === 'COMMISSION') {
                    // هذا يحتاج لحساب أكثر تعقيداً بناءً على المدفوعات
                    monthlyRevenue = 0; // placeholder
                }
            }

            // أداء المجموعات
            const groupPerformance = await Promise.all(
                groups.map(async (group) => {
                    const groupAttendance = attendanceRecords.filter(a => a.groupId === group.id);
                    const groupPresent = groupAttendance.filter(a => a.status === 'PRESENT').length;
                    const groupRate = groupAttendance.length > 0 ? (groupPresent / groupAttendance.length) * 100 : 0;

                    const studentCount = await prisma.student.count({
                        where: {
                            groups: {
                                some: { id: group.id }
                            }
                        }
                    });

                    return {
                        name: group.name,
                        students: studentCount,
                        attendanceRate: Math.round(groupRate)
                    };
                })
            );

            // النشاط الأخير (مبسط)
            const recentActivity = [
                {
                    description: 'تم إنشاء واجب جديد',
                    date: new Date().toISOString()
                },
                {
                    description: 'تم تسجيل حضور اليوم',
                    date: new Date(Date.now() - 86400000).toISOString()
                }
            ];

            res.json({
                totalStudents,
                totalGroups,
                totalSessions,
                totalHours,
                attendanceRate: Math.round(attendanceRate),
                monthlyRevenue,
                groupPerformance,
                recentActivity
            });
        } catch (error) {
            console.error('Get reports error:', error);
            res.status(500).json({ message: 'خطأ في الخادم' });
        }
    }
};