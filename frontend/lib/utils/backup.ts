import { Student } from '@/types';
import { Inscription } from '@/types';
import { Payment } from '@/types';
import { User } from '@/types';

export interface BackupData {
    students: Student[];
    inscriptions: Inscription[];
    payments: Payment[];
    users: User[];
    timestamp: string;
    version: string;
}

export class BackupService {
    static exportToJSON(data: BackupData): void {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arwaeduc-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static exportStudentsToCSV(students: Student[]): void {
        const headers = [
            'ID',
            'Name',
            'Surname',
            'Phone',
            'Email',
            'CIN',
            'Address',
            'Birth Date',
            'Birth Place',
            'Father Name',
            'Mother Name',
            'Parent Name',
            'Parent Phone',
            'Parent Relation',
            'School Level',
            'Current School',
            'Active',
            'Created At',
            'Updated At'
        ];

        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                student.id,
                `"${student.name}"`,
                `"${student.surname}"`,
                `"${student.phone || ''}"`,
                `"${student.email || ''}"`,
                `"${student.cin || ''}"`,
                `"${student.address || ''}"`,
                student.birthDate ? new Date(student.birthDate).toLocaleDateString() : '',
                `"${student.birthPlace || ''}"`,
                `"${student.fatherName || ''}"`,
                `"${student.motherName || ''}"`,
                `"${student.parentName || ''}"`,
                `"${student.parentPhone || ''}"`,
                `"${student.parentRelation || ''}"`,
                `"${student.schoolLevel || ''}"`,
                `"${student.currentSchool || ''}"`,
                student.active,
                new Date(student.createdAt).toLocaleDateString(),
                new Date(student.updatedAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async importFromJSON(file: File): Promise<BackupData> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string) as BackupData;
                    resolve(data);
                } catch (error) {
                    reject(new Error('Invalid backup file format'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    static validateBackupData(data: any): data is BackupData {
        return (
            data &&
            Array.isArray(data.students) &&
            Array.isArray(data.inscriptions) &&
            Array.isArray(data.payments) &&
            Array.isArray(data.users) &&
            typeof data.timestamp === 'string' &&
            typeof data.version === 'string'
        );
    }

    static createBackup(
        students: Student[],
        inscriptions: Inscription[],
        payments: Payment[],
        users: User[]
    ): BackupData {
        return {
            students,
            inscriptions,
            payments,
            users,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
}

export default BackupService;