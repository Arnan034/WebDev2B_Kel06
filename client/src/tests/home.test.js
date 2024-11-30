// client/src/tests/home.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/main/home';

describe('Home Component', () => {
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home isAuthenticated={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
  });

  test('renders Navbar component', () => {
    const navbarElement = screen.getByText(/logout/i);
    expect(navbarElement).toBeInTheDocument();
  });

  test('renders LeftSidebar component', () => {
    // Adjust the text to match the actual rendered text
    const leftSidebarElement = screen.getByText(/loading countries/i);
    expect(leftSidebarElement).toBeInTheDocument();
  });

  test('renders RightSidebar component', () => {
    // Adjust the text to match the actual rendered text
    const rightSidebarElement = screen.getByText(/filter/i);
    expect(rightSidebarElement).toBeInTheDocument();
  });

  test('calls handleLogout when logout is clicked', () => {
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});