import { describe, test, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
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

describe('AuthenticationPage', () => {
  const mockedUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const mockedNavigate = useNavigate as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders Login mode by default', () => {
    mockedUseAuth.mockReturnValue({
      login: vi.fn(),
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Register')[0]).toBeInTheDocument();

    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/last name/i)).not.toBeInTheDocument();
  });

  test('switches to Register mode when clicking Register button', () => {
    mockedUseAuth.mockReturnValue({
      login: vi.fn(),
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('Register')[0]);

    expect(screen.getAllByLabelText(/first name/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/last name/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /register/i })[0]
    ).toBeInTheDocument();
  });

  test('logs in successfully and calls login + navigate', async () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });
    mockedNavigate.mockReturnValue(mockNavigate);

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '123', email: 'test@example.com' },
        token: 'mock-token',
      }),
    } as Response);

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/email/i)[0], {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const submitLoginButton = screen.getByLabelText('Submit');

    fireEvent.click(submitLoginButton);

    await screen.findAllByText('Login');

    expect(mockLogin).toHaveBeenCalledWith(
      { id: '123', email: 'test@example.com' },
      'mock-token'
    );
    expect(useNavigate()).toHaveBeenCalledWith('/tickets');
  });

  test('shows error if login fails', async () => {
    mockedUseAuth.mockReturnValue({
      login: vi.fn(),
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/email/i)[0], {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'wrongpassword' },
    });

    const submitLoginButton = screen.getByLabelText('Submit');

    fireEvent.click(submitLoginButton);

    expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
  });

  test('registers a new user and calls login if server returns token + user', async () => {
    const mockLogin = vi.fn();
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '123', email: 'reg@example.com' },
        token: 'mock-reg-token',
      }),
    } as Response);

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Register'));

    fireEvent.change(screen.getAllByLabelText(/first name/i)[0], {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getAllByLabelText(/last name/i)[0], {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getAllByLabelText(/email/i)[0], {
      target: { value: 'reg@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'mypassword' },
    });

    const submitRegisterButton = screen.getByLabelText('Submit');

    fireEvent.click(submitRegisterButton);

    const registerButtons = await screen.findAllByText('Register');
    fireEvent.click(registerButtons[1]);

    expect(mockLogin).toHaveBeenCalledWith(
      { id: '123', email: 'reg@example.com' },
      'mock-reg-token'
    );
  });

  test('registers a new user but does NOT call login if no token returned', async () => {
    const mockLogin = vi.fn();
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      token: null,
      user: null,
      loggedIn: false,
      logout: vi.fn(),
    });
    mockedNavigate.mockReturnValue(vi.fn());

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '123', email: 'reg@example.com' },
        token: null,
      }),
    } as Response);

    render(
      <MemoryRouter>
        <AuthenticationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Register'));

    fireEvent.change(screen.getAllByLabelText(/first name/i)[0], {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getAllByLabelText(/last name/i)[0], {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getAllByLabelText(/email/i)[0], {
      target: { value: 'reg@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'mypassword' },
    });

    const submitRegisterButton = screen.getByLabelText('Submit');

    fireEvent.click(submitRegisterButton);

    const registerButtons = await screen.findAllByText('Register');

    fireEvent.click(registerButtons[1]);

    expect(mockLogin).not.toHaveBeenCalled();

    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/last name/i)).not.toBeInTheDocument();
  });
});
