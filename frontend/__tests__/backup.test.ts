import { BackupService, BackupData } from '../lib/utils/backup';
import { Student, User, Inscription, Payment } from '../types';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document methods
Object.defineProperty(document, 'createElement', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        click: jest.fn(),
        href: '',
        download: '',
    })),
});

Object.defineProperty(document, 'body', {
    writable: true,
    value: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
    },
});

describe('BackupService', () => {
    const mockStudents: Student[] = [
        {
            id: '1',
            name: 'John',
            surname: 'Doe',
            phone: '123456789',
            email: 'john@example.com',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockUsers: User[] = [
        {
            id: '1',
            name: 'Admin',
            email: 'admin@example.com',
            role: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockInscriptions: Inscription[] = [
        {
            id: '1',
            studentId: '1',
            type: 'SOUTIEN',
            category: 'MATHS',
            amount: 100,
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockPayments: Payment[] = [
        {
            id: '1',
            studentId: '1',
            amount: 100,
            method: 'CASH',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    describe('createBackup', () => {
        it('should create a backup object with all data', () => {
            const backup = BackupService.createBackup(
                mockStudents,
                mockInscriptions,
                mockPayments,
                mockUsers
            );

            expect(backup.students).toEqual(mockStudents);
            expect(backup.inscriptions).toEqual(mockInscriptions);
            expect(backup.payments).toEqual(mockPayments);
            expect(backup.users).toEqual(mockUsers);
            expect(backup.timestamp).toBeDefined();
            expect(backup.version).toBe('1.0.0');
        });
    });

    describe('validateBackupData', () => {
        it('should validate correct backup data', () => {
            const backup: BackupData = {
                students: mockStudents,
                inscriptions: mockInscriptions,
                payments: mockPayments,
                users: mockUsers,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };

            expect(BackupService.validateBackupData(backup)).toBe(true);
        });

        it('should reject invalid backup data', () => {
            expect(BackupService.validateBackupData({})).toBe(false);
            expect(BackupService.validateBackupData(null)).toBe(false);
            expect(BackupService.validateBackupData({ students: [] })).toBe(false);
        });
    });

    describe('exportToJSON', () => {
        it('should create a download link for JSON export', () => {
            const backup: BackupData = {
                students: mockStudents,
                inscriptions: mockInscriptions,
                payments: mockPayments,
                users: mockUsers,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };

            BackupService.exportToJSON(backup);

            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(global.URL.createObjectURL).toHaveBeenCalled();
            expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        });
    });

    describe('exportStudentsToCSV', () => {
        it('should create a download link for CSV export', () => {
            BackupService.exportStudentsToCSV(mockStudents);

            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(global.URL.createObjectURL).toHaveBeenCalled();
            expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        });
    });

    describe('importFromJSON', () => {
        it('should parse valid JSON file', async () => {
            const backup: BackupData = {
                students: mockStudents,
                inscriptions: mockInscriptions,
                payments: mockPayments,
                users: mockUsers,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };

            const jsonString = JSON.stringify(backup);
            const file = new File([jsonString], 'backup.json', { type: 'application/json' });

            const result = await BackupService.importFromJSON(file);
            expect(result).toEqual(backup);
        });

        it('should reject invalid JSON', async () => {
            const file = new File(['invalid json'], 'backup.json', { type: 'application/json' });

            await expect(BackupService.importFromJSON(file)).rejects.toThrow('Invalid backup file format');
        });
    });
});