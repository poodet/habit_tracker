'use client';

import { ObjectDefinition } from '@/types';

interface ObjectListProps {
    objects: ObjectDefinition[];
    selectedObjectId?: string;
    onSelectObject: (objectId: string) => void;
    onCreateNew: () => void;
}

export default function ObjectList({ objects, selectedObjectId, onSelectObject, onCreateNew }: ObjectListProps) {
    return (
        <div className="flex flex-col w-full max-w-sm bg-gray-50 border-r border-gray-200 p-4 h-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">My Habits</h2>
            <div data-testid="object-list" className="overflow-y-auto min-h-0">
                {objects.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-8">
                        <p>No habits yet.</p>
                        <p className="mt-2">Create your first habit to get started!</p>
                    </div>
                ) : (
                    <div  className="grid grid-flow-rows grid-cols-2 gap-4">
                        {objects.map((object) => (
                            <button
                                key={object.id}
                                onClick={() => onSelectObject(object.id)}
                                className={`aspect-square flex flex-col items-center justify-center text-center p-3 rounded-lg col-span-1 transition-colors ${selectedObjectId === object.id
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : 'bg-white border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    {object.icon && (
                                        <span className="text-3xl">{object.icon}</span>
                                    )}
                                    {object.color && !object.icon && (
                                        <div
                                            className="w-8 h-8 rounded-full"
                                            style={{ backgroundColor: object.color }}
                                        />
                                    )}
                                    <div className="mt-1">
                                        <h3 className="font-medium text-gray-900 text-center">
                                            {object.name}
                                        </h3>
                                        {object.description && (
                                            <p className="text-xs text-gray-500 text-center">
                                                {object.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>


            <div className="mt-4">
                <button
                    onClick={onCreateNew}
                    className="block w-full sm:w-3/4 mx-auto p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-center"
                >
                    + New Habit
                </button>
            </div>
        </div>
    );
}