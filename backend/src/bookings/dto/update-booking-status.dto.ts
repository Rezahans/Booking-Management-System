import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    description: 'New status for the booking',
    example: BookingStatus.CONFIRMED,
  })
  @IsEnum(BookingStatus, {
    message: 'Status must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: BookingStatus;
}
