'use client';

import { CalendarEvent } from '@/types';
import GenericCalendar, { CalendarHandle as GenericCalendarHandle } from './GenericCalendar';
import React from 'react';

interface CalendarProps {
    events: CalendarEvent[];
    selectedObjectId?: string;
    onCreateEvent: (date?: Date) => void;
}

export type CalendarHandle = GenericCalendarHandle;

const Calendar = React.forwardRef(function Calendar(
    { events, selectedObjectId, onCreateEvent }: CalendarProps,
    ref: any
) {
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
                initialView="listWeek"
            />
        </div>
    );
});

export default Calendar;
