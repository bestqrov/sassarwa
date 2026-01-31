import { Router } from 'express';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// Admin routes
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SECRETARY']), StudentController.create);
router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'SECRETARY']), StudentController.findAll);
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SECRETARY']), StudentController.findOne);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SECRETARY']), StudentController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SECRETARY']), StudentController.delete);

// Student portal routes
router.get('/portal/profile', authMiddleware, StudentController.getProfile);
router.patch('/portal/profile', authMiddleware, StudentController.updateProfile);
router.get('/portal/courses', authMiddleware, StudentController.getCourses);
router.get('/portal/attendance', authMiddleware, StudentController.getAttendance);
router.get('/portal/notifications', authMiddleware, StudentController.getNotifications);
router.patch('/portal/notifications/:id/read', authMiddleware, StudentController.markNotificationAsRead);
router.patch('/portal/notifications/read-all', authMiddleware, StudentController.markAllNotificationsAsRead);
router.get('/portal/stats', authMiddleware, StudentController.getStats);
router.get('/portal/upcoming-sessions', authMiddleware, StudentController.getUpcomingSessions);

// Alias routes for frontend compatibility
router.get('/students/profile', authMiddleware, StudentController.getProfile);
router.patch('/students/profile', authMiddleware, StudentController.updateProfile);
router.get('/students/courses', authMiddleware, StudentController.getCourses);
router.get('/students/attendance', authMiddleware, StudentController.getAttendance);
router.get('/students/notifications', authMiddleware, StudentController.getNotifications);
router.patch('/students/notifications/:id/read', authMiddleware, StudentController.markNotificationAsRead);
router.patch('/students/notifications/read-all', authMiddleware, StudentController.markAllNotificationsAsRead);
router.get('/students/stats', authMiddleware, StudentController.getStats);
router.get('/students/upcoming-sessions', authMiddleware, StudentController.getUpcomingSessions);

export default router;