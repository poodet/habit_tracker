import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('calendar-events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar-events')
export class CalendarEventsController {
    constructor(private readonly calendarEventsService: CalendarEventsService) { }

    @Post()
    create(@Request() req: any, @Body() createCalendarEventDto: CreateCalendarEventDto) {
        return this.calendarEventsService.create(req.user.userId, createCalendarEventDto);
    }

    @Get()
    @ApiQuery({ name: 'startDate', required: false, type: String })
    @ApiQuery({ name: 'endDate', required: false, type: String })
    findAll(
        @Request() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.calendarEventsService.findAll(req.user.userId, start, end);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.calendarEventsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateCalendarEventDto: UpdateCalendarEventDto,
    ) {
        return this.calendarEventsService.update(id, req.user.userId, updateCalendarEventDto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.calendarEventsService.remove(id, req.user.userId);
    }
}
