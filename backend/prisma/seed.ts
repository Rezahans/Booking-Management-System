import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing data safely
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();

  // 2. Seed Services
  const servicesData = [
    {
      name: 'Premium Haircut & Styling',
      duration: 45,
      description: 'Full consultation, luxury wash, precision cut, and styling.',
      price: 150000,
    },
    {
      name: 'Full Body Aromatherapy Massage',
      duration: 90,
      description: 'Relaxing deep tissue massage using natural essential oils.',
      price: 350000,
    },
    {
      name: 'Deep Cleansing Facial Treatment',
      duration: 60,
      description: 'Pore extraction, gentle exfoliation, hydrating mask, and serum.',
      price: 250000,
    },
    {
      name: 'Manicure & Pedicure Spa',
      duration: 60,
      description: 'Nail shaping, cuticle care, scrub, foot massage, and polish.',
      price: 180000,
    },
    {
      name: 'Comprehensive Consultation',
      duration: 30,
      description: 'One-on-one specialist consultation and advisory session.',
      price: 200000,
    },
    {
      name: 'Full Vehicle Detailing & Coating',
      duration: 120,
      description: 'Interior deep vacuum & sanitize, exterior polish & paint protection.',
      price: 500000,
    },
  ];

  const createdServices = [];
  for (const service of servicesData) {
    const created = await prisma.service.create({
      data: service,
    });
    createdServices.push(created);
  }

  console.log(`✅ Created ${createdServices.length} services.`);

  // 3. Seed Sample Bookings
  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0);

  const bookingsData = [
    {
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.jenkins@example.com',
      serviceId: createdServices[0].id,
      startTime: new Date(baseDate.getTime() + 1 * 60 * 60 * 1000), // today 10:00
      endTime: new Date(baseDate.getTime() + 1 * 60 * 60 * 1000 + createdServices[0].duration * 60 * 1000),
      status: BookingStatus.CONFIRMED,
      notes: 'Customer requested senior hair stylist.',
    },
    {
      customerName: 'Alex Pratama',
      customerEmail: 'alex.pratama@gmail.com',
      serviceId: createdServices[1].id,
      startTime: new Date(baseDate.getTime() + 3 * 60 * 60 * 1000), // today 12:00
      endTime: new Date(baseDate.getTime() + 3 * 60 * 60 * 1000 + createdServices[1].duration * 60 * 1000),
      status: BookingStatus.PENDING,
      notes: 'First-time client, wants lavender oil.',
    },
    {
      customerName: 'Budi Santoso',
      customerEmail: 'budi.santoso@yahoo.com',
      serviceId: createdServices[2].id,
      startTime: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // yesterday 13:00
      endTime: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + createdServices[2].duration * 60 * 1000),
      status: BookingStatus.COMPLETED,
      notes: 'Completed without issues. Client satisfied.',
    },
    {
      customerName: 'Clara Wijaya',
      customerEmail: 'clara.wijaya@outlook.com',
      serviceId: createdServices[3].id,
      startTime: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // tomorrow 11:00
      endTime: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + createdServices[3].duration * 60 * 1000),
      status: BookingStatus.PENDING,
      notes: 'Special nail art request.',
    },
    {
      customerName: 'David Lee',
      customerEmail: 'david.lee@corporate.com',
      serviceId: createdServices[4].id,
      startTime: new Date(baseDate.getTime() - 48 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      endTime: new Date(baseDate.getTime() - 48 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + createdServices[4].duration * 60 * 1000),
      status: BookingStatus.CANCELLED,
      notes: 'Client rescheduled due to urgent meeting.',
    },
    {
      customerName: 'Jessica Miller',
      customerEmail: 'jessica.m@test.com',
      serviceId: createdServices[5].id,
      startTime: new Date(baseDate.getTime() + 5 * 60 * 60 * 1000), // today 14:00
      endTime: new Date(baseDate.getTime() + 5 * 60 * 60 * 1000 + createdServices[5].duration * 60 * 1000),
      status: BookingStatus.CONFIRMED,
      notes: 'SUV Black - Nano ceramic coating.',
    },
  ];

  for (const booking of bookingsData) {
    await prisma.booking.create({
      data: booking,
    });
  }

  console.log(`✅ Created ${bookingsData.length} sample bookings.`);
  console.log('✨ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
