const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    console.log('🔍 Checking database for users...');
    
    try {
        await prisma.$connect();
        console.log('✅ Database connected');
        
        const users = await prisma.user.findMany();
        console.log(`📊 Found ${users.length} users in database:`);
        
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.role}) - ${user.name}`);
        });
        
        if (users.length === 0) {
            console.warn('⚠️  No users found! Seeding may have failed.');
        }
        
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
