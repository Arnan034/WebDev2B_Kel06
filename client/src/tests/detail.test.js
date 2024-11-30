// client/src/tests/detail.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Detail from '../pages/child/detail';

// Mock Bootstrap Tooltip
jest.mock('bootstrap', () => ({
  Tooltip: jest.fn(),
}));

// Mock data for the movie
const mockMovie = {
  picture: 'base64string',
  title: 'Test Movie',
  genres: ['Action', 'Drama'],
  alternative_title: 'Test Alt Title',
  year: 2021,
  sysnopsis: 'This is a test synopsis.',
  rating: 4,
  availability: 'Available',
};

describe('Detail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders movie details correctly', () => {
    render(<Detail movie={mockMovie} />);

    // Check if the movie title is rendered
    expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();

    // Check if the genres are rendered
    mockMovie.genres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });

    // Check if the alternative title is rendered
    expect(screen.getByText(/Test Alt Title/i)).toBeInTheDocument();

    // Check if the year is rendered
    expect(screen.getByText(/2021/i)).toBeInTheDocument();

    // Check if the synopsis is rendered
    expect(screen.getByText(/This is a test synopsis./i)).toBeInTheDocument();

    // Check if the rating stars are rendered
    expect(screen.getByText('★★★★☆')).toBeInTheDocument();

    // Check if the availability is rendered
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
  });

  test('renders rating stars correctly', () => {
    render(<Detail movie={mockMovie} />);

    const ratingElement = screen.getByText('★★★★☆');
    expect(ratingElement).toBeInTheDocument();
    expect(ratingElement).toHaveAttribute('data-bs-title', 'Rating: 4');
  });

  test('initializes tooltips on mount', () => {
    render(<Detail movie={mockMovie} />);

    // Check if Tooltip was called
    expect(require('bootstrap').Tooltip).toHaveBeenCalled();
  });
});