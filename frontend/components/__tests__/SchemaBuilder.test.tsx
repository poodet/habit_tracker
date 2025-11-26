import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SchemaBuilder from '../SchemaBuilder';

describe('SchemaBuilder Component', () => {
  const mockOnSchemaChange = jest.fn();

  beforeEach(() => {
    mockOnSchemaChange.mockClear();
  });

  it('should render with Add Field button', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    expect(screen.getByRole('button', { name: /add field/i })).toBeInTheDocument();
  });

  it('should add a new field when Add Field button is clicked', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByRole('button', { name: /add field/i });
    fireEvent.click(addButton);

    // Should show field inputs
    expect(screen.getByTestId('field-name-input')).toBeInTheDocument();
  });

  it('should have type dropdown with correct options', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByTestId('add-field-button');
    fireEvent.click(addButton);

    const typeSelect = screen.getByRole('combobox');
    expect(typeSelect).toBeInTheDocument();

    // Check if we have the type select (might have multiple selects)
    const options = screen.getAllByRole('option');
    
    const optionValues = options.map(opt => opt.value);
    expect(optionValues).toContain('string');
    expect(optionValues).toContain('number');
    expect(optionValues).toContain('boolean');
    expect(optionValues).toContain('date');
  });


  it('should update field name and notify schema change', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByTestId('add-field-button');
    fireEvent.click(addButton);

    const nameInput = screen.getByTestId('field-name-input');
    fireEvent.change(nameInput, { target: { value: 'Email Address' } });

    expect(nameInput).toHaveValue('Email Address');
    expect(mockOnSchemaChange).toHaveBeenCalled();
  });

  it('should remove field when remove button is clicked', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    // Add a field
    const addButton = screen.getByTestId('add-field-button');
    fireEvent.click(addButton);

    const nameInput = screen.getByTestId('field-name-input');
    expect(nameInput).toBeInTheDocument();

    // Remove the field
    const removeButton = screen.getByRole('button', { name: /remove|delete|×|x/i });
    fireEvent.click(removeButton);

    // Field should be gone
    expect(screen.queryByTestId('field-name-input')).not.toBeInTheDocument();
  });

  it('should allow adding multiple fields', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByTestId('add-field-button');
    // initially there should be no schema-field elements
    expect(screen.queryAllByTestId('schema-field')).toHaveLength(0);

    // Add first field
    fireEvent.click(addButton);
    // Add second field
    fireEvent.click(addButton);

    expect(screen.getAllByTestId('schema-field')).toHaveLength(2);
  });

  it('should toggle required checkbox', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByTestId('add-field-button');
    fireEvent.click(addButton);

    const requiredCheckbox = screen.getByRole('checkbox', { name: /required/i });
    expect(requiredCheckbox).not.toBeChecked();

    fireEvent.click(requiredCheckbox);
    expect(requiredCheckbox).toBeChecked();
  });

  it('should show additional fields for number type', () => {
    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} />);

    const addButton = screen.getByTestId('add-field-button');
    fireEvent.click(addButton);

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'number' } });

    // Should show min/max fields
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
  });


  it('should load existing schema when object prop is provided', () => {
    const existingObject = {
      schema: {
        properties: {
          name: {
            type: 'string',
            propName: 'Full Name',
          },
          age: {
            type: 'number',
            propName: 'Age',
            minimum: 0,
            maximum: 120,
          },
        },
        required: ['name'],
      },
    };

    render(<SchemaBuilder onSchemaChange={mockOnSchemaChange} object={existingObject} />);

    expect(screen.getAllByTestId('schema-field')).toHaveLength(2);
    
    expect(screen.getByDisplayValue('Full Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Age')).toBeInTheDocument();
  });
});
