import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked (mousedown)', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    // Find the backdrop overlay (the fixed div with bg-black/50)
    const overlay = screen.getByRole('dialog').parentElement;
    if (overlay) {
      fireEvent.mouseDown(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    const modalContent = screen.getByText('Modal content');
    fireEvent.mouseDown(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should not close on overlay click when closeOnOverlayClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" closeOnOverlayClick={false}>
        <p>Modal content</p>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    if (overlay) {
      fireEvent.mouseDown(overlay);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });
});
