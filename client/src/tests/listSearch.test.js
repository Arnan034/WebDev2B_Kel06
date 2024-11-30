// client/src/pages/list/listSearch.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { apiServicePublic } from '../services/api';
import ListSearch from '../pages/list/listSearch';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getFilmSearch: jest.fn(),
    updatePlusView: jest.fn(),
  },
}));

describe('ListSearch Component', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Inception',
      picture: '...',
      year: 2010,
      status: 'Completed',
      rate: 5,
      views: 1000,
      genres: ['Action', 'Sci-Fi'],
    },
    {
      id: 2,
      title: 'Interstellar',
      picture: '...',
      year: 2014,
      status: 'On Going',
      rate: 4,
      views: 1500,
      genres: ['Adventure', 'Drama'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apiServicePublic.getFilmSearch.mockResolvedValueOnce({ data: { data: mockMovies } });
  });

  test('renders movies based on search query and filters', async () => {
    render(
      <ListSearch
        filterCountry=""
        searchQuery="Inception"
        filterMovie={{ year: null, availability: null, genre: null, award: null, status: null }}
        SortFilm=""
      />,
      { wrapper: MemoryRouter }
    );

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/2010/i)).toBeInTheDocument();
      expect(screen.getByText(/Action, Sci-Fi/i)).toBeInTheDocument();
    });
  });

  test('displays "Tidak ada hasil yang ditemukan." when no movies match', async () => {
    apiServicePublic.getFilmSearch.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <ListSearch
        filterCountry=""
        searchQuery="Nonexistent Movie"
        filterMovie={{ year: null, availability: null, genre: null, award: null, status: null }}
        SortFilm=""
      />,
      { wrapper: MemoryRouter }
    );

    await waitFor(() => {
      expect(screen.getByText(/Tidak ada hasil yang ditemukan./i)).toBeInTheDocument();
    });
  });

  test('calls updatePlusView when a movie is clicked', async () => {
    render(
      <ListSearch
        filterCountry=""
        searchQuery="Inception"
        filterMovie={{ year: null, availability: null, genre: null, award: null, status: null }}
        SortFilm=""
      />,
      { wrapper: MemoryRouter }
    );

    await waitFor(() => {
      const movieLink = screen.getByText(/Inception/i).closest('a');
      movieLink.click();
    });

    expect(apiServicePublic.updatePlusView).toHaveBeenCalledWith(1);
  });
});