// client/src/tests/rightSidebar.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { apiServicePublic } from '../services/api';
import RightSidebar from '../pages/components/rightSidebar';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getYears: jest.fn(),
    getAvailabilitys: jest.fn(),
    getAllGenre: jest.fn(),
    getInstitutionAward: jest.fn(),
  },
}));

describe('RightSidebar Component', () => {
  const mockOnFiltersChange = jest.fn();
  const mockHandleSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sort buttons', () => {
    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );
    expect(screen.getByText(/\[A-Z\]/i)).toBeInTheDocument();
    expect(screen.getByText(/\[Z-A\]/i)).toBeInTheDocument();
  });

  test('toggles sort order on button click', () => {
    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );
    const sortAscButton = screen.getByText(/\[A-Z\]/i);
    fireEvent.click(sortAscButton);
    expect(sortAscButton).toHaveClass('active');

    const sortDescButton = screen.getByText(/\[Z-A\]/i);
    fireEvent.click(sortDescButton);
    expect(sortDescButton).toHaveClass('active');
  });

  test('fetches and displays year filter options', async () => {
    const mockYears = {
      data: {
        data: [
          { year_film: 2020 },
          { year_film: 2021 },
          { year_film: 2022 },
        ],
      },
    };
    apiServicePublic.getYears.mockResolvedValueOnce(mockYears);
  
    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );
  
    // Open the select dropdown
    const yearSelect = screen.getByLabelText('Tahun');
    fireEvent.mouseDown(yearSelect);
  
    // Use findByRole to find the option
    const yearOption = await screen.findByRole('option', { name: '2021' });
    expect(yearOption).toBeInTheDocument();
  });

  test('fetches and displays availability filter options', async () => {
    const mockAvailabilitys = {
      data: {
        data: [
          { availability: 'Available' },
          { availability: 'Unavailable' },
        ],
      },
    };
    apiServicePublic.getAvailabilitys.mockResolvedValueOnce(mockAvailabilitys);
  
    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );
  
    // Open the select dropdown
    const availabilitySelect = await screen.getByLabelText('Availability');
    fireEvent.mouseDown(availabilitySelect);
  
    // Use findByRole to find the option
    const availabilityOption = await screen.findByRole('option', { name: 'Available' });
    expect(availabilityOption).toBeInTheDocument();
  });

  test('fetches and displays genre filter options', async () => {
    const mockGenres = {
      data: {
        data: [
          { id_genre: '1', genre: 'Action' },
          { id_genre: '2', genre: 'Comedy' },
        ],
      },
    };
    apiServicePublic.getAllGenre.mockResolvedValueOnce(mockGenres);

    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );

    // Open the select dropdown
    const genreSelect = screen.getByLabelText('Genre');
    fireEvent.mouseDown(genreSelect);

    // Use findByRole to find the option
    const genreOption = await screen.findByRole('option', { name: 'Action' });
    expect(genreOption).toBeInTheDocument();
  });
  
  test('fetches and displays award filter options', async () => {
    const mockAwards = {
      data: {
        data: [
          { institution: 'Oscar' },
          { institution: 'Emmy' },
        ],
      },
    };
    apiServicePublic.getInstitutionAward.mockResolvedValueOnce(mockAwards);
    
    render(
      <RightSidebar
      isSidebarOpen={true}
      onFiltersChange={mockOnFiltersChange}
      handleSortChange={mockHandleSortChange}
      />
    );

    // Open the select dropdown
    const awardSelect = screen.getByLabelText('Award');
    fireEvent.mouseDown(awardSelect);

    // Use findByRole to find the option
    const awardOption = await screen.findByRole('option', { name: 'Oscar' });
    expect(awardOption).toBeInTheDocument();
  });

  test('calls onFiltersChange and handleSortChange on submit', () => {
    render(
      <RightSidebar
        isSidebarOpen={true}
        onFiltersChange={mockOnFiltersChange}
        handleSortChange={mockHandleSortChange}
      />
    );

    const applyButton = screen.getByText(/Terapkan/i);
    fireEvent.click(applyButton);

    expect(mockOnFiltersChange).toHaveBeenCalled();
    expect(mockHandleSortChange).toHaveBeenCalled();
  });
});