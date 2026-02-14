import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { InscriptionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

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

    console.log('\nCreating sample teachers...');
    const teachers = [
        {
            name: 'Ahmed Bennani',
            email: 'ahmed.bennani@arwaeduc.com',
            password: await bcrypt.hash('teacher123', 10),
            phone: '+212 6 12 34 56 78',
            cin: 'AB123456',
            gender: 'Homme',
            specialties: ['Maths', 'Physique'],
            levels: ['Lycée', 'Collège'],
            hourlyRate: 150,
            paymentType: 'HOURLY',
            status: 'Active',
            address: 'Casablanca, Maroc',
            schoolLevel: 'Master en Mathématiques',
            certification: 'Agrégation en Mathématiques'
        },
        {
            name: 'Fatima Alaoui',
            email: 'fatima.alaoui@arwaeduc.com',
            password: await bcrypt.hash('teacher123', 10),
            phone: '+212 6 23 45 67 89',
            cin: 'FA234567',
            gender: 'Femme',
            specialties: ['Français', 'Anglais'],
            levels: ['Lycée', 'Collège', 'Primaire'],
            hourlyRate: 120,
            paymentType: 'HOURLY',
            status: 'Active',
            address: 'Rabat, Maroc',
            schoolLevel: 'Licence en Lettres Modernes',
            certification: 'CAPES Lettres'
        },
        {
            name: 'Mohammed Tazi',
            email: 'mohammed.tazi@arwaeduc.com',
            password: await bcrypt.hash('teacher123', 10),
            phone: '+212 6 34 56 78 90',
            cin: 'MT345678',
            gender: 'Homme',
            specialties: ['Physique et Chimique', 'S.V.T'],
            levels: ['Lycée', 'Collège'],
            hourlyRate: 140,
            paymentType: 'HOURLY',
            status: 'Active',
            address: 'Marrakech, Maroc',
            schoolLevel: 'Doctorat en Physique',
            certification: 'Agrégation en Sciences Physiques'
        },
        {
            name: 'Amina El Khattabi',
            email: 'amina.elkhattabi@arwaeduc.com',
            password: await bcrypt.hash('teacher123', 10),
            phone: '+212 6 45 67 89 01',
            cin: 'AE456789',
            gender: 'Femme',
            specialties: ['Anglais', 'Espagnol'],
            levels: ['Lycée', 'Collège', 'Primaire'],
            hourlyRate: 130,
            paymentType: 'HOURLY',
            status: 'Active',
            address: 'Fès, Maroc',
            schoolLevel: 'Master en Langues Étrangères',
            certification: 'TEFL Certificate'
        },
        {
            name: 'Youssef Bouazza',
            email: 'youssef.bouazza@arwaeduc.com',
            password: await bcrypt.hash('teacher123', 10),
            phone: '+212 6 56 78 90 12',
            cin: 'YB567890',
            gender: 'Homme',
            specialties: ['Maths', 'Informatique'],
            levels: ['Lycée', 'Collège'],
            hourlyRate: 160,
            paymentType: 'HOURLY',
            status: 'Active',
            address: 'Tanger, Maroc',
            schoolLevel: 'Ingénieur Informatique',
            certification: 'Microsoft Certified Educator'
        }
    ];

    const createdTeachers = [];
    for (const teacher of teachers) {
        const existing = await prisma.teacher.findFirst({
            where: { email: teacher.email }
        });

        if (!existing) {
            const created = await prisma.teacher.create({
                data: teacher
            });
            createdTeachers.push(created);
            console.log(`Created teacher: ${teacher.name}`);
        } else {
            createdTeachers.push(existing);
            console.log(`Teacher already exists: ${teacher.name}`);
        }
    }

    console.log('\nCreating sample students...');
    const students = [
        {
            name: 'Karim',
            surname: 'Benjelloun',
            phone: '+212 6 61 23 45 67',
            email: 'karim.benjelloun@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'KB123456',
            address: 'Casablanca, Maroc',
            birthDate: new Date('2008-05-15'),
            birthPlace: 'Casablanca',
            fatherName: 'Hassan Benjelloun',
            motherName: 'Fatima Benjelloun',
            parentName: 'Hassan Benjelloun',
            parentPhone: '+212 6 61 23 45 68',
            parentRelation: 'Père',
            schoolLevel: 'Lycée',
            currentSchool: 'Lycée Mohammed V',
            subjects: ['Maths', 'Physique'],
            status: 'active',
            active: true
        },
        {
            name: 'Sara',
            surname: 'Alaoui',
            phone: '+212 6 62 34 56 78',
            email: 'sara.alaoui@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'SA234567',
            address: 'Rabat, Maroc',
            birthDate: new Date('2009-03-22'),
            birthPlace: 'Rabat',
            fatherName: 'Ahmed Alaoui',
            motherName: 'Amina Alaoui',
            parentName: 'Amina Alaoui',
            parentPhone: '+212 6 62 34 56 79',
            parentRelation: 'Mère',
            schoolLevel: 'Collège',
            currentSchool: 'Collège Ibn Khaldoun',
            subjects: ['Français', 'Anglais'],
            status: 'active',
            active: true
        },
        {
            name: 'Omar',
            surname: 'Tazi',
            phone: '+212 6 63 45 67 89',
            email: 'omar.tazi@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'OT345678',
            address: 'Marrakech, Maroc',
            birthDate: new Date('2007-11-08'),
            birthPlace: 'Marrakech',
            fatherName: 'Mohammed Tazi',
            motherName: 'Khadija Tazi',
            parentName: 'Mohammed Tazi',
            parentPhone: '+212 6 63 45 67 90',
            parentRelation: 'Père',
            schoolLevel: 'Lycée',
            currentSchool: 'Lycée Ibn Toumart',
            subjects: ['Physique et Chimique', 'S.V.T'],
            status: 'active',
            active: true
        },
        {
            name: 'Laila',
            surname: 'El Khattabi',
            phone: '+212 6 64 56 78 90',
            email: 'laila.elkhattabi@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'LE456789',
            address: 'Fès, Maroc',
            birthDate: new Date('2010-07-12'),
            birthPlace: 'Fès',
            fatherName: 'Youssef El Khattabi',
            motherName: 'Nadia El Khattabi',
            parentName: 'Nadia El Khattabi',
            parentPhone: '+212 6 64 56 78 91',
            parentRelation: 'Mère',
            schoolLevel: 'Primaire',
            currentSchool: 'École Primaire Al Khansaa',
            subjects: ['Maths', 'Français'],
            status: 'active',
            active: true
        },
        {
            name: 'Yassine',
            surname: 'Bouazza',
            phone: '+212 6 65 67 89 01',
            email: 'yassine.bouazza@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'YB567890',
            address: 'Tanger, Maroc',
            birthDate: new Date('2006-09-30'),
            birthPlace: 'Tanger',
            fatherName: 'Abdelkrim Bouazza',
            motherName: 'Zahra Bouazza',
            parentName: 'Abdelkrim Bouazza',
            parentPhone: '+212 6 65 67 89 02',
            parentRelation: 'Père',
            schoolLevel: 'Lycée',
            currentSchool: 'Lycée Al Khawarizmi',
            subjects: ['Maths', 'Informatique'],
            status: 'active',
            active: true
        },
        {
            name: 'Imane',
            surname: 'Rachidi',
            phone: '+212 6 66 78 90 12',
            email: 'imane.rachidi@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'IR678901',
            address: 'Agadir, Maroc',
            birthDate: new Date('2008-12-05'),
            birthPlace: 'Agadir',
            fatherName: 'Said Rachidi',
            motherName: 'Malika Rachidi',
            parentName: 'Malika Rachidi',
            parentPhone: '+212 6 66 78 90 13',
            parentRelation: 'Mère',
            schoolLevel: 'Collège',
            currentSchool: 'Collège Al Massira',
            subjects: ['Anglais', 'Français'],
            status: 'active',
            active: true
        },
        {
            name: 'Mehdi',
            surname: 'El Fassi',
            phone: '+212 6 67 89 01 23',
            email: 'mehdi.elfassi@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'ME789012',
            address: 'Meknès, Maroc',
            birthDate: new Date('2009-04-18'),
            birthPlace: 'Meknès',
            fatherName: 'Driss El Fassi',
            motherName: 'Samira El Fassi',
            parentName: 'Driss El Fassi',
            parentPhone: '+212 6 67 89 01 24',
            parentRelation: 'Père',
            schoolLevel: 'Collège',
            currentSchool: 'Collège Moulay Ismail',
            subjects: ['Maths', 'Physique et Chimique'],
            status: 'active',
            active: true
        },
        {
            name: 'Nour',
            surname: 'Benkirane',
            phone: '+212 6 68 90 12 34',
            email: 'nour.benkirane@email.com',
            password: await bcrypt.hash('student123', 10),
            cin: 'NB890123',
            address: 'Oujda, Maroc',
            birthDate: new Date('2011-01-25'),
            birthPlace: 'Oujda',
            fatherName: 'Mustapha Benkirane',
            motherName: 'Leila Benkirane',
            parentName: 'Leila Benkirane',
            parentPhone: '+212 6 68 90 12 35',
            parentRelation: 'Mère',
            schoolLevel: 'Primaire',
            currentSchool: 'École Primaire Ibn Sina',
            subjects: ['Français', 'Calcul Mental'],
            status: 'active',
            active: true
        }
    ];

    const createdStudents = [];
    for (const student of students) {
        const existing = await prisma.student.findFirst({
            where: { email: student.email }
        });

        if (!existing) {
            const created = await prisma.student.create({
                data: student
            });
            createdStudents.push(created);
            console.log(`Created student: ${student.name} ${student.surname}`);
        } else {
            createdStudents.push(existing);
            console.log(`Student already exists: ${student.name} ${student.surname}`);
        }
    }

    // Create sample formations
    const formations = [
        {
            name: 'Développement Web Fullstack',
            duration: '6 mois',
            price: 3000,
            description: 'Formation complète en développement web (HTML, CSS, JS, React, Node.js)',
        },
        {
            name: 'Marketing Digital',
            duration: '3 mois',
            price: 1500,
            description: 'Maîtrisez les réseaux sociaux et la publicité en ligne',
        },
        {
            name: 'Design Graphique',
            duration: '4 mois',
            price: 2000,
            description: 'Apprenez Photoshop, Illustrator et InDesign',
        },
        {
            name: 'Comptabilité Pratique',
            duration: '3 mois',
            price: 1800,
            description: 'Formation pratique sur Sage et Excel',
        },
    ];

    console.log('\nCreating sample formations...');
    for (const formation of formations) {
        const existing = await prisma.formation.findFirst({
            where: { name: formation.name }
        });

        if (!existing) {
            await prisma.formation.create({
                data: formation
            });
            console.log(`Created formation: ${formation.name}`);
        } else {
            console.log(`Formation already exists: ${formation.name}`);
        }
    }

    // Create default pricing
    const pricingItems = [
        // LYCEE
        { category: 'SOUTIEN', level: 'Lycée', subject: 'Maths', price: 200 },
        { category: 'SOUTIEN', level: 'Lycée', subject: 'Physique et Chimique', price: 200 },
        { category: 'SOUTIEN', level: 'Lycée', subject: 'S.V.T', price: 200 },
        { category: 'SOUTIEN', level: 'Lycée', subject: 'Anglais', price: 150 },
        { category: 'SOUTIEN', level: 'Lycée', subject: 'Français', price: 150 },

        // COLLEGE
        { category: 'SOUTIEN', level: 'Collège', subject: 'Maths', price: 150 },
        { category: 'SOUTIEN', level: 'Collège', subject: 'Physique et Chimique', price: 150 },
        { category: 'SOUTIEN', level: 'Collège', subject: 'S.V.T', price: 150 },
        { category: 'SOUTIEN', level: 'Collège', subject: 'Anglais', price: 100 },

        // PRIMAIRE
        { category: 'SOUTIEN', level: 'Primaire', subject: 'Maths', price: 100 },
        { category: 'SOUTIEN', level: 'Primaire', subject: 'Français', price: 100 },
        { category: 'SOUTIEN', level: 'Primaire', subject: 'Français Communication', price: 100 },
        { category: 'SOUTIEN', level: 'Primaire', subject: 'Calcul Mental', price: 100 },
    ];

    console.log('\nCreating default pricing...');
    for (const item of pricingItems) {
        // Upsert based on composite key logic if possible, or just create if not exists
        // Since we don't have a unique constraint on (category, level, subject) easy to use here without ID,
        // we'll check first.
        const existing = await prisma.pricing.findFirst({
            where: {
                level: item.level,
                subject: item.subject,
                category: item.category
            }
        });

        if (!existing) {
            await prisma.pricing.create({
                data: {
                    ...item,
                    active: true
                }
            });
            console.log(`Created pricing: ${item.level} - ${item.subject}`);
        } else {
            console.log(`Pricing already exists: ${item.level} - ${item.subject}`);
        }
    }

    console.log('\nCreating sample groups...');
    const groups = [
        {
            name: 'Maths Lycée A',
            type: InscriptionType.SOUTIEN,
            level: 'Lycée',
            subject: 'Maths',
            room: 'Salle 101',
            status: 'Active',
            teacherId: createdTeachers[0].id,
            studentIds: [createdStudents[0].id, createdStudents[4].id],
            timeSlots: [
                { day: 'monday', startTime: '14:00', endTime: '16:00' },
                { day: 'wednesday', startTime: '14:00', endTime: '16:00' },
                { day: 'friday', startTime: '14:00', endTime: '16:00' }
            ]
        },
        {
            name: 'Français Collège B',
            type: InscriptionType.SOUTIEN,
            level: 'Collège',
            subject: 'Français',
            room: 'Salle 102',
            status: 'Active',
            teacherId: createdTeachers[1].id,
            studentIds: [createdStudents[1].id, createdStudents[5].id],
            timeSlots: [
                { day: 'tuesday', startTime: '15:00', endTime: '17:00' },
                { day: 'thursday', startTime: '15:00', endTime: '17:00' }
            ]
        },
        {
            name: 'Physique-Chimie Lycée C',
            type: InscriptionType.SOUTIEN,
            level: 'Lycée',
            subject: 'Physique et Chimique',
            room: 'Salle 103',
            status: 'Active',
            teacherId: createdTeachers[2].id,
            studentIds: [createdStudents[2].id, createdStudents[6].id],
            timeSlots: [
                { day: 'monday', startTime: '16:30', endTime: '18:30' },
                { day: 'wednesday', startTime: '16:30', endTime: '18:30' }
            ]
        },
        {
            name: 'Anglais Primaire D',
            type: InscriptionType.SOUTIEN,
            level: 'Primaire',
            subject: 'Anglais',
            room: 'Salle 104',
            status: 'Active',
            teacherId: createdTeachers[3].id,
            studentIds: [createdStudents[3].id, createdStudents[7].id],
            timeSlots: [
                { day: 'tuesday', startTime: '13:00', endTime: '14:30' },
                { day: 'thursday', startTime: '13:00', endTime: '14:30' },
                { day: 'saturday', startTime: '10:00', endTime: '11:30' }
            ]
        },
        {
            name: 'Informatique Lycée E',
            type: InscriptionType.SOUTIEN,
            level: 'Lycée',
            subject: 'Informatique',
            room: 'Salle Lab Info',
            status: 'Active',
            teacherId: createdTeachers[4].id,
            studentIds: [createdStudents[4].id],
            timeSlots: [
                { day: 'tuesday', startTime: '17:00', endTime: '19:00' },
                { day: 'saturday', startTime: '14:00', endTime: '16:00' }
            ]
        },
        {
            name: 'Développement Web',
            type: InscriptionType.FORMATION,
            formationId: (await prisma.formation.findFirst({ where: { name: 'Développement Web Fullstack' } }))?.id,
            room: 'Salle Formation 1',
            status: 'Active',
            teacherId: createdTeachers[4].id,
            studentIds: [createdStudents[0].id, createdStudents[4].id],
            timeSlots: [
                { day: 'monday', startTime: '18:00', endTime: '21:00' },
                { day: 'wednesday', startTime: '18:00', endTime: '21:00' },
                { day: 'friday', startTime: '18:00', endTime: '21:00' }
            ]
        },
        {
            name: 'Marketing Digital',
            type: InscriptionType.FORMATION,
            formationId: (await prisma.formation.findFirst({ where: { name: 'Marketing Digital' } }))?.id,
            room: 'Salle Formation 2',
            status: 'Active',
            teacherId: createdTeachers[1].id,
            studentIds: [createdStudents[1].id, createdStudents[5].id],
            timeSlots: [
                { day: 'tuesday', startTime: '19:00', endTime: '22:00' },
                { day: 'thursday', startTime: '19:00', endTime: '22:00' }
            ]
        }
    ];

    for (const group of groups) {
        const existing = await prisma.group.findFirst({
            where: { name: group.name }
        });

        if (!existing) {
            await prisma.group.create({
                data: group
            });
            console.log(`Created group: ${group.name}`);
        } else {
            console.log(`Group already exists: ${group.name}`);
        }
    }

    console.log('\nCreating sample inscriptions and payments...');
    
    // Create inscriptions for students
    const inscriptions = [
        {
            studentId: createdStudents[0].id,
            type: InscriptionType.SOUTIEN,
            category: 'Maths Lycée',
            amount: 200,
            date: new Date('2024-09-01'),
            note: 'Inscription Maths Lycée'
        },
        {
            studentId: createdStudents[1].id,
            type: InscriptionType.SOUTIEN,
            category: 'Français Collège',
            amount: 150,
            date: new Date('2024-09-01'),
            note: 'Inscription Français Collège'
        },
        {
            studentId: createdStudents[2].id,
            type: InscriptionType.SOUTIEN,
            category: 'Physique-Chimie Lycée',
            amount: 200,
            date: new Date('2024-09-01'),
            note: 'Inscription Physique-Chimie Lycée'
        },
        {
            studentId: createdStudents[3].id,
            type: InscriptionType.SOUTIEN,
            category: 'Anglais Primaire',
            amount: 100,
            date: new Date('2024-09-01'),
            note: 'Inscription Anglais Primaire'
        },
        {
            studentId: createdStudents[4].id,
            type: InscriptionType.FORMATION,
            category: 'Développement Web',
            amount: 3000,
            date: new Date('2024-10-01'),
            note: 'Formation Développement Web'
        }
    ];

    for (const inscription of inscriptions) {
        const existing = await prisma.inscription.findFirst({
            where: {
                studentId: inscription.studentId,
                type: inscription.type,
                category: inscription.category
            }
        });

        if (!existing) {
            await prisma.inscription.create({
                data: inscription
            });
            console.log(`Created inscription for student ${inscription.studentId}`);
        }
    }

    // Create payments for students
    const payments = [
        {
            studentId: createdStudents[0].id,
            amount: 200,
            method: 'Espèces',
            note: 'Paiement Maths Lycée - Septembre',
            date: new Date('2024-09-05')
        },
        {
            studentId: createdStudents[1].id,
            amount: 150,
            method: 'Virement',
            note: 'Paiement Français Collège - Septembre',
            date: new Date('2024-09-03')
        },
        {
            studentId: createdStudents[2].id,
            amount: 200,
            method: 'Chèque',
            note: 'Paiement Physique-Chimie Lycée - Septembre',
            date: new Date('2024-09-07')
        },
        {
            studentId: createdStudents[3].id,
            amount: 100,
            method: 'Espèces',
            note: 'Paiement Anglais Primaire - Septembre',
            date: new Date('2024-09-04')
        },
        {
            studentId: createdStudents[4].id,
            amount: 1500,
            method: 'Virement',
            note: 'Premier versement Formation Web',
            date: new Date('2024-10-02')
        },
        {
            studentId: createdStudents[4].id,
            amount: 1500,
            method: 'Virement',
            note: 'Deuxième versement Formation Web',
            date: new Date('2024-11-02')
        }
    ];

    for (const payment of payments) {
        await prisma.payment.create({
            data: payment
        });
        console.log(`Created payment for student ${payment.studentId}`);
    }

    console.log('\nCreating sample attendance records...');
    
    // Get the groups we created
    const mathsGroup = await prisma.group.findFirst({ where: { name: 'Maths Lycée A' } });
    const francaisGroup = await prisma.group.findFirst({ where: { name: 'Français Collège B' } });
    
    if (mathsGroup && francaisGroup) {
        const attendanceRecords = [
            // Karim's attendance for Maths
            { studentId: createdStudents[0].id, groupId: mathsGroup.id, date: new Date('2024-09-02'), status: 'PRESENT' },
            { studentId: createdStudents[0].id, groupId: mathsGroup.id, date: new Date('2024-09-04'), status: 'PRESENT' },
            { studentId: createdStudents[0].id, groupId: mathsGroup.id, date: new Date('2024-09-06'), status: 'ABSENT', notes: 'Malade' },
            
            // Sara's attendance for Français
            { studentId: createdStudents[1].id, groupId: francaisGroup.id, date: new Date('2024-09-03'), status: 'PRESENT' },
            { studentId: createdStudents[1].id, groupId: francaisGroup.id, date: new Date('2024-09-05'), status: 'LATE', notes: 'Retard de 15 min' },
            
            // Yassine's attendance for Maths
            { studentId: createdStudents[4].id, groupId: mathsGroup.id, date: new Date('2024-09-02'), status: 'PRESENT' },
            { studentId: createdStudents[4].id, groupId: mathsGroup.id, date: new Date('2024-09-04'), status: 'PRESENT' }
        ];

        for (const attendance of attendanceRecords) {
            await prisma.attendance.create({
                data: attendance
            });
        }
        console.log('Created sample attendance records');
    }

    console.log('\n✅ Database seed completed!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
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