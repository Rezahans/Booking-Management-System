import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockService = {
    id: 'srv-123',
    name: 'Haircut',
    duration: 60, // 60 minutes
    price: 100000,
  };

  const mockBooking = {
    id: 'bk-123',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    serviceId: 'srv-123',
    startTime: new Date('2026-08-20T10:00:00.000Z'),
    endTime: new Date('2026-08-20T11:00:00.000Z'),
    status: BookingStatus.PENDING,
    notes: 'Please be punctual',
    service: mockService,
  };

  const mockPrismaService = {
    service: {
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 'srv-123') return Promise.resolve(mockService);
        return Promise.resolve(null);
      }),
    },
    booking: {
      create: jest.fn().mockResolvedValue(mockBooking),
      findMany: jest.fn().mockResolvedValue([mockBooking]),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 'bk-123') return Promise.resolve(mockBooking);
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ where: { id }, data }) => {
        return Promise.resolve({
          ...mockBooking,
          ...data,
        });
      }),
      count: jest.fn().mockResolvedValue(5),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking and calculate endTime correctly from service duration', async () => {
      const result = await service.create({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        serviceId: 'srv-123',
        startTime: '2026-08-20T10:00:00.000Z',
        notes: 'Please be punctual',
      });

      expect(result).toEqual(mockBooking);
      expect(prisma.service.findUnique).toHaveBeenCalledWith({
        where: { id: 'srv-123' },
      });
      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            serviceId: 'srv-123',
            status: BookingStatus.PENDING,
            endTime: new Date('2026-08-20T11:00:00.000Z'),
          }),
        }),
      );
    });

    it('should throw NotFoundException if service does not exist', async () => {
      await expect(
        service.create({
          customerName: 'Jane',
          customerEmail: 'jane@example.com',
          serviceId: 'non-existent',
          startTime: '2026-08-20T10:00:00.000Z',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a list of bookings', async () => {
      const result = await service.findAll({});
      expect(result).toEqual([mockBooking]);
      expect(prisma.booking.findMany).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an existing booking', async () => {
      const result = await service.updateStatus('bk-123', {
        status: BookingStatus.CONFIRMED,
      });

      expect(result.status).toEqual(BookingStatus.CONFIRMED);
      expect(prisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'bk-123' },
          data: { status: BookingStatus.CONFIRMED },
        }),
      );
    });

    it('should throw NotFoundException if booking not found', async () => {
      await expect(
        service.updateStatus('unknown-id', {
          status: BookingStatus.CONFIRMED,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    it('should return aggregated counts', async () => {
      const stats = await service.getStatistics();
      expect(stats).toHaveProperty('total', 5);
      expect(stats).toHaveProperty('pending', 5);
      expect(stats).toHaveProperty('confirmed', 5);
      expect(stats).toHaveProperty('completed', 5);
      expect(stats).toHaveProperty('cancelled', 5);
    });
  });
});
