import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PrivateRoute', () => {
  const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when logged in', () => {
    mockedUseAuth.mockReturnValue({ loggedIn: true });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /auth when not logged in', async () => {
    mockedUseAuth.mockReturnValue({ loggedIn: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/auth" element={<div>Authentication Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Authentication Page')).toBeInTheDocument();
  });
});
