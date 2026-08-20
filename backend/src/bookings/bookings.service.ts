import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const { customerName, customerEmail, serviceId, startTime: startTimeStr, notes } = createBookingDto;

    // 1. Verify Service exists
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID "${serviceId}" not found`);
    }

    // 2. Parse & calculate Start Time and End Time
    const startTime = new Date(startTimeStr);
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid start time format');
    }

    // Automatically calculate endTime based on service duration (in minutes)
    const durationInMs = service.duration * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationInMs);

    // 3. Create booking record
    return this.prisma.booking.create({
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        serviceId,
        startTime,
        endTime,
        status: BookingStatus.PENDING,
        notes: notes?.trim() || null,
      },
      include: {
        service: true,
      },
    });
  }

  async findAll(query: QueryBookingDto) {
    const { status, search, serviceId, sortBy = 'startTime', sortOrder = 'asc' } = query;

    const where: Prisma.BookingWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { customerName: { contains: term, mode: 'insensitive' } },
        { customerEmail: { contains: term, mode: 'insensitive' } },
      ];
    }

    const validSortFields = ['startTime', 'createdAt', 'customerName', 'status', 'endTime'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'startTime';
    const direction = sortOrder === 'desc' ? 'desc' : 'asc';

    return this.prisma.booking.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: {
        [orderField]: direction,
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }

    return booking;
  }

  async updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto) {
    // 1. Check if booking exists
    await this.findOne(id);

    // 2. Update status
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: updateBookingStatusDto.status,
      },
      include: {
        service: true,
      },
    });
  }

  async getStatistics() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [total, pending, confirmed, completed, cancelled, todayCount] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      this.prisma.booking.count({
        where: {
          startTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),
    ]);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      today: todayCount,
    };
  }
}
