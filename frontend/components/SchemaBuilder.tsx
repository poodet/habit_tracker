'use client';

import { useEffect, useState, useRef } from 'react';

interface SchemaField {
    key: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array';
    required: boolean;
    enumValues?: string[];
    enumRaw?: string;
    min?: number;
    max?: number;
    description?: string;
}

interface SchemaBuilderProps {
    onSchemaChange: (schema: any) => void;
    object?: any;
}

export default function SchemaBuilder({ onSchemaChange, object }: SchemaBuilderProps) {
    const [fields, setFields] = useState<SchemaField[]>([]);
    // avoid noisy logging on every render
    
    const addField = () => {
        const fieldLength = fields.length;
        const newField: SchemaField = {
            key: `field_${fieldLength}`,
            name: '',
            type: 'string',
            required: false,
        };
        setFields([...fields, newField]);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        updateSchema(newFields);
    };

    const updateField = (index: number, updates: Partial<SchemaField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
        updateSchema(newFields);
    };

    useEffect(() => {
        if (!object || !object.schema || !object.schema.properties) return;

        const props = object.schema.properties || {};
        const requiredArr: string[] = object.schema.required || [];

        const parsed: SchemaField[] = Object.entries(props).map(([key, schema]: [string, any]) => {
            const field: SchemaField = {
                key,
                name: schema.propName,
                type: 'string',
                required: requiredArr.includes(key),
            };

            if (schema.type === 'number') {
                field.type = 'number';
                field.min = schema.minimum;
                field.max = schema.maximum;
            } else if (schema.type === 'boolean') {
                field.type = 'boolean';
            } else if (schema.type === 'array') {
                field.type = 'array';
            } else if (schema.type === 'string' && schema.format === 'date') {
                field.type = 'date';
            } else if (Array.isArray(schema.enum)) {
                field.type = 'enum';
                field.enumValues = schema.enum;
                field.enumRaw = Array.isArray(schema.enum) ? schema.enum.join(', ') : undefined;
            }

            if (schema.description) field.description = schema.description;
            return field;
        });

        // Keep parent in sync with the original schema (optional)
        setFields(parsed);
        onSchemaChange(object.schema);
    }, [object]);

    const updateSchema = (currentFields: SchemaField[]) => {
        const properties: any = {};
        const required: string[] = [];

        currentFields.forEach(field => {
            if (!field.key) return;

            let fieldSchema: any = {};

            switch (field.type) {
                case 'string':
                    fieldSchema = { type: 'string' };
                    if (field.description) fieldSchema.description = field.description;
                    break;
                case 'number':
                    fieldSchema = { type: 'number' };
                    if (field.min !== undefined) fieldSchema.minimum = field.min;
                    if (field.max !== undefined) fieldSchema.maximum = field.max;
                    if (field.description) fieldSchema.description = field.description;
                    break;
                case 'boolean':
                    fieldSchema = { type: 'boolean' };
                    if (field.description) fieldSchema.description = field.description;
                    break;
                case 'date':
                    fieldSchema = { type: 'string', format: 'date' };
                    if (field.description) fieldSchema.description = field.description;
                    break;
                case 'enum':
                    fieldSchema = {
                        type: 'string',
                        enum: field.enumValues || [],
                    };
                    if (field.description) fieldSchema.description = field.description;
                    break;
                case 'array':
                    fieldSchema = {
                        type: 'array',
                        items: { type: 'string' },
                    };
                    if (field.description) fieldSchema.description = field.description;
                    break;
            }
            
            fieldSchema.propName = field.name || field.key; 

            properties[field.key] = fieldSchema;

            if (field.required) {
                required.push(field.key);
            }
        });

        const schema = {
            type: 'object',
            properties,
            ...(required.length > 0 && { required }),
        };

        onSchemaChange(schema);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Define Fields</h3>
                <button
                    type="button"
                    onClick={addField}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                    + Add Field
                </button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                    No fields yet. Click "Add Field" to start building your schema.
                </p>
            )}

            {fields.map((field, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Field Name
                            </label>
                            <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateField(index, { name: e.target.value })}
                                placeholder="e.g., mood, rating, notes"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={field.type}
                                onChange={(e) => updateField(index, {
                                    type: e.target.value as SchemaField['type']
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="string">Text</option>
                                <option value="number">Number</option>
                                <option value="boolean">Yes/No</option>
                                <option value="date">Date</option>
                                <option value="enum">Choice (Enum)</option>
                                <option value="array">List</option>
                            </select>
                        </div>
                    </div>

                    {field.type === 'number' && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Min Value (optional)
                                </label>
                                <input
                                    type="number"
                                    value={field.min ?? ''}
                                    onChange={(e) => updateField(index, {
                                        min: e.target.value ? Number(e.target.value) : undefined
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Max Value (optional)
                                </label>
                                <input
                                    type="number"
                                    value={field.max ?? ''}
                                    onChange={(e) => updateField(index, {
                                        max: e.target.value ? Number(e.target.value) : undefined
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {field.type === 'enum' && (
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Choices (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={field.enumRaw ?? field.enumValues?.join(', ') ?? ''}
                                onChange={(e) => updateField(index, { enumRaw: e.target.value })}
                                onBlur={(e) => {
                                    const vals = e.currentTarget.value
                                        .split(',')
                                        .map(v => v.trim())
                                        .filter(v => v);
                                    updateField(index, { enumValues: vals, enumRaw: undefined });
                                }}
                                placeholder="e.g., happy, sad, neutral, angry"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description (optional)
                        </label>
                        <input
                            type="text"
                            value={field.description ?? ''}
                            onChange={(e) => updateField(index, { description: e.target.value })}
                            placeholder="Describe this field..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(index, { required: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-gray-700">Required field</span>
                        </label>

                        <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
