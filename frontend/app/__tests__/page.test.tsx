import React from 'react';
import { render, screen } from '@testing-library/react';
import RootPage from '@/app/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

// Mock the api module
jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

describe('Login Page (Root Page)', () => {


  it('should have email and password inputs', () => {
    render(<RootPage />);

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });

  it('should have a submit button', () => {
    render(<RootPage />);

    expect(screen.getByRole('button', { name: /login|sign in|log/i })).toBeInTheDocument();
  });

  it('should have a link to register page', () => {
    render(<RootPage />);

    const registerLink = screen.getByRole('link', { name: /register|account/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

});
