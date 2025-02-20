import { describe, test, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import BookingsPage from './BookingsPage';
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

vi.mock('../../constants/constants', () => ({
  API_BASE_URL: 'http://mock-api.com',
}));

describe('BookingsPage', () => {
  const mockedUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const mockedNavigate = useNavigate as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });
  vi.mock('react-router-dom', async () => {
    const originalModule = await vi.importActual<
      typeof import('react-router-dom')
    >('react-router-dom');
    return {
      ...originalModule,
      useNavigate: vi.fn(),
    };
  });

  test('redirects to /auth if not logged in', () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: false,
      token: null,
    });
    const mockNavigate = vi.fn();
    mockedNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays bookings if logged in', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookings: [
          {
            id: 'b1',
            userId: 'u1',
            bookingType: 'RESTAURANT',
            bookingDate: '2025-09-15T00:00:00.000Z',
            createdAt: '2025-08-01T09:00:00.000Z',
          },
          {
            id: 'b2',
            userId: 'u1',
            bookingType: 'VIP_TOUR',
            bookingDate: '2025-10-01T00:00:00.000Z',
            createdAt: '2025-09-01T09:00:00.000Z',
          },
        ],
      }),
    } as Response);

    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading bookings.../i)).toBeInTheDocument();

    expect(await screen.findByText(/RESTAURANT/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP_TOUR/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith('http://mock-api.com/bookings', {
      headers: { Authorization: 'Bearer mock-token' },
    });
  });

  test('shows error if fetching bookings fails', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/failed to fetch bookings/i)
    ).toBeInTheDocument();
  });

  test('creates a new booking successfully', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ bookings: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          bookings: [
            {
              id: 'newBooking1',
              userId: 'u1',
              bookingType: 'PHOTO_SESSION',
              bookingDate: '2025-12-25T00:00:00.000Z',
              createdAt: '2025-10-01T09:00:00.000Z',
            },
          ],
        }),
      } as Response);

    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    );

    await screen.findByText(/my bookings/i);

    fireEvent.change(screen.getAllByLabelText(/booking type/i)[0], {
      target: { value: 'PHOTO_SESSION' },
    });
    fireEvent.change(screen.getAllByLabelText(/booking date/i)[0], {
      target: { value: '2025-12-25' },
    });

    fireEvent.click(screen.getByText(/create booking/i));

    expect(await screen.findByText(/PHOTO_SESSION/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://mock-api.com/bookings',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({
          bookingType: 'PHOTO_SESSION',
          bookingDate: '2025-12-25',
        }),
      }
    );
  });

  test('shows error if creating booking fails', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ bookings: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response);

    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    );

    await screen.findByText(/my bookings/i);

    fireEvent.change(screen.getAllByLabelText(/booking date/i)[0], {
      target: { value: '2025-12-31' },
    });
    fireEvent.click(screen.getByText(/create booking/i));

    expect(
      await screen.findByText(/failed to create booking/i)
    ).toBeInTheDocument();
  });
});
