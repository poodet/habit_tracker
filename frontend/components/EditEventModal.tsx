'use client';

import { useState, useEffect } from 'react';
import { ObjectDefinition, CalendarEvent } from '@/types';
import EventForm from './EventForm';
import Modal from './Modal';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSuccess: () => void;
    onSubmit: (data: {
        title: string;
        description?: string;
        startDate: Date;
        allDay: boolean;
        data: any;
        objectDefinitionId: string;
    }) => Promise<void>;
    objects: ObjectDefinition[];
    selectedEvent?: CalendarEvent;
}

export default function EditEventModal({
    isOpen,
    onClose,
    onSubmit,
    objects,
    selectedEvent,
}: EditEventModalProps) {
    const [loading, setLoading] = useState(false);
    const objectDefinition = selectedEvent?.objectDefinition;

    const handleSubmit = async (payload: {
        title: string;
        description?: string;
        startDate: Date;
        allDay: boolean;
        data: any;
        objectDefinitionId: string;
    }) => {
        setLoading(true);
        try {
            await onSubmit(payload);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    // Avoid rendering until modal is open and we have an event
    if (!isOpen || !selectedEvent) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${objectDefinition?.name} ${selectedEvent.title}`}
            className="max-w-2xl"
        >
            {objects.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                        You need to create an object type first before creating events.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <EventForm
                    key={selectedEvent.id}
                    objects={objects}
                    initialObject={objectDefinition}
                    initialTitle={selectedEvent.title}
                    initialDescription={selectedEvent.description || ''}
                    initialStartDate={selectedEvent.startDate ? new Date(selectedEvent.startDate).toISOString() : undefined}
                    initialAllDay={selectedEvent.allDay}
                    initialData={selectedEvent.data}
                    showObjectSelector={false}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            )}
        </Modal>
    );
}
