'use client';

import { CalendarEvent } from '@/types';
import GenericCalendar, { CalendarHandle as GenericCalendarHandle } from './GenericCalendar';
import React from 'react';

interface CalendarProps {
    events: CalendarEvent[];
    selectedObjectId?: string;
    onCreateEvent: (date?: Date) => void;
    onEditEventDateTime: (id:string, data: any) => void;
}

export type CalendarHandle = GenericCalendarHandle;

const Calendar = React.forwardRef(function Calendar(
    { events, selectedObjectId, onCreateEvent, onEditEventDateTime }: CalendarProps,
    ref: any
) {

    const handleEventChange = (changeInfo: any) => {
        const id = changeInfo.event.id;
        const data = {
            startDate: new Date(changeInfo.event.start),
            endDate: new Date(changeInfo.event.end),
            allDay: changeInfo.event.allDay,
        };
        onEditEventDateTime(id, data)
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <div className="flex gap-2 ml-4">
                <button
                    onClick={() => onCreateEvent()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                    + New Event
                </button>
            </div>
            <GenericCalendar
                ref={ref}
                events={events}
                onCreateEvent={onCreateEvent}
                onEventChange={handleEventChange}

            />
        </div>
    );
});

export default Calendar;
