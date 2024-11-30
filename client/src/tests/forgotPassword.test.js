// client/src/pages/auth/ForgotPassword.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { apiServicePublic } from '../services/api';
import ForgotPassword from '../pages/auth/forgotPassword';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    forgetPassword: jest.fn(),
  },
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the forgot password form', () => {
    render(<ForgotPassword />);

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Masukkan Email Anda untuk Reset Password!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    apiServicePublic.forgetPassword.mockResolvedValueOnce({
      data: { message: 'Email sent successfully' },
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(apiServicePublic.forgetPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Email sent successfully/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
  });

  test('displays error message on failed submission', async () => {
    apiServicePublic.forgetPassword.mockRejectedValueOnce({
      response: { data: { message: 'Email not found' } },
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(apiServicePublic.forgetPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
    });
  });
});