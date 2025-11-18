'use client';

import { ObjectDefinition } from '@/types';

interface ObjectListProps {
    objects: ObjectDefinition[];
    selectedObjectId?: string;
    onSelectObject: (objectId: string) => void;
}

export default function ObjectList({ objects, selectedObjectId, onSelectObject }: ObjectListProps) {
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">My Objects</h2>

            {objects.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                    <p>No objects yet.</p>
                    <p className="mt-2">Create your first object to get started!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {objects.map((object) => (
                        <button
                            key={object.id}
                            onClick={() => onSelectObject(object.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedObjectId === object.id
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : 'bg-white border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {object.icon && (
                                    <span className="text-2xl">{object.icon}</span>
                                )}
                                {object.color && !object.icon && (
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: object.color }}
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">
                                        {object.name}
                                    </h3>
                                    {object.description && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {object.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <button className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                + New Object
            </button>
        </div>
    );
}
