import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventsService } from './calendar-events.service';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEvent } from './entities/calendar-event.entity';
import { ObjectDefinitionsModule } from '../object-definitions/object-definitions.module';
import { SchemaValidationService } from '../common/schema-validation.service';

@Module({
    imports: [TypeOrmModule.forFeature([CalendarEvent]), ObjectDefinitionsModule],
    controllers: [CalendarEventsController],
    providers: [CalendarEventsService, SchemaValidationService],
})
export class CalendarEventsModule { }
