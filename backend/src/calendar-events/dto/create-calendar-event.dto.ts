import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsBoolean,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarEventDto {
  @ApiProperty({ example: 'Feeling happy today' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Had a great day at work', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiProperty({
    example: {
      mood: 'happy',
      intensity: 8,
      notes: 'Great day overall',
    },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  objectDefinitionId: string;
}
