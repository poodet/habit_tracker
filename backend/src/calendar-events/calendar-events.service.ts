import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';

@Injectable()
export class CalendarEventsService {
    constructor(
        @InjectRepository(CalendarEvent)
        private calendarEventsRepository: Repository<CalendarEvent>,
        private objectDefinitionsService: ObjectDefinitionsService,
    ) { }

    async create(userId: string, createCalendarEventDto: CreateCalendarEventDto): Promise<CalendarEvent> {
        // Verify that the object definition exists and belongs to the user
        await this.objectDefinitionsService.findOne(createCalendarEventDto.objectDefinitionId, userId);

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

        if (
            updateCalendarEventDto.objectDefinitionId &&
            updateCalendarEventDto.objectDefinitionId !== calendarEvent.objectDefinitionId
        ) {
            await this.objectDefinitionsService.findOne(updateCalendarEventDto.objectDefinitionId, userId);
        }

        Object.assign(calendarEvent, updateCalendarEventDto);
        return this.calendarEventsRepository.save(calendarEvent);
    }

    async remove(id: string, userId: string): Promise<void> {
        const calendarEvent = await this.findOne(id, userId);
        await this.calendarEventsRepository.remove(calendarEvent);
    }
}
