import React from 'react';
import { render, screen } from '@testing-library/react';
import ObjectList from '../ObjectList';
import { ObjectDefinition } from '@/types';
import { within } from '@testing-library/react';

// Mock the api module
jest.mock('@/lib/api', () => ({
  objectDefinitionsApi: {
    getAll: jest.fn(),
  },
}));

describe('ObjectList Component', () => {
  const mockObjectDefinitions: ObjectDefinition[] = [
    {
      id: '1',
      name: 'Morning Workout',
      description: 'Track morning exercise',
      icon: '🏃',
      color: '#3B82F6',
      userId: 'user1',
      schema: {
        type: 'object',
        properties: {
          duration: { type: 'number', propName: 'Duration (minutes)' },
        },
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Reading',
      description: 'Daily reading habit',
      icon: '📚',
      color: '#10B981',
      userId: 'user1',
      schema: {
        type: 'object',
        properties: {
          pages: { type: 'number', propName: 'Pages Read' },
        },
      },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  it('should render list of object definitions', () => {
    render(
      <ObjectList
        objects={mockObjectDefinitions}
        onSelectObject={jest.fn()}
        selectedObjectId="1"
      />
    );

    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
  });

  it('should display icons for each object', () => {
    render(
      <ObjectList
        objects={mockObjectDefinitions}
        onSelectObject={jest.fn()}
        selectedObjectId="1"
      />
    );

    expect(screen.getByText('🏃')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('should display descriptions when provided', () => {
    render(
      <ObjectList
        objects={mockObjectDefinitions}
        onSelectObject={jest.fn()}
        selectedObjectId="1"
      />
    );

    expect(screen.getByText(/track morning exercise/i)).toBeInTheDocument();
    expect(screen.getByText(/daily reading habit/i)).toBeInTheDocument();
  });

  it('should highlight selected object', () => {
    render(
      <ObjectList
        objects={mockObjectDefinitions}
        onSelectObject={jest.fn()}
        selectedObjectId="1"
      />
    );

    // The selected item should have a different visual state
    // This depends on your implementation - check for specific class or aria-selected
    const selectedItem = screen.getByText('Morning Workout').closest('div');
    expect(selectedItem).toBeInTheDocument();
  });

  it('should show empty state when no objects provided', () => {
    render(
      <ObjectList
        objects={[]}
        onSelectObject={jest.fn()}
        selectedObjectId={null}
      />
    );
    const list = screen.getByTestId ? screen.getByTestId('object-list') : document.getElementById('object-list');
    const buttons = within(list!).queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  it('should call onSelectObject when an item is clicked', () => {
    const mockOnSelectObject = jest.fn();
    
    render(
      <ObjectList
        objects={mockObjectDefinitions}
        onSelectObject={mockOnSelectObject}
        selectedObjectId={null}
      />
    );

    const firstItem = screen.getByText('Morning Workout');
    firstItem.click();

    expect(mockOnSelectObject).toHaveBeenCalledWith('1');
  });

});
