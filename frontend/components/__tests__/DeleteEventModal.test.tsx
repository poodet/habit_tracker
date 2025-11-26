import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteEventModal from '../DeleteEventModal';

describe('DeleteEventModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should render when isOpen is true', () => {
    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <DeleteEventModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText(/are you sure you want to delete/i)).not.toBeInTheDocument();
  });

  it('should display custom item label', () => {
    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        itemLabel="Morning Run"
      />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
  });

  it('should display default label when no itemLabel provided', () => {
    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('this event')).toBeInTheDocument();
  });

  it('should have Delete and Cancel buttons', () => {
    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when Delete button is clicked', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        eventId="event-123"
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('event-123');
    });
  });

  it('should close modal after successful deletion', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show loading state while deleting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Button should show loading state
    expect(deleteButton).toBeDisabled();
  });

  it('should display error message on deletion failure', async () => {
    const errorMessage = 'Network error: Could not delete event';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Modal should remain open
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should display generic error message when error has no message', async () => {
    mockOnSubmit.mockRejectedValue({});

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to delete item/i)).toBeInTheDocument();
    });
  });

  it('should disable Cancel button while loading', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <DeleteEventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeDisabled();
  });
});
