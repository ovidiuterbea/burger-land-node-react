import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthenticationPage.module.css';
import { API_BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState('');

  const switchToLogin = () => {
    setMode('login');
    setError('');
  };

  const switchToRegister = () => {
    setMode('register');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (mode === 'register') {
      if (!firstName) {
        setError('First name is required.');
        return;
      }
      if (!lastName) {
        setError('Last name is required.');
        return;
      }
    }

    if (mode === 'login') {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          throw new Error('Login failed');
        }

        const data = await res.json();
        login(data.user, data.token);
        navigate('/tickets');
      } catch (err: any) {
        setError(err.message || 'Login error');
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        });

        if (!res.ok) {
          throw new Error('Registration failed');
        }

        const data = await res.json();

        if (data.token && data.user) {
          login(data.user, data.token);
        } else {
          console.log('User registered successfully, please login');
          setMode('login');
        }
      } catch (err: any) {
        setError(err.message || 'Registration error');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authToggle}>
        <button
          onClick={switchToLogin}
          style={{ fontWeight: mode === 'login' ? 'bold' : 'normal' }}
          aria-label="Login switch"
        >
          Login
        </button>
        <button
          onClick={switchToRegister}
          style={{ fontWeight: mode === 'register' ? 'bold' : 'normal' }}
          aria-label="Register switch"
        >
          Register
        </button>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label htmlFor="firstName" aria-label="First Name">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <label htmlFor="lastName" aria-label="Last Name">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}

        <label htmlFor="email" aria-label="Email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" aria-label="Email">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className={styles.submitButton}
          type="submit"
          aria-label="Submit"
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default AuthenticationPage;
