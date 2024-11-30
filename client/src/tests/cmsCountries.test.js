// client/src/tests/cmsCountries.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { apiServicePublic, apiServiceAdmin } from '../services/api';
import CMSCountries from '../pages/cms/cmsCountries';

// Mock the API services
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getAllCountry: jest.fn(),
  },
  apiServiceAdmin: {
    createCountry: jest.fn(),
    updateCountry: jest.fn(),
    deleteCountry: jest.fn(),
  },
}));

describe('CMSCountries Component', () => {
  const mockCountries = [
    { id_country: 1, country_name: 'Country1' },
    { id_country: 2, country_name: 'Country2' },
    // Add more mock countries as needed
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: [] } });
    render(<CMSCountries />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('fetches and displays countries', async () => {
    apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: mockCountries } });
    render(<CMSCountries />);

    await waitFor(() => {
      expect(screen.getByText(/Country1/i)).toBeInTheDocument();
      expect(screen.getByText(/Country2/i)).toBeInTheDocument();
    });
  });

//   test('adds a new country', async () => {
//     apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: mockCountries } });
//     apiServiceAdmin.createCountry.mockResolvedValueOnce({ data: { country_name: 'Country3' } });

//     render(<CMSCountries />);

//     fireEvent.change(screen.getByPlaceholderText(/Type country here.../i), { target: { value: 'Country3' } });
//     fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

//     await waitFor(() => {
//       expect(apiServiceAdmin.createCountry).toHaveBeenCalledWith({ country_name: 'Country3' });
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/Country "Country3" berhasil ditambahkan!/i)).toBeInTheDocument();
//     });
//   });

  test('edits a country', async () => {
    apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: mockCountries } });
    apiServiceAdmin.updateCountry.mockResolvedValueOnce({});

    render(<CMSCountries />);

    await waitFor(() => {
      expect(screen.getByText(/Country1/i)).toBeInTheDocument();
    });

    fireEvent.doubleClick(screen.getByText(/Country1/i));
    fireEvent.change(screen.getByDisplayValue(/Country1/i), { target: { value: 'Country1Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(apiServiceAdmin.updateCountry).toHaveBeenCalledWith(1, { name: 'Country1Updated' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Country "Country1" berhasil diperbarui menjadi "Country1Updated"!/i)).toBeInTheDocument();
    });
  });

//   test('deletes a country', async () => {
//     apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: mockCountries } });
//     apiServiceAdmin.deleteCountry.mockResolvedValueOnce({});

//     render(<CMSCountries />);

//     await waitFor(() => {
//       expect(screen.getByText(/Country1/i)).toBeInTheDocument();
//     });

//     window.confirm = jest.fn(() => true); // Mock window.confirm to always return true
//     fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

//     await waitFor(() => {
//       expect(apiServiceAdmin.deleteCountry).toHaveBeenCalledWith(1);
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/Country "Country1" berhasil dihapus./i)).toBeInTheDocument();
//     });
//   });

//   test('handles pagination', async () => {
//     const manyCountries = Array.from({ length: 15 }, (_, i) => ({
//       id_country: i + 1,
//       country_name: `Country${i + 1}`,
//     }));

//     apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: manyCountries } });
//     render(<CMSCountries />);

//     await waitFor(() => {
//       expect(screen.getByText(/Country1/i)).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByRole('button', { name: /2/i })); // Go to page 2

//     await waitFor(() => {
//       expect(screen.getByText(/Country6/i)).toBeInTheDocument();
//     });
//   });

  test('searches for a country', async () => {
    apiServicePublic.getAllCountry.mockResolvedValueOnce({ data: { data: mockCountries } });
    render(<CMSCountries />);

    await waitFor(() => {
      expect(screen.getByText(/Country1/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Search country.../i), { target: { value: 'Country1' } });

    expect(screen.getByText(/Country1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Country2/i)).not.toBeInTheDocument();
  });
});