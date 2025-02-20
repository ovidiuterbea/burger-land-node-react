import { describe, test, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import { useAuth } from '../../context/AuthContext';
import '@testing-library/jest-dom';
import '../../locales/i18n';

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

describe('LandingPage (Vitest)', () => {
  const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;
  const mockedNavigate = useNavigate as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders landing page content', () => {
    mockedUseAuth.mockReturnValue({ loggedIn: false });

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Burger Land')).toBeInTheDocument();
    expect(
      screen.getByText(/Take a juicy bite out of life/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/our towering sesame-seed-bun mountains/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Plan Your Day/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Floating Burger')).toBeInTheDocument();
  });

  test('navigates to /auth with state { mode: "login" } if not logged in when Plan Your Day is clicked', () => {
    mockedUseAuth.mockReturnValue({ loggedIn: false });
    const mockNavigate = vi.fn();
    mockedNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Plan Your Day/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/auth', {
      state: { mode: 'login' },
    });
  });

  test('navigates to /tickets if logged in when Plan Your Day is clicked', () => {
    mockedUseAuth.mockReturnValue({ loggedIn: true });
    const mockNavigate = vi.fn();
    mockedNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Plan Your Day/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/tickets');
  });
});
