'use client';

import { useState, useEffect } from 'react';

interface DynamicFormProps {
    schema: any;
    initialData?: any;
    onDataChange: (data: any) => void;
}

export default function DynamicForm({ schema, initialData = {}, onDataChange }: DynamicFormProps) {
    const [formData, setFormData] = useState<any>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (fieldName: string, value: any) => {
        const newData = { ...formData, [fieldName]: value };
        setFormData(newData);
        onDataChange(newData);
    };

    if (!schema || !schema.properties) {
        return (
            <p className="text-sm text-gray-500 py-4">
                No schema defined. Please create an object definition first.
            </p>
        );
    }

    const properties = schema.properties || {};
    const required = schema.required || [];

    return (
        <div className="space-y-4">
            {Object.entries(properties).map(([fieldName, fieldSchema]: [string, any]) => {
                const isRequired = required.includes(fieldName);
                const value = formData[fieldName];

                return (
                    <div key={fieldName}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {fieldName}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                            {fieldSchema.description && (
                                <span className="text-xs text-gray-500 ml-2">
                                    ({fieldSchema.description})
                                </span>
                            )}
                        </label>

                        {/* String with enum (dropdown) */}
                        {fieldSchema.enum && (
                            <select
                                value={value || ''}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required={isRequired}
                            >
                                <option value="">Select...</option>
                                {fieldSchema.enum.map((option: string) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Number */}
                        {fieldSchema.type === 'number' && (
                            <input
                                type="number"
                                value={value ?? ''}
                                onChange={(e) => handleChange(
                                    fieldName,
                                    e.target.value ? Number(e.target.value) : undefined
                                )}
                                min={fieldSchema.minimum}
                                max={fieldSchema.maximum}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required={isRequired}
                            />
                        )}

                        {/* Boolean */}
                        {fieldSchema.type === 'boolean' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={value || false}
                                    onChange={(e) => handleChange(fieldName, e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-600">Yes</span>
                            </div>
                        )}

                        {/* Date */}
                        {fieldSchema.format === 'date' && (
                            <input
                                type="date"
                                value={value || ''}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required={isRequired}
                            />
                        )}

                        {/* Array */}
                        {fieldSchema.type === 'array' && (
                            <textarea
                                value={Array.isArray(value) ? value.join(', ') : ''}
                                onChange={(e) => handleChange(
                                    fieldName,
                                    e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                )}
                                placeholder="Enter items separated by commas"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows={2}
                                required={isRequired}
                            />
                        )}

                        {/* Regular String */}
                        {fieldSchema.type === 'string' && !fieldSchema.enum && !fieldSchema.format && (
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required={isRequired}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
