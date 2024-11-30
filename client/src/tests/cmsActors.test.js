import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { apiServiceAuth, apiServiceAdmin } from '../services/api';
import CMSActor from '../pages/cms/cmsActors';

// Mock API service
jest.mock('../services/api', () => ({
  apiServiceAuth: {
    getAllActor: jest.fn(),
  },
  apiServiceAdmin: {
    createActor: jest.fn(),
    deleteActor: jest.fn(),
  },
}));

describe('CMSActor Component', () => {
  const mockActors = [
    { id_actor: 1, country: 'USA', name: 'John Doe', birth_date: '1990-01-01', picture: null },
    { id_actor: 2, country: 'UK', name: 'Jane Smith', birth_date: '1985-05-15', picture: null },
  ];

  beforeEach(() => {
    apiServiceAuth.getAllActor.mockResolvedValue({ data: { data: mockActors } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders actor list correctly', async () => {
    render(<CMSActor />);

    // Wait for data to be fetched
    await waitFor(() => expect(apiServiceAuth.getAllActor).toHaveBeenCalled());

    // Check if actors are rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('filters actors by name', async () => {
    render(<CMSActor />);

    // Wait for data to be fetched
    await waitFor(() => expect(apiServiceAuth.getAllActor).toHaveBeenCalled());

    // Search for "Jane"
    fireEvent.change(screen.getByPlaceholderText('Search actor name...'), { target: { value: 'Jane' } });

    // Check if only Jane is displayed
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
