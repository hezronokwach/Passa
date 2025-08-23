const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@passa.com' },
    update: {},
    create: {
      email: 'admin@passa.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create organizer user
  const organizerPassword = await bcrypt.hash('organizer123', 10);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@passa.com' },
    update: {},
    create: {
      email: 'organizer@passa.com',
      password: organizerPassword,
      name: 'Event Organizer',
      role: 'ORGANIZER',
      emailVerified: new Date(),
    },
  });

  // Create organizer profile
  await prisma.organizerProfile.upsert({
    where: { userId: organizer.id },
    update: {},
    create: {
      userId: organizer.id,
      companyName: 'Passa Events',
      bio: 'Professional event organizer specializing in African music festivals.',
    },
  });

  // Create fan user
  const fanPassword = await bcrypt.hash('fan123', 10);
  const fan = await prisma.user.upsert({
    where: { email: 'fan@passa.com' },
    update: {},
    create: {
      email: 'fan@passa.com',
      password: fanPassword,
      name: 'Music Fan',
      role: 'FAN',
      emailVerified: new Date(),
    },
  });

  // Create creator user
  const creatorPassword = await bcrypt.hash('creator123', 10);
  const creator = await prisma.user.upsert({
    where: { email: 'creator@passa.com' },
    update: {},
    create: {
      email: 'creator@passa.com',
      password: creatorPassword,
      name: 'Creative Artist',
      role: 'CREATOR',
      emailVerified: new Date(),
    },
  });

  // Create creator profile
  await prisma.creatorProfile.upsert({
    where: { userId: creator.id },
    update: {},
    create: {
      userId: creator.id,
      bio: 'Professional videographer and content creator.',
      skills: ['Videography', 'Photography', 'Social Media'],
      website: 'https://creator.passa.com',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Test accounts created:');
  console.log('   Admin: admin@passa.com / admin123');
  console.log('   Organizer: organizer@passa.com / organizer123');
  console.log('   Fan: fan@passa.com / fan123');
  console.log('   Creator: creator@passa.com / creator123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });