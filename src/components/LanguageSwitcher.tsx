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
      className="relative inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 font-semibold text-sm"
    >
      <span className="text-gray-700">
        {language === 'zh' ? 'EN' : '中'}
      </span>
      <span className="ml-2 text-gray-400 text-xs">
        {language === 'zh' ? 'English' : '中文'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;