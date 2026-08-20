import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  customerName: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'jane.doe@example.com',
  })
  @IsEmail({}, { message: 'A valid customer email is required' })
  @IsNotEmpty({ message: 'Customer email is required' })
  customerEmail: string;

  @ApiProperty({
    description: 'UUID of the selected service',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Service selection is required' })
  serviceId: string;

  @ApiProperty({
    description: 'Booking scheduled start time in ISO 8601 string format',
    example: '2026-08-25T10:00:00.000Z',
  })
  @IsDateString({}, { message: 'Start time must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'Start time is required' })
  startTime: string;

  @ApiPropertyOptional({
    description: 'Additional notes or customer requests',
    example: 'Please prepare the corner private room.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
