'use client';

import { CalendarEvent } from '@/types';
import GenericCalendar, { CalendarHandle } from './GenericCalendar';
import { useRef, useEffect, useState, useCallback } from 'react';
import DeleteEventModal from './DeleteEventModal';
import { calendarEventsApi } from '@/lib/api'; // or your API helper

// Re-use Calendar but show a header with the habit name and wrap it in a smaller container

interface CalendarHabitProps {
    events: CalendarEvent[]; // events already filtered for the selected habit
    habitName?: string;
    onCreateEvent: (date?: Date) => void;
    onDeleteEvent: (id: string, title?: string) => void;
}

export default function CalendarHabit({ events, habitName, onCreateEvent, onDeleteEvent }: CalendarHabitProps) {
    const calendarRef = useRef<CalendarHandle | null>(null);

    useEffect(() => {
        // hide the Today button by replacing headerToolbar
        calendarRef.current?.setOption?.('headerToolbar', {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        });
    }, []);

    return (
        <>
            <div className="w-full min-h-screen bg-white flex flex-col p-2">
                <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {habitName ? habitName : 'Habit Calendar'}
                    </h1>
                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                        Settings
                    </button>
                </div>

                <div className="flex flex-1">
                    <div className="w-1/2 flex-1 p-6 overflow-auto">
                        <div className="mb-4 flex ">
                            <div className='flex-1'>
                                <h2 className="text-lg font-medium text-gray-700">Events</h2>
                                <p className="text-sm text-gray-500">{events.length} event{events.length !== 1 ? 's' : ''}</p>
                            </div>

                            <button
                                onClick={() => onCreateEvent()}
                                className="mx-auto p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium text-center"
                            >
                                + New Event
                            </button>
                        </div>

                        <ul className="space-y-3">
                            {events.map(ev => (
                                <button className="w-full p-3 border border-gray-300 rounded-md flex text-left">
                                    <div key={ev.id} className="flex-1 align-start">
                                        <div className="font-medium text-gray-800">{ev.title}</div>
                                        <div className="text-sm text-gray-500">{new Date(ev.startDate).toLocaleString()}</div>
                                    </div>
                                    <button
                                        className="px-4 flex-none bg-red-500 text-white hover:bg-red-600 rounded-full text-sm"
                                        onClick={() => onDeleteEvent(ev.id, ev.title)}
                                    >
                                        ✕
                                    </button>
                                </button>
                            ))}
                        </ul>
                    </div>

                    <div className="w-1/2 flex-1 p-0 overflow-hidden">
                        <div className="h-full">
                            <GenericCalendar
                                ref={calendarRef}
                                events={events}
                                onCreateEvent={onCreateEvent}
                                headerToolbar={{ left: 'prev,next', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' }}
                            />
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}