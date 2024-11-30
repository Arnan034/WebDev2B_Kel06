// client/src/tests/videoTrailer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoTrailer from '../pages/child/videoTrailer';

describe('VideoTrailer Component', () => {
  const mockTrailerUrl = 'https://www.youtube.com/embed/testvideo';

  test('renders video trailer correctly', () => {
    render(<VideoTrailer trailer={mockTrailerUrl} />);

    // Check if the iframe is rendered
    const iframeElement = screen.getByTitle('YouTube video player');
    expect(iframeElement).toBeInTheDocument();

    // Check if the iframe has the correct src attribute
    expect(iframeElement).toHaveAttribute('src', mockTrailerUrl);

    // Check if the iframe has the correct allow attribute
    expect(iframeElement).toHaveAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );

    // Check if the iframe has the allowFullScreen attribute
    expect(iframeElement).toHaveAttribute('allowFullScreen');
  });
});