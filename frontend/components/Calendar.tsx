'use client';

import { CalendarEvent } from '@/types';
import { useState, useMemo } from 'react';

interface CalendarProps {
    events: CalendarEvent[];
    selectedObjectId?: string;
}

export default function Calendar({ events, selectedObjectId }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Filter events by selected object
    const filteredEvents = useMemo(() => {
        if (!selectedObjectId) return events;
        return events.filter(event => event.objectDefinitionId === selectedObjectId);
    }, [events, selectedObjectId]);

    // Get the calendar grid data
    const { year, month, days } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Create array of days with empty slots for alignment
        const days = [];

        // Add empty slots for days before the month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return { year, month, days };
    }, [currentDate]);

    // Get events for a specific day
    const getEventsForDay = (date: Date) => {
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.startDate);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const today = new Date();
    const isToday = (date: Date | null) => {
        if (!date) return false;
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <div className="flex-1 p-6 bg-white">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {monthNames[month]} {year}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextMonth}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div
                        key={day}
                        className="text-center font-semibold text-gray-600 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const dayEvents = date ? getEventsForDay(date) : [];

                    return (
                        <div
                            key={index}
                            className={`min-h-24 p-2 border rounded-lg ${date
                                    ? isToday(date)
                                        ? 'bg-blue-50 border-blue-300 border-2'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    : 'bg-gray-50 border-gray-100'
                                }`}
                        >
                            {date && (
                                <>
                                    <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-blue-600' : 'text-gray-700'
                                        }`}>
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Stats section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                    {selectedObjectId ? 'Filtered Events' : 'All Events'}
                </h3>
                <p className="text-sm text-gray-600">
                    {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} in {monthNames[month]}
                </p>
            </div>
        </div>
    );
}
