'use client';

import { useState } from 'react';
import { ObjectDefinition } from '@/types';
import Modal from './Modal';

// modal to delete an event

interface DeleteEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    /**
     * Called when the user confirms the deletion.
     * Should perform the actual deletion and throw/reject on error.
     */
    onSubmit: (id?: string) => Promise<void> | void;
    /** Optional title/label for the item being deleted (for UX) */
    itemLabel?: string;
    eventId?: string;
}

export default function DeleteEventModal({
    isOpen,
    onClose,
    onSubmit,
    itemLabel,
    eventId,
}: DeleteEventModalProps) {
    // const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            setLoading(true);
            await onSubmit(eventId);
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Event">
            <div className="space-y-4">
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{itemLabel ?? 'this event'}</strong>? This action cannot be undone.
                </p>

                {error && (
                    <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-3 py-2 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                    >
                        {loading ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );


};