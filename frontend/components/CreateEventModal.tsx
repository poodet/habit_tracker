'use client';

import { useState } from 'react';
import { ObjectDefinition } from '@/types';
import { calendarEventsApi } from '@/lib/api';
import DynamicForm from './DynamicForm';

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
    selectedDate?: Date;
}

export default function CreateEventModal({
    isOpen,
    onClose,
    onSubmit,
    objects,
    selectedDate,
}: CreateEventModalProps) {
    const [selectedObjectId, setSelectedObjectId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(
        selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [allDay, setAllDay] = useState(true);
    const [eventData, setEventData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const selectedObject = objects.find(obj => obj.id === selectedObjectId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedObjectId) {
            setError('Please select an object type');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit({
                title,
                description: description || undefined,
                startDate: new Date(startDate),
                allDay,
                data: eventData,
                objectDefinitionId: selectedObjectId,
            });

            // Reset form
            setTitle('');
            setDescription('');
            setSelectedObjectId('');
            setEventData({});
            setAllDay(true);

            onClose();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to create event';
            setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Object Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedObjectId}
                                    onChange={(e) => {
                                        setSelectedObjectId(e.target.value);
                                        setEventData({});
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Select an object type...</option>
                                    {objects.map(obj => (
                                        <option key={obj.id} value={obj.id}>
                                            {obj.icon && `${obj.icon} `}{obj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Feeling great today"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Additional details..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>

                                <div className="flex items-end">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={allDay}
                                            onChange={(e) => setAllDay(e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">All day event</span>
                                    </label>
                                </div>
                            </div>

                            {selectedObject && (
                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3">
                                        {selectedObject.name} Details
                                    </h3>
                                    <DynamicForm
                                        schema={selectedObject.schema}
                                        initialData={eventData}
                                        onDataChange={setEventData}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
