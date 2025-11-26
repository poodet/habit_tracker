import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectDefinitionDto {
  @ApiProperty({ example: 'Humeur' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Suivi quotidien de mes humeurs', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: {
      type: 'object',
      properties: {
        mood: { type: 'string', enum: ['happy', 'sad', 'neutral', 'angry'] },
        intensity: { type: 'number', minimum: 1, maximum: 10 },
        notes: { type: 'string' },
      },
      required: ['mood', 'intensity'],
    },
  })
  @IsObject()
  @IsNotEmpty()
  schema: Record<string, any>;

  @ApiProperty({ example: '😊', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: '#FF5733', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
