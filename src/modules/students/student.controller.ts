import { Request, Response } from 'express';
import { StudentService } from '../modules/students/student.service';
import { CreateStudentDto } from '../modules/students/dto/create-student.dto';
import { UpdateStudentDto } from '../modules/students/dto/update-student.dto';

export class StudentController {
    static async create(req: Request, res: Response) {
        try {
            const data: CreateStudentDto = req.body;
            const result = await StudentService.create(data);

            res.status(201).json({
                success: true,
                data: result,
                message: 'Student created successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async findAll(req: Request, res: Response) {
        try {
            const students = await StudentService.findAll();
            res.json({
                success: true,
                data: students
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async findOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const student = await StudentService.findOne(id);
            res.json({
                success: true,
                data: student
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data: UpdateStudentDto = req.body;
            const student = await StudentService.update(id, data);
            res.json({
                success: true,
                data: student
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await StudentService.delete(id);
            res.json({
                success: true,
                message: 'Student deleted successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Student portal methods
    static async getProfile(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const student = await StudentService.findOne(studentId);
            res.json({
                success: true,
                data: student
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const data: UpdateStudentDto = req.body;
            const student = await StudentService.update(studentId, data);
            res.json({
                success: true,
                data: student
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getCourses(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const courses = await StudentService.getStudentCourses(studentId);
            res.json({
                success: true,
                data: courses
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getAttendance(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const attendance = await StudentService.getStudentAttendance(studentId);
            res.json({
                success: true,
                data: attendance
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getNotifications(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const notifications = await StudentService.getStudentNotifications(studentId);
            res.json({
                success: true,
                data: notifications
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async markNotificationAsRead(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            const { id } = req.params;

            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            await StudentService.markNotificationAsRead(studentId, id);
            res.json({
                success: true,
                message: 'Notification marked as read'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async markAllNotificationsAsRead(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            await StudentService.markAllNotificationsAsRead(studentId);
            res.json({
                success: true,
                message: 'All notifications marked as read'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getStats(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const stats = await StudentService.getStudentStats(studentId);
            res.json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getUpcomingSessions(req: Request, res: Response) {
        try {
            const studentId = (req as any).user?.id;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
            }

            const sessions = await StudentService.getUpcomingSessions(studentId);
            res.json({
                success: true,
                data: sessions
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}