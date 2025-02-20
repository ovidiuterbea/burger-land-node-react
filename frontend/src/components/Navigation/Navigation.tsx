import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navContainer} aria-label="Main Navigation">
      <button
        className={styles.logo}
        onClick={() => navigate('/')}
        aria-label="Go to home page"
      >
        <img
          src="/floating-burger.png"
          alt="Burger Icon"
          className={styles.logoImage}
        />
        Burger Land
      </button>
      <div className={styles.links}>
        {loggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <button
              onClick={() => navigate('/tickets')}
              aria-label="View my tickets"
            >
              My Tickets
            </button>
            <button
              onClick={() => navigate('/bookings')}
              aria-label="View my bookings"
            >
              My Bookings
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLogin} aria-label="Authentication">
              Authenticate
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
