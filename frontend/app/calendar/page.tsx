'use client';

import { useState, useEffect, useCallback } from 'react';
import { ObjectDefinition, CalendarEvent } from '@/types';
import { objectDefinitionsApi, calendarEventsApi } from '@/lib/api';
import ObjectList from '@/components/ObjectList';
import Calendar from '@/components/Calendar';
import CreateObjectModal from '@/components/CreateObjectModal';
import HabitSettingsModal from '@/components/HabitSettingsModal';
import CreateEventModal from '@/components/CreateEventModal';
import CalendarHabit from '@/components/CalendarHabit';
import DeleteEventModal from '@/components/DeleteEventModal';
import EditEventModal from '@/components/EditEventModal';

export default function CalendarPage() {
    const [objects, setObjects] = useState<ObjectDefinition[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedObjectId, setSelectedObjectId] = useState<string | undefined>(); // todo - rename Habit
    const [selectedHabit, setSelectedHabit] = useState<ObjectDefinition | undefined>();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
    const [selectedEventTitle, setSelectedEventTitle] = useState<string | undefined>(undefined);
    const [deleteOpen, setShowDeleteEventModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateObjectModal, setShowCreateObjectModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [showEditEventModal, setShowEditEventModal] = useState(false);
    const [showHabitSettingModal, setShowHabitSettingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array = run once on mount

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

    const refreshEvents = useCallback(async () => {
        const res = await calendarEventsApi.getAll(); // adapt to your API client
        setEvents(res.data || []);
    }, []);


    // Delete Event Methods

    const handleDeleteEvent = (id: string, title?: string) => {
        setSelectedEventId(id);
        setSelectedEventTitle(title);
        setShowDeleteEventModal(true);
    };
    const handleConfirmDeleteEvent = useCallback(async () => {
        if (!selectedEventId) return;
        await calendarEventsApi.delete(selectedEventId); // or .remove / .deleteEvent - match your client
        await refreshEvents(); // parent refresh (reload list / calendar)
    }, [refreshEvents]);


    // Select Habit methods

    const handleSelectObject = (objectId: string) => {
        // Toggle selection: if already selected, deselect it
        // TODO - only select object, not id ?
        setSelectedObjectId(selectedObjectId === objectId ? undefined : objectId);
        const habitToEdit = objects.find(o => o.id === objectId);
        setSelectedHabit(habitToEdit);
    };


    // Create and Edit Event methods

    const handleCreateEvent = (date?: Date) => {
        setSelectedDate(date);
        setShowCreateEventModal(true);
    };
    const handleConfirmCreateEvent = useCallback(async (data: any) => {
        await calendarEventsApi.create(data);
        await refreshEvents();
    }, [refreshEvents]);

    const handleEditEvent = (id: string) => {
        setSelectedEventId(id);
        const eventToEdit = events.find(e => e.id === id);
        setSelectedEvent(eventToEdit);
        if (!eventToEdit) return;

        setSelectedDate(new Date(eventToEdit.startDate));
        setShowEditEventModal(true);
    }

    const handleConfirmUpdateEvent = useCallback(async (data: any) => {
        if (!selectedEventId) return;
        await calendarEventsApi.update(selectedEventId, data);
        await refreshEvents();
    }, [refreshEvents, selectedEventId]);

    // Create and edit Habits methods

    const handleConfirmCreateObject = useCallback(async (data: any) => {
        await objectDefinitionsApi.create(data);
        fetchData(); // Refresh data
    }, []);

    const handleConfirmUpdateObject = useCallback(async (id: string, data: any) => {
        await objectDefinitionsApi.update(id, data);
        await fetchData();
        setShowHabitSettingModal(false);
    }, [fetchData]);

    const handleHabitSetting = (habitId: string) => {
        // For simplicity, just alerting; replace with actual settings logic
        setSelectedObjectId(habitId);
        const habitToEdit = objects.find(o => o.id === habitId);
        if (!habitToEdit) return;

        setSelectedHabit(habitToEdit);
        setShowHabitSettingModal(true);
    }


    // Global loading / error states

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
                onCreateNew={() => setShowCreateObjectModal(true)}
            />

            {/* Main calendar view */}
            {selectedObjectId ? (
                (() => {
                    const habit = objects.find(o => o.id === selectedObjectId);
                    const habitEvents = events.filter(e => e.objectDefinitionId === selectedObjectId);
                    return (
                        <CalendarHabit
                            events={habitEvents}
                            habit={habit}
                            onCreateEvent={handleCreateEvent}
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent}
                            onHabitSetting={handleHabitSetting}
                        />
                    );
                })()
            ) : (
                <Calendar
                    events={events}
                    selectedObjectId={selectedObjectId}
                    onCreateEvent={handleCreateEvent}
                />
            )}

            {/* Modals */}
            <CreateObjectModal
                isOpen={showCreateObjectModal}
                onClose={() => setShowCreateObjectModal(false)}
                onSubmit={handleConfirmCreateObject}
            />

            <CreateEventModal
                isOpen={showCreateEventModal}
                onClose={() => {
                    setShowCreateEventModal(false);
                    setSelectedDate(undefined);
                }}
                onSubmit={handleConfirmCreateEvent}
                objects={objects}
                selectedDate={selectedDate}
            />

            <DeleteEventModal
                isOpen={deleteOpen}
                onClose={() => {
                    setShowDeleteEventModal(false)
                }
                }
                itemLabel={selectedEventTitle}
                onSubmit={handleConfirmDeleteEvent}
            />

            {selectedEvent && (
                <EditEventModal
                    isOpen={showEditEventModal}
                    onClose={() => {
                        setShowEditEventModal(false);
                        setSelectedDate(undefined);
                        setSelectedEventId(null);
                        setSelectedEvent(undefined);
                    }}
                    onSubmit={handleConfirmUpdateEvent}
                    objects={objects}
                    selectedEvent={selectedEvent}
                />
            )}

            <HabitSettingsModal
                isOpen={showHabitSettingModal}
                onClose={() => setShowHabitSettingModal(false)}
                object={selectedHabit}
                onSubmit={handleConfirmUpdateObject}
            />


        </div>
    );
}