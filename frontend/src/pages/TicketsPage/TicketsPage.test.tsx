import { describe, test, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TicketsPage from './TicketsPage';
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

describe('TicketPage (Vitest)', () => {
  const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;
  const mockedNavigate = useNavigate as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
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
        <TicketsPage />
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays tickets if logged in', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tickets: [
          {
            id: 't1',
            userId: 'u1',
            ticketDate: '2025-09-15T00:00:00.000Z',
            type: 'SINGLE',
            price: 50,
            createdAt: '2025-08-01T09:00:00.000Z',
          },
          {
            id: 't2',
            userId: 'u1',
            ticketDate: '2025-10-01T00:00:00.000Z',
            type: 'FAMILY',
            price: 120,
            createdAt: '2025-09-01T09:00:00.000Z',
          },
        ],
      }),
    } as Response);

    render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading your tickets/i)).toBeInTheDocument();

    expect(await screen.findByText(/SINGLE Ticket/i)).toBeInTheDocument();
    expect(screen.getByText(/FAMILY Ticket/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith('http://mock-api.com/tickets', {
      method: 'GET',
      headers: { Authorization: 'Bearer mock-token' },
    });
  });

  test('shows error if fetching tickets fails', async () => {
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
        <TicketsPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Could not fetch tickets/i)
    ).toBeInTheDocument();
  });

  test('creates a new ticket successfully', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tickets: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tickets: [
            {
              id: 'newTicket1',
              userId: 'u1',
              ticketDate: '2025-12-25T00:00:00.000Z',
              type: 'FAMILY',
              price: 120,
              createdAt: '2025-10-01T09:00:00.000Z',
            },
          ],
        }),
      } as Response);

    render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>
    );

    await screen.findByText(/My Tickets/i);

    fireEvent.change(screen.getAllByLabelText(/ticket date/i)[0], {
      target: { value: '2025-12-25' },
    });
    fireEvent.change(screen.getAllByLabelText(/ticket type/i)[0], {
      target: { value: 'FAMILY' },
    });

    fireEvent.click(screen.getByText(/Purchase Ticket/i));

    expect(await screen.findByText(/FAMILY Ticket/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://mock-api.com/tickets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({
          ticketDate: '2025-12-25',
          type: 'FAMILY',
        }),
      }
    );
  });

  test('shows error if ticket purchase fails', async () => {
    mockedUseAuth.mockReturnValue({
      loggedIn: true,
      token: 'mock-token',
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tickets: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response);

    render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>
    );

    await screen.findByText(/My Tickets/i);

    fireEvent.change(screen.getAllByLabelText(/ticket date/i)[0], {
      target: { value: '2025-12-31' },
    });

    fireEvent.click(screen.getByText(/Purchase Ticket/i));

    expect(await screen.findByText(/Purchase failed/i)).toBeInTheDocument();
  });
});
