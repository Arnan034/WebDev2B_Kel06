// client/src/pages/components/LeftSidebar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { apiServicePublic } from '../services/api';
import LeftSidebar from '../pages/components/leftSidebar';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getAllCountry: jest.fn(),
  },
}));

describe('LeftSidebar Component', () => {
  const mockOnCountryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: [] } });
    render(<LeftSidebar onCountryChange={mockOnCountryChange} />);
    expect(screen.getByText(/loading countries/i)).toBeInTheDocument();
  });

  test('renders countries list after loading', async () => {
    const mockCountries = {
      data: {
        data: [
          { id_country: '1', country_name: 'Country A' },
          { id_country: '2', country_name: 'Country B' },
        ],
      },
    };
    apiServicePublic.getAllCountry.mockResolvedValueOnce(mockCountries);

    render(<LeftSidebar onCountryChange={mockOnCountryChange} />);

    // Wait for the countries to be rendered
    const countryA = await screen.findByText(/country a/i);
    const countryB = await screen.findByText(/country b/i);

    expect(countryA).toBeInTheDocument();
    expect(countryB).toBeInTheDocument();
  });

  test('handles country selection', async () => {
    const mockCountries = {
      data: {
        data: [
          { id_country: '1', country_name: 'Country A' },
        ],
      },
    };
    apiServicePublic.getAllCountry.mockResolvedValueOnce(mockCountries);

    render(<LeftSidebar onCountryChange={mockOnCountryChange} />);

    const countryA = await screen.findByText(/country a/i);
    fireEvent.click(countryA);

    expect(mockOnCountryChange).toHaveBeenCalledWith('1');
  });

  test('displays error message on fetch failure', async () => {
    apiServicePublic.getAllCountry.mockRejectedValueOnce(new Error('Failed to fetch countries'));

    render(<LeftSidebar onCountryChange={mockOnCountryChange} />);

    const errorMessage = await screen.findByText(/failed to fetch countries/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
