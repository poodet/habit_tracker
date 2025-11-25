'use client';

import { CalendarEvent } from '@/types';
import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

interface GenericCalendarProps {
    events: CalendarEvent[];
    onCreateEvent?: (date?: Date) => void;
    initialView?: string;
    headerToolbar?: any;
    className?: string;
    onEventChange?(changeInfo: any): void;
    onEventClick?(clickInfo: any): void;
}

export interface CalendarHandle {
    getApi?: () => any;
    setOption?: (name: string, value: any) => void;
    changeView?: (view: string) => void;
}

const GenericCalendar = forwardRef(function GenericCalendar(
    {
        events,
        onCreateEvent,
        initialView = 'timeGridDay',
        headerToolbar,
        className,
        onEventChange,
        onEventClick,
    }: GenericCalendarProps,
    ref: any
) {
    const calendarRef = useRef<any>(null);

    const fcEvents = useMemo(() => (
        events.map(e => ({ id: e.id, title: e.title, start: e.startDate, allDay: e.allDay }))
    ), [events]);

    useImperativeHandle(ref, () => ({
        getApi: () => calendarRef.current?.getApi(),
        setOption: (name: string, value: any) => calendarRef.current?.getApi()?.setOption(name, value),
        changeView: (view: string) => calendarRef.current?.getApi()?.changeView(view),
    }), []);

    const defaultToolbar = headerToolbar ?? {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    };

    return (
        <div className={`w-full h-full flex flex-col ${className ?? ''}`}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-hidden flex-1 h-full">
                <div className="flex items-center justify-between mb-4">
                    <div />
                    <div />
                </div>

                <div className="h-full">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView={initialView}
                        headerToolbar={defaultToolbar}
                        editable={true}
                        events={fcEvents}
                        dateClick={(arg: any) => onCreateEvent?.(new Date(arg.date))}
                        height="100%"
                        expandRows={true}
                        eventChange={onEventChange}
                        eventClick={onEventClick}
                    />
                </div>
            </div>
        </div>
    );
});

export default GenericCalendar;
