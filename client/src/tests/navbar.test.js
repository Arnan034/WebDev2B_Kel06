// client/src/pages/components/Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../pages/components/navbar';

describe('Navbar Component', () => {
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CINELUX title', () => {
    render(
      <MemoryRouter>
        <Navbar isAuthenticated={false} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
    expect(screen.getByText(/CINELUX/i)).toBeInTheDocument();
  });

  test('renders Sign In and Sign Up buttons when not authenticated', () => {
    render(
      <MemoryRouter>
        <Navbar isAuthenticated={false} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders CMS button and user dropdown when authenticated', () => {
    sessionStorage.setItem('user', 'Test User');
    render(
      <MemoryRouter>
        <Navbar isAuthenticated={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
    expect(screen.getByText(/C M S/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  test('calls handleLogout and navigates on logout click', () => {
    render(
      <MemoryRouter>
        <Navbar isAuthenticated={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});