'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    /** When true clicking the backdrop closes the modal (default: true) */
    closeOnOverlayClick?: boolean;
    /** Additional classes for the modal panel */
    className?: string;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    closeOnOverlayClick = true,
    className,
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Save previously focused element to restore it when closing
        const previousActive = document.activeElement as HTMLElement | null;

        // Prevent page scroll while modal is open
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Close on Escape
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        // Focus the modal panel for accessibility
        const focusTimeout = window.setTimeout(() => {
            panelRef.current?.focus();
        }, 0);

        return () => {
            window.clearTimeout(focusTimeout);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
            previousActive?.focus?.();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayMouseDown = (e: React.MouseEvent) => {
        // only close if user clicks the overlay itself, not children
        if (!closeOnOverlayClick) return;
        if (e.target === overlayRef.current) onClose();
    };

    const modal = (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={handleOverlayMouseDown}
            aria-hidden={false}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                ref={panelRef}
                tabIndex={-1}
                onMouseDown={(e) => e.stopPropagation()}
                className={`bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col outline-none ${className ?? ''}`}
            >
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                    {title ? (
                        <h3 id="modal-title" className="text-lg font-semibold">
                            {title}
                        </h3>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-gray-500 hover:text-gray-700 rounded-md p-1"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>

                {footer && (
                    <div className="flex gap-3 px-4 pb-4 pt-3 border-t flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}