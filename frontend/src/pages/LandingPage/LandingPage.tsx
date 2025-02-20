import React from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handlePlanYourDay = () => {
    if (!loggedIn) {
      navigate('/auth', { state: { mode: 'login' } });
    } else {
      navigate('/tickets');
    }
  };

  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.heroTitle}>{t('welcome')}</h1>
      <p className={styles.heroSubtitle}>{t('heroText')}</p>

      <p className={styles.parkInfo}>{t('descriptionLandingPage')}</p>

      <button
        className={styles.callToAction}
        onClick={handlePlanYourDay}
        aria-label="Plan your day"
      >
        {t('planYourDay')}
      </button>

      <img
        src="/floating-burger.png"
        alt="Floating Burger"
        className={styles.burgerArt}
      />
    </div>
  );
};

export default LandingPage;
