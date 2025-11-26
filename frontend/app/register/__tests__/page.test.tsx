import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '@/app/register/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/register',
  }),
}));

// Mock the api module
jest.mock('@/lib/api', () => ({
  authApi: {
    register: jest.fn(),
  },
}));

describe('Register Page', () => {
  it('should render registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /account/i })).toBeInTheDocument();
  });

  it('should have email input', () => {
    render(<RegisterPage />);

    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  it('should have password input', () => {
    render(<RegisterPage />);

    expect(screen.getByText(/^password$/i)).toBeInTheDocument();
  });

  it('should have a submit button', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('button', { name: /register|sign up|account/i })).toBeInTheDocument();
  });

});
