// client/src/tests/detailFilm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { apiServicePublic, apiServiceAuth } from '../services/api';
import DetailFilm from '../pages/main/detailFilm';

// Mock the API services
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getFilmById: jest.fn(),
  },
  apiServiceAuth: {
    getUserBookmarkFilm: jest.fn(),
    createBookmark: jest.fn(),
    deleteBookmark: jest.fn(),
  },
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

describe('DetailFilm Component', () => {
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock sessionStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'id_user') return '1';
      return null;
    });
  });

  test('renders loading state initially', () => {
    apiServicePublic.getFilmById.mockResolvedValueOnce({ data: { data: null } });
    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={true} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders movie details when data is fetched', async () => {
    const mockMovieData = {
      data: {
        data: {
          id: '1',
          title: 'Test Movie',
          awards: [],
          trailer: '',
          genres: ['Action'],
          picture: '',
          alternative_title: 'Test Alt Title',
          year: 2021,
          sysnopsis: 'Test synopsis',
          rating: 4,
          availability: 'Available',
        },
      },
    };
    apiServicePublic.getFilmById.mockResolvedValueOnce(mockMovieData);

    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={true} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );

    const movieTitle = await screen.findByText(/Test Movie/i);
    expect(movieTitle).toBeInTheDocument();
  });

  test('handles bookmark toggle', async () => {
    const mockMovieData = {
      data: {
        data: {
          id: '1',
          title: 'Test Movie',
          awards: [],
          trailer: '',
          genres: ['Action'],
          picture: '',
          alternative_title: 'Test Alt Title',
          year: 2021,
          sysnopsis: 'Test synopsis',
          rating: 4,
          availability: 'Available',
        },
      },
    };
    apiServicePublic.getFilmById.mockResolvedValueOnce(mockMovieData);
    apiServiceAuth.getUserBookmarkFilm.mockResolvedValueOnce({ data: { data: { isBookmarked: false } } });

    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={true} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );

    const bookmarkButton = await screen.findByTitle(/Bookmark Film/i);
    fireEvent.click(bookmarkButton);

    expect(apiServiceAuth.createBookmark).toHaveBeenCalledWith({ userId: '1', filmId: '1' });
  });

  test('displays message when movie not found', async () => {
    apiServicePublic.getFilmById.mockResolvedValueOnce({ data: { data: null } });

    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={true} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );

    const notFoundMessage = await screen.findByText(/Movie not found/i);
    expect(notFoundMessage).toBeInTheDocument();
  });

  test('shows comment input when authenticated', async () => {
    const mockMovieData = {
      data: {
        data: {
          id: '1',
          title: 'Test Movie',
          awards: [],
          trailer: '',
          genres: ['Action'],
          picture: '',
          alternative_title: 'Test Alt Title',
          year: 2021,
          sysnopsis: 'Test synopsis',
          rating: 4,
          availability: 'Available',
        },
      },
    };
    apiServicePublic.getFilmById.mockResolvedValueOnce(mockMovieData);

    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={true} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Please Signin to leave a comment./i)).not.toBeInTheDocument();
    });
  });

  test('shows sign-in prompt when not authenticated', async () => {
    const mockMovieData = {
      data: {
        data: {
          id: '1',
          title: 'Test Movie',
          awards: [],
          trailer: '',
          genres: ['Action'],
          picture: '',
          alternative_title: 'Test Alt Title',
          year: 2021,
          sysnopsis: 'Test synopsis',
          rating: 4,
          availability: 'Available',
        },
      },
    };
    apiServicePublic.getFilmById.mockResolvedValueOnce(mockMovieData);

    render(
      <MemoryRouter initialEntries={['/film/1']}>
        <Routes>
          <Route path="/film/:id" element={<DetailFilm isAuthenticated={false} handleLogout={mockHandleLogout} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Please Signin to leave a comment./i)).toBeInTheDocument();
    });
  });
});