import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from '../DynamicForm';

describe('DynamicForm Component', () => {
  const mockOnDataChange = jest.fn();

  const textSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        propName: 'Name',
      },
    },
    required: ['name'],
  };

  const numberSchema = {
    type: 'object',
    properties: {
      age: {
        type: 'number',
        propName: 'Age',
      },
    },
  };

  beforeEach(() => {
    mockOnDataChange.mockClear();
  });

  it('should render form fields based on schema', () => {
    render(<DynamicForm schema={textSchema} onDataChange={mockOnDataChange} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show required indicator for required fields', () => {
    render(<DynamicForm schema={textSchema} onDataChange={mockOnDataChange} />);

    // Look for the asterisk indicating required field
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should handle text input and call onDataChange', () => {
    render(<DynamicForm schema={textSchema} onDataChange={mockOnDataChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(input).toHaveValue('John Doe');
    expect(mockOnDataChange).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('should handle number input', () => {
    render(<DynamicForm schema={numberSchema} onDataChange={mockOnDataChange} />);

    const input = screen.getByRole('spinbutton');
    
    fireEvent.change(input, { target: { value: '25' } });

    expect(input).toHaveValue(25);
    // Component correctly converts string to number
    expect(mockOnDataChange).toHaveBeenCalledWith({ age: 25 });
  });

  it('should populate initial values', () => {
    const initialData = { name: 'Jane Doe' };
    render(
      <DynamicForm
        schema={textSchema}
        onDataChange={mockOnDataChange}
        initialData={initialData}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Jane Doe');
  });

  it('should show message when no schema is provided', () => {
    render(<DynamicForm schema={{}} onDataChange={mockOnDataChange} />);

    expect(
      screen.getByText(/no schema defined/i)
    ).toBeInTheDocument();
  });

  it('should render dropdown for enum fields', () => {
    const enumSchema = {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          propName: 'Status',
          enum: ['Active', 'Inactive'],
        },
      },
    };

    render(<DynamicForm schema={enumSchema} onDataChange={mockOnDataChange} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
