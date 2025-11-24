'use client';

import { CalendarEvent, ObjectDefinition } from '@/types';
import GenericCalendar, { CalendarHandle } from './GenericCalendar';
import { useRef, useEffect, useCallback, useMemo } from 'react';

// Re-use Calendar but show a header with the habit name and wrap it in a smaller container

interface CalendarHabitProps {
    events: CalendarEvent[]; // events already filtered for the selected habit
    habit?: ObjectDefinition;
    onCreateEvent: (date?: Date) => void;
    onDeleteEvent: (id: string, title?: string) => void;
    onEditEvent: (id: string) => void;
    onHabitSetting: (habitId: string) => void;
}

export default function CalendarHabit({ events, habit, onCreateEvent, onDeleteEvent, onEditEvent, onHabitSetting }: CalendarHabitProps) {
    const calendarRef = useRef<CalendarHandle | null>(null);

    // Helper: compute grouped events by local date string
    const getGroupedEvents = useCallback((items: CalendarEvent[]): Record<string, CalendarEvent[]> => {
        const sorted = [...items].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const grouped: Record<string, CalendarEvent[]> = {};
        sorted.forEach(ev => {
            const dateKey = new Date(ev.startDate).toLocaleDateString();
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(ev);
        });
        return grouped;
    }, []);

    // Memoized grouped data to avoid recomputing on every render
    const grouped = useMemo(() => getGroupedEvents(events), [events, getGroupedEvents]);

    // Helper: render grouped events list (keeps return JSX concise)
    const renderGroupedList = (groups: Record<string, CalendarEvent[]>) => {
        return (
            <ul className="space-y-6 overflow-y-scroll flex-1 max-h-96">
                {Object.entries(groups).map(([date, evs]) => (
                    <li key={date} className="">
                        <div className="mb-2">
                            <div className="text-sm font-semibold text-gray-600">{date}</div>
                        </div>

                        <ul className="space-y-3">
                            {evs.map(ev => (
                                <li
                                    key={ev.id}
                                    role="button"
                                    tabIndex={0}
                                    className="w-full p-3 border border-gray-300 rounded-md flex text-left  cursor-pointer"
                                    onClick={() => onEditEvent(ev.id)}
                                >
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">{ev.title}</div>
                                        <div className="text-sm text-gray-500">{new Date(ev.startDate).toLocaleTimeString()}</div>
                                    </div>
                                    <button
                                        className="px-4 flex-none bg-red-500 text-white hover:bg-red-600 rounded-full text-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteEvent(ev.id, ev.title);
                                        }}
                                        aria-label={`Delete ${ev.title}`}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        );
    };

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
            <div className="w-full min-h-screen h-full bg-white flex flex-col p-2">
                <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {habit ? habit.name : 'Habit Calendar'}
                    </h1>
                    <button
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                        onClick={() => onHabitSetting(habit?.id || '')}
                    >
                        Settings
                    </button>
                </div>

                <div className="flex">
                    <div className="w-1/2 flex-1 p-6 min-h-0">
                        <div className="mb-4 flex ">
                            <div className='flex-1'>
                                <h2 className="text-lg font-medium text-gray-700">Events</h2>
                                <p className="text-sm text-gray-500">{events.length} event{events.length !== 1 ? 's' : ''}</p>
                            </div>

                            <button
                                onClick={() => onCreateEvent()}
                                className="mx-auto p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium text-center"
                            >
                                + add {habit ? habit.name : ''}
                            </button>
                        </div>

                        {renderGroupedList(grouped)}
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