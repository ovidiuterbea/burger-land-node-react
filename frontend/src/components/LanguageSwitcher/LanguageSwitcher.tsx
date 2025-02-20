import React from 'react';
import { useSearchParams } from 'react-router-dom';
import i18n from '../../locales/i18n';

interface LanguageSwitcherProps {
  children: React.ReactNode;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang');

  React.useEffect(() => {
    if (lang && (lang === 'en' || lang === 'es')) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <>{children}</>;
};

export default LanguageSwitcher;
