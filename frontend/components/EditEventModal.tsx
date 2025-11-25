'use client';

import { useState, useEffect } from 'react';
import { ObjectDefinition, CalendarEvent } from '@/types';
import EventForm from './EventForm';

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
    const objectDefinition = selectedEvent?.objectDefinition;


    // Avoid rendering until modal is open and we have an event
    if (!isOpen || !selectedEvent) return null;


    const handleClose = () => onClose();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Edit {objectDefinition?.name} {selectedEvent.title}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    {/* EventForm handles its own errors */}

                    {objects.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                                You need to create an object type first before creating events.
                            </p>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <EventForm
                                key={selectedEvent.id}
                                objects={objects}
                                initialObject={objectDefinition}
                                initialTitle={selectedEvent.title}
                                initialDescription={selectedEvent.description || ''}
                                initialStartDate={selectedEvent.startDate ? new Date(selectedEvent.startDate).toISOString().split('T')[0] : undefined}
                                initialAllDay={selectedEvent.allDay}
                                initialData={selectedEvent.data}
                                showObjectSelector={false}
                                onCancel={handleClose}
                                onSubmit={async (payload) => {
                                    await onSubmit(payload);
                                    onClose();
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
