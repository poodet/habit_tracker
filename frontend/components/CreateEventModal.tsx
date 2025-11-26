'use client';

import { useState } from 'react';
import { ObjectDefinition } from '@/types';
import EventForm from './EventForm';
import Modal from './Modal';

interface CreateEventModalProps {
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
    selectedHabitId?: string;
    selectedDate?: Date;
}

export default function CreateEventModal({
    isOpen,
    onClose,
    onSubmit,
    objects,
    selectedDate,
    selectedHabitId,
}: CreateEventModalProps) {
    const [loading, setLoading] = useState(false);
    const preselectedObject = selectedHabitId ? objects.find(obj => obj.id === selectedHabitId) : undefined;

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Create New ${selectedHabitId ? preselectedObject?.name + ' Event' : 'Event'}`}
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
                    objects={objects}
                    initialObject={preselectedObject}
                    initialStartDate={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
                    initialAllDay={true}
                    initialData={undefined}
                    showObjectSelector={!selectedHabitId}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            )}
        </Modal>
    );
}
