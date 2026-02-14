'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/resume';

interface AppContextType {
  language: 'zh' | 'en';
  setLanguage: (lang: 'zh' | 'en') => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'zh' | 'en'>('zh');
  const [user, setUser] = useState<User | null>(null);

  const setLanguage = (lang: 'zh' | 'en') => {
    setLanguageState(lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000; sameSite=lax`;
  };

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; sameSite=lax`;
    } else {
      document.cookie = 'user=; path=/; max-age=0';
    }
  };

  useEffect(() => {
    const loadFromCookies = () => {
      const cookies = document.cookie.split(';');
      
      const langCookie = cookies.find(c => c.trim().startsWith('language='));
      if (langCookie) {
        const lang = langCookie.split('=')[1];
        if (lang === 'zh' || lang === 'en') {
          setLanguageState(lang);
        }
      }

      const userCookie = cookies.find(c => c.trim().startsWith('user='));
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie.split('=')[1]);
          setUser(userData);
        } catch (error) {
          console.error('Failed to parse user cookie:', error);
        }
      }
    };

    loadFromCookies();
  }, []);

  return (
    <AppContext.Provider value={{ language, setLanguage, user, setUser: handleSetUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
