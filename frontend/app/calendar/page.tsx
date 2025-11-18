'use client';

import { useState, useEffect } from 'react';
import { ObjectDefinition, CalendarEvent } from '@/types';
import { objectDefinitionsApi, calendarEventsApi } from '@/lib/api';
import ObjectList from '@/components/ObjectList';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
    const [objects, setObjects] = useState<ObjectDefinition[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedObjectId, setSelectedObjectId] = useState<string | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch objects and events in parallel
                const [objectsResponse, eventsResponse] = await Promise.all([
                    objectDefinitionsApi.getAll(),
                    calendarEventsApi.getAll(),
                ]);

                setObjects(objectsResponse.data);
                setEvents(eventsResponse.data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array = run once on mount

    const handleSelectObject = (objectId: string) => {
        // Toggle selection: if already selected, deselect it
        setSelectedObjectId(selectedObjectId === objectId ? undefined : objectId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your calendar...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <p className="text-sm text-gray-600 mt-4">
                        Make sure the backend is running and you're logged in.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Left sidebar with object list */}
            <ObjectList
                objects={objects}
                selectedObjectId={selectedObjectId}
                onSelectObject={handleSelectObject}
            />

            {/* Main calendar view */}
            <Calendar
                events={events}
                selectedObjectId={selectedObjectId}
            />
        </div>
    );
}
