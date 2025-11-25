'use client';

import { useState, useEffect, useRef } from 'react';

interface DynamicFormProps {
    schema: any;
    initialData?: any;
    onDataChange: (data: any) => void;
    object?: any;
}

export default function DynamicForm({ schema, initialData = {}, onDataChange, object }: DynamicFormProps) {
    const [formData, setFormData] = useState<any>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    // Refs to manage focus for dynamic array inputs: map fieldName -> array of refs
    const inputRefs = useRef<Record<string, Array<HTMLInputElement | null>>>({});

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
                let value = object?.data[fieldName] ?? formData[fieldName];

                if(fieldSchema.type === 'array' && !value) {
                    // allow to initialize empty array to display one first input
                    value = [''];
                }

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
                            <div>
                                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
                                    { (Array.isArray(value) ? value : (value ? [value] : [])).map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={item ?? ''}
                                                ref={(el) => {
                                                    if (!inputRefs.current[fieldName]) inputRefs.current[fieldName] = [];
                                                    inputRefs.current[fieldName][idx] = el;
                                                }}
                                                onChange={(e) => {
                                                    const arr = Array.isArray(value) ? [...value] : (value ? [value] : []);
                                                    arr[idx] = e.target.value;
                                                    handleChange(fieldName, arr);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const arr = Array.isArray(value) ? [...value] : (value ? [value] : []);
                                                        arr.splice(idx + 1, 0, '');
                                                        handleChange(fieldName, arr);
                                                        // focus the newly created input on next tick
                                                        setTimeout(() => {
                                                            const ref = inputRefs.current[fieldName]?.[idx + 1];
                                                            ref?.focus();
                                                        }, 0);
                                                    }
                                                }}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                            />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const arr = Array.isArray(value) ? [...value] : (value ? [value] : []);
                                                        arr.splice(idx, 1);
                                                        handleChange(fieldName, arr);
                                                        // shift focus to next item or previous one
                                                        setTimeout(() => {
                                                            const nextRef = inputRefs.current[fieldName]?.[idx] || inputRefs.current[fieldName]?.[idx - 1];
                                                            nextRef?.focus();
                                                        }, 0);
                                                    }}
                                                className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded"
                                                aria-label={`Remove item ${idx + 1}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const arr = Array.isArray(value) ? [...value] : (value ? [value] : []);
                                            arr.push('');
                                            handleChange(fieldName, arr);
                                            setTimeout(() => {
                                                const ref = inputRefs.current[fieldName]?.[arr.length - 1];
                                                ref?.focus();
                                            }, 0);
                                        }}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>
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
