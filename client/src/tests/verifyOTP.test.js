// client/src/tests/verifyOTP.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { apiServicePublic } from '../services/api';
import OtpVerification from '../pages/auth/verifyOTP';

// Mock the API service
jest.mock('../services/api', () => ({
  apiServicePublic: {
    verifyOTP: jest.fn(),
    resendOTP: jest.fn(),
  },
}));

describe('OtpVerification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('otpToken', 'test-token');
    sessionStorage.setItem('idVerified', 'test-id');
    sessionStorage.setItem('emailVerified', 'test@example.com');
  });

  test('renders the OTP verification form', () => {
    render(<OtpVerification />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Verify OTP/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
  });

  test('handles OTP input change', () => {
    render(<OtpVerification />, { wrapper: MemoryRouter });

    const otpInputs = screen.getAllByRole('textbox');
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });

    otpInputs.forEach((input, index) => {
      expect(input.value).toBe((index + 1).toString());
    });
  });

  test('handles form submission successfully', async () => {
    apiServicePublic.verifyOTP.mockResolvedValueOnce({
      status: 200,
      data: { message: 'OTP verified successfully!' },
    });

    render(<OtpVerification />, { wrapper: MemoryRouter });

    const otpInputs = screen.getAllByRole('textbox');
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });

    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(apiServicePublic.verifyOTP).toHaveBeenCalledWith({
        id: 'test-id',
        token: 'test-token',
        otpJoin: '123456',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/OTP verified successfully!/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed submission', async () => {
    apiServicePublic.verifyOTP.mockRejectedValueOnce({
      response: { data: { message: 'Invalid OTP' } },
    });

    render(<OtpVerification />, { wrapper: MemoryRouter });

    const otpInputs = screen.getAllByRole('textbox');
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });

    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(apiServicePublic.verifyOTP).toHaveBeenCalledWith({
        id: 'test-id',
        token: 'test-token',
        otpJoin: '123456',
      });
    });

    // Use waitFor to ensure the error message is rendered
    await waitFor(() => {
      expect(screen.getByText(/Invalid OTP/i)).toBeInTheDocument();
    });
  });

  test('handles resend OTP', async () => {
    apiServicePublic.resendOTP.mockResolvedValueOnce({
      data: { data: { token: 'new-test-token' } },
    });

    render(<OtpVerification />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/Resend Code/i));

    await waitFor(() => {
      expect(apiServicePublic.resendOTP).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    expect(sessionStorage.getItem('otpToken')).toBe('new-test-token');
  });
});