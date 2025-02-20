import { describe, test, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual<
    typeof import('react-router-dom')
  >('react-router-dom');
  return {
    ...originalModule,
    useNavigate: vi.fn(),
  };
});

describe('Navigation Component', () => {
  const mockedUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const mockedNavigate = useNavigate as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when logged in and handles logout, My Tickets, and My Bookings clicks', () => {
    const mockLogout = vi.fn();
    const mockNavigate = vi.fn();
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      logout: mockLogout,
      token: 'dummy-token',
    });
    mockedNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    const ticketsButton = screen.getByLabelText('View my tickets');
    const bookingsButton = screen.getByLabelText('View my bookings');
    expect(logoutButton).toBeInTheDocument();
    expect(ticketsButton).toBeInTheDocument();
    expect(bookingsButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(ticketsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/tickets');

    fireEvent.click(bookingsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/bookings');
  });
});
