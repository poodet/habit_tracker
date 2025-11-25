"use client";

import { useEffect, useState } from 'react';
import { ObjectDefinition } from '@/types';
import DynamicForm from './DynamicForm';

interface EventFormProps {
    objects: ObjectDefinition[];
    initialObject?: ObjectDefinition | undefined;
    initialTitle?: string;
    initialDescription?: string;
    initialStartDate?: string; // YYYY-MM-DD
    initialAllDay?: boolean;
    initialData?: any;
    showObjectSelector?: boolean; // when false, object is fixed (e.g. edit or preselected habit)
    onCancel: () => void;
    onSubmit: (payload: {
        title: string;
        description?: string;
        startDate: Date;
        allDay: boolean;
        data: any;
        objectDefinitionId: string;
    }) => Promise<void>;
}

export default function EventForm({
    objects,
    initialObject,
    initialTitle = '',
    initialDescription = '',
    initialStartDate = new Date().toISOString().split('T')[0],
    initialAllDay = true,
    initialData = {},
    showObjectSelector = true,
    onCancel,
    onSubmit,
}: EventFormProps) {
    const [objectDefinition, setObjectDefinition] = useState<ObjectDefinition | undefined>(initialObject);
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [allDay, setAllDay] = useState(initialAllDay);
    const [eventData, setEventData] = useState<any>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // keep objectDefinition in sync if initialObject changes (modal opens with selected habit)
        setObjectDefinition(initialObject);
    }, [initialObject]);

    // When parent provides new initial values (e.g. editing an event), update local state
    useEffect(() => {
        setTitle(initialTitle ?? '');
        setDescription(initialDescription ?? '');
        setStartDate(initialStartDate ?? new Date().toISOString().split('T')[0]);
        setAllDay(initialAllDay ?? true);
        setEventData(initialData ?? {});
    }, [initialTitle, initialDescription, initialStartDate, initialAllDay, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!objectDefinition) {
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
                objectDefinitionId: objectDefinition.id,
            });

            // reset handled by parent modals if they want; keep minimal here
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Failed to save event';
            setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {showObjectSelector && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Object Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={objectDefinition?.id || ''}
                        onChange={(e) => {
                            setObjectDefinition(objects.find(obj => obj.id === e.target.value));
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
            )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
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

            {objectDefinition && (
                <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">{objectDefinition.name} Details</h3>
                    <DynamicForm
                        schema={objectDefinition.schema}
                        initialData={eventData}
                        onDataChange={setEventData}
                    />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
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
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
