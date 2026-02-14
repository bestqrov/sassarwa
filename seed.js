
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting MongoDB database seed...');

    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ MongoDB connected successfully');

        // Create admin account
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);

        // Check if admin exists by email
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'enovazone@arwaeduc.com' }
        });

        let admin;
        if (existingAdmin) {
            admin = await prisma.user.update({
                where: { email: 'enovazone@arwaeduc.com' },
                data: {
                    password: hashedAdminPassword,
                    name: 'Administrateur ARWAEDUC',
                    role: 'ADMIN',
                }
            });
            console.log('✅ Admin account updated:', {
                email: admin.email,
                name: admin.name,
                role: admin.role,
            });
        } else {
            admin = await prisma.user.create({
                data: {
                    email: 'enovazone@arwaeduc.com',
                    password: hashedAdminPassword,
                    name: 'Administrateur ARWAEDUC',
                    role: 'ADMIN',
                }
            });
            console.log('✅ Admin account created:', {
                email: admin.email,
                name: admin.name,
                role: admin.role,
            });
        }

        // Create secretary account
        const hashedPassword = await bcrypt.hash('secretary123', 10);

        const existingSecretary = await prisma.user.findUnique({
            where: { email: 'secretary@arwaeduc.com' }
        });

        let secretary;
        if (existingSecretary) {
            secretary = await prisma.user.update({
                where: { email: 'secretary@arwaeduc.com' },
                data: {
                    name: 'Souad arwaeduc',
                    password: hashedPassword,
                    role: 'SECRETARY',
                }
            });
            console.log('✅ Secretary account updated:', {
                email: secretary.email,
                name: secretary.name,
                role: secretary.role,
            });
        } else {
            secretary = await prisma.user.create({
                data: {
                    email: 'secretary@arwaeduc.com',
                    password: hashedPassword,
                    name: 'Souad arwaeduc',
                    role: 'SECRETARY',
                }
            });
            console.log('✅ Secretary account created:', {
                email: secretary.email,
                name: secretary.name,
                role: secretary.role,
            });
        }

        console.log('\n✅ MongoDB database seed completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('Admin: enovazone@arwaeduc.com / admin123');
        console.log('Secretary: secretary@arwaeduc.com / secretary123');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
