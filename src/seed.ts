import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🚀 Starting database seed...');

        // Create admin account
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'enovazone@arwaeduc.com' },
            update: {},
            create: {
                email: 'enovazone@arwaeduc.com',
                password: hashedAdminPassword,
                name: 'Administrateur ARWAEDUC',
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin account created:', {
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });

        // Create secretary account
        const hashedPassword = await bcrypt.hash('secretary123', 10);

        const secretary = await prisma.user.upsert({
            where: { email: 'secretary@arwaeduc.com' },
            update: {
                name: 'Souad arwaeduc',
            },
            create: {
                email: 'secretary@arwaeduc.com',
                password: hashedPassword,
                name: 'Souad arwaeduc',
                role: 'SECRETARY',
            },
        });

        console.log('✅ Secretary account created:', {
            email: secretary.email,
            name: secretary.name,
            role: secretary.role,
        });

        console.log('\n✅ Database seed completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });