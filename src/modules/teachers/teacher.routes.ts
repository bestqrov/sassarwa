import { Router } from 'express';
import { teacherController } from './teacher.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// مسارات عامة
router.post('/login', teacherController.login);

// مسارات محمية (تتطلب مصادقة)
router.use(authMiddleware);
router.use(roleMiddleware(['TEACHER']));

// ملف شخصي
router.get('/profile', teacherController.getProfile);
router.put('/profile', teacherController.updateProfile);
router.put('/change-password', teacherController.changePassword);

// مجموعات
router.get('/groups', teacherController.getGroups);
router.get('/groups/:groupId', teacherController.getGroupDetails);

// حضور
router.get('/attendance', teacherController.getAttendance);
router.post('/attendance', teacherController.markAttendance);

// واجبات
router.get('/homework', teacherController.getHomework);
router.post('/homework', teacherController.createHomework);

// امتحانات
router.get('/exams', teacherController.getExams);
router.post('/exams', teacherController.createExam);

// إشعارات
router.get('/notifications', teacherController.getNotifications);
router.put('/notifications/:notificationId/read', teacherController.markNotificationRead);

// إعدادات
router.get('/settings', teacherController.getSettings);
router.put('/settings', teacherController.updateSettings);

// تقارير
router.get('/reports', teacherController.getReports);
router.get('/reports/attendance', teacherController.getReports);
router.get('/reports/performance', teacherController.getReports);
router.get('/reports/revenue', teacherController.getReports);

export default router;