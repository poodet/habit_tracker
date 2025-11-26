import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { SchemaValidationService } from '../common/schema-validation.service';

@Injectable()
export class CalendarEventsService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventsRepository: Repository<CalendarEvent>,
    private objectDefinitionsService: ObjectDefinitionsService,
    private schemaValidationService: SchemaValidationService,
  ) {}

  async create(
    userId: string,
    createCalendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    // Verify that the object definition exists and belongs to the user
    const objectDefinition = await this.objectDefinitionsService.findOne(
      createCalendarEventDto.objectDefinitionId,
      userId,
    );

    // Validate that the event data matches the object definition schema
    this.schemaValidationService.validateData(objectDefinition.schema, createCalendarEventDto.data);

    const calendarEvent = this.calendarEventsRepository.create({
      ...createCalendarEventDto,
      userId,
    });
    return this.calendarEventsRepository.save(calendarEvent);
  }

  async findAll(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const where: any = { userId };

    if (startDate && endDate) {
      where.startDate = Between(startDate, endDate);
    }

    return this.calendarEventsRepository.find({
      where,
      relations: ['objectDefinition'],
      order: { startDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<CalendarEvent> {
    const calendarEvent = await this.calendarEventsRepository.findOne({
      where: { id, userId },
      relations: ['objectDefinition'],
    });
    if (!calendarEvent) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    return calendarEvent;
  }

  async update(
    id: string,
    userId: string,
    updateCalendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    const calendarEvent = await this.findOne(id, userId);

    let objectDefinition = calendarEvent.objectDefinition;

    // If changing object definition, verify it exists
    if (
      updateCalendarEventDto.objectDefinitionId &&
      updateCalendarEventDto.objectDefinitionId !== calendarEvent.objectDefinitionId
    ) {
      objectDefinition = await this.objectDefinitionsService.findOne(
        updateCalendarEventDto.objectDefinitionId,
        userId,
      );
    }

    // If updating data, validate against schema
    if (updateCalendarEventDto.data) {
      this.schemaValidationService.validateData(
        objectDefinition.schema,
        updateCalendarEventDto.data,
      );
    }

    Object.assign(calendarEvent, updateCalendarEventDto);
    return this.calendarEventsRepository.save(calendarEvent);
  }

  async remove(id: string, userId: string): Promise<void> {
    const calendarEvent = await this.findOne(id, userId);
    await this.calendarEventsRepository.remove(calendarEvent);
  }
}
