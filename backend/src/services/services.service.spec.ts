import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  const mockServiceData = [
    {
      id: 'srv-1',
      name: 'Haircut',
      duration: 45,
      description: 'Haircut & Styling',
      price: 150000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPrismaService = {
    service: {
      findMany: jest.fn().mockResolvedValue(mockServiceData),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        const found = mockServiceData.find((s) => s.id === id);
        return Promise.resolve(found || null);
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all services', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockServiceData);
    expect(prisma.service.findMany).toHaveBeenCalled();
  });

  it('should return a service by id', async () => {
    const result = await service.findOne('srv-1');
    expect(result).toEqual(mockServiceData[0]);
  });

  it('should throw NotFoundException if service not found', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
