// client/src/pages/components/PaginationComponent.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationComponent from '../pages/components/pagination';

describe('PaginationComponent', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pagination when totalPages is greater than 1', () => {
    render(
      <PaginationComponent totalPages={5} currentPage={1} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByText(/First/i)).toBeInTheDocument();
    expect(screen.getByText(/Last/i)).toBeInTheDocument();
  });

  test('does not render pagination when totalPages is 1', () => {
    render(
      <PaginationComponent totalPages={1} currentPage={1} onPageChange={mockOnPageChange} />
    );
    expect(screen.queryByText(/First/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Last/i)).not.toBeInTheDocument();
  });

  test('calls onPageChange with correct page number when a page is clicked', () => {
    render(
      <PaginationComponent totalPages={5} currentPage={1} onPageChange={mockOnPageChange} />
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange with correct page number when "Last" is clicked', () => {
    render(
      <PaginationComponent totalPages={5} currentPage={1} onPageChange={mockOnPageChange} />
    );

    const lastButton = screen.getByText(/Last/i);
    fireEvent.click(lastButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });
});