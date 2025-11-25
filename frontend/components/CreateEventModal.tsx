'use client';

import { ObjectDefinition } from '@/types';
import EventForm from './EventForm';

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
    const preselectedObject = selectedHabitId ? objects.find(obj => obj.id === selectedHabitId) : undefined;

    if (!isOpen) return null;

    const handleClose = () => onClose();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create New {selectedHabitId ? preselectedObject?.name + " Event" : "Event"}</h2>
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
                <EventForm
                    objects={objects}
                    initialObject={preselectedObject}
                    initialStartDate={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
                    initialAllDay={true}
                    initialData={undefined}
                    showObjectSelector={!selectedHabitId}
                    onCancel={handleClose}
                    onSubmit={async (payload) => {
                        await onSubmit(payload);
                        onClose();
                    }}
                />
                    )}
                </div>
            </div>
        </div>
    );
}
