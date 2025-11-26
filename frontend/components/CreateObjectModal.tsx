'use client';

import { useState, useMemo, useCallback } from 'react';
import { objectDefinitionsApi } from '@/lib/api';
import SchemaBuilder from './SchemaBuilder';
import Modal from './Modal';

interface CreateObjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        icon?: string;
        color: string;
        schema: any;
    }) => Promise<void>;
}

export default function CreateObjectModal({ isOpen, onClose, onSubmit }: CreateObjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [color, setColor] = useState('#3B82F6');
    const [schema, setSchema] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = useCallback(() => {
        if (!loading) {
            setError(null);
            onClose();
        }
    }, [loading, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!schema || Object.keys(schema.properties || {}).length === 0) {
            setError('Please define at least one field for your object');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit({
                name,
                description: description || undefined,
                icon: icon || undefined,
                color,
                schema,
            });


            // Reset form
            setName('');
            setDescription('');
            setIcon('');
            setColor('#3B82F6');
            setSchema(null);

            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create object definition');
        } finally {
            setLoading(false);
        }
    };

    const footer = useMemo(() => (
        <>
            <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ml-auto"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="create-object-form"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Object Type'}
            </button>
        </>
    ), [loading, handleClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Object Type"
            className="max-w-3xl"
            footer={footer}
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form id="create-object-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Mood Tracker, Meal Log"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon (emoji)
                                </label>
                                <input
                                    type="text"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    placeholder="😊 🌱 🍽️"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this object is used for..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-10 w-20 rounded border border-gray-300"
                                />
                                <span className="text-sm text-gray-600">{color}</span>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <SchemaBuilder onSchemaChange={setSchema} />
                        </div>
                    </form>
        </Modal>
    );
}
