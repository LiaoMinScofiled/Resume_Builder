import React from 'react';

interface LanguageSwitcherProps {
  language: 'zh' | 'en';
  onLanguageChange: (language: 'zh' | 'en') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange }) => {
  const toggleLanguage = () => {
    onLanguageChange(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="form-input text-sm px-2 py-1 w-24 text-center"
    >
      {language === 'zh' ? 'EN' : '中'}
    </button>
  );
};

export default LanguageSwitcher;