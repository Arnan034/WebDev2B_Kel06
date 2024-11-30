// client/src/pages/child/Comment.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { apiServicePublic } from '../services/api';
import Comment from '../pages/child/comment';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    getCommentByIdFilm: jest.fn(),
  },
}));

describe('Comment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    apiServicePublic.getCommentByIdFilm.mockResolvedValueOnce({ data: { data: [] } });
    render(<Comment id="1" />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders comments when data is fetched', async () => {
    const mockComments = {
      data: {
        data: [
          { user: 'User1', date: '2023-01-01', comment: 'Great movie!', rating: 5, picture: '' },
          { user: 'User2', date: '2023-01-02', comment: 'Not bad', rating: 3, picture: '' },
        ],
      },
    };
    apiServicePublic.getCommentByIdFilm.mockResolvedValueOnce(mockComments);

    render(<Comment id="1" />);

    const comment1 = await screen.findByText(/Great movie!/i);
    const comment2 = await screen.findByText(/Not bad/i);

    expect(comment1).toBeInTheDocument();
    expect(comment2).toBeInTheDocument();
  });

  test('handles "Show More" button click', async () => {
    const mockComments = {
      data: {
        data: Array.from({ length: 10 }, (_, i) => ({
          user: `User${i + 1}`,
          date: '2023-01-01',
          comment: `Comment ${i + 1}`,
          rating: 5,
          picture: '',
        })),
      },
    };
    apiServicePublic.getCommentByIdFilm.mockResolvedValueOnce(mockComments);

    render(<Comment id="1" />);

    const showMoreButton = await screen.findByText(/Show More/i);
    fireEvent.click(showMoreButton);

    const comment6 = await screen.findByText(/Comment 6/i);
    expect(comment6).toBeInTheDocument();
  });
});