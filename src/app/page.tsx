'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData, ResumeStyle, Language, User } from '@/types/resume';
import { generatePDF } from '@/lib/pdfGenerator';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import LoginForm from '@/components/LoginForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import StyleSelector from '@/components/StyleSelector';
import Modal from '@/components/Modal';
import SaveButton from '@/components/SaveButton';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// 模拟用户数据
const mockUser: User | null = null;

// 初始简历数据
const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    gender: '',
    birthDate: '',
    photo: '',
  },
  education: [],
  experience: [],
  skills: [],
};

export default function Home() {
  const [user, setUser] = useState<User | null>(mockUser);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>('style-1');
  const [language, setLanguage] = useState<Language>('zh');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLanguageDetected, setIsLanguageDetected] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const handleLogin = (userData: User) => {
    setUser(userData);
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; sameSite=lax`;
    setSaveStatus('idle');
    loadUserResume(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    setResumeData(initialResumeData);
    setResumeStyle('style-1');
    setSaveStatus('idle');
    document.cookie = `user=; path=/; max-age=0; sameSite=lax`;
  };

  const loadUserResume = async (userId: string) => {
    setIsLoadingResume(true);
    setSaveStatus('idle');
    try {
      const response = await fetch(`/api/resume/load?userId=${userId}`);
      const data = await response.json();
      
      if (data && data.resumeData) {
        setResumeData(data.resumeData);
        if (data.style) {
          setResumeStyle(data.style);
        }
      } else {
        setResumeData(initialResumeData);
        setResumeStyle('style-1');
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      setResumeData(initialResumeData);
      setResumeStyle('style-1');
    } finally {
      setIsLoadingResume(false);
    }
  };

  const saveResume = async () => {
    if (!user) return;
    
    setSaveStatus('saving');
    
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resumeData: resumeData,
          style: resumeStyle,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } else {
        console.error('Save failed:', data);
        setSaveStatus('error');
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
    
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveResume();
    }, 1000);
    
    setAutoSaveTimeout(timeout);
  };

  const handleStyleChange = (style: ResumeStyle) => {
    setResumeStyle(style);
    saveResume();
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageDetected(true);
  };

  const handleDownloadPDF = async () => {
    if (!user) return;
    await generatePDF('resume-preview-modal', `resume-${resumeData.personalInfo.name || 'user'}`);
  };

  const handleDownloadPDFInline = async () => {
    if (!user) return;
    await generatePDF('resume-preview-inline', `resume-${resumeData.personalInfo.name || 'user'}`);
  };

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  useEffect(() => {
    const cookieUser = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1];
    if (cookieUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookieUser));
        setUser(userData);
        loadUserResume(userData.id);
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
      }
    }
  }, []);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const response = await fetch('/api/detect-language');
        const data = await response.json();
        
        if (data.language && !isLanguageDetected) {
          setLanguage(data.language);
          setIsLanguageDetected(true);
        }
      } catch (error) {
        console.error('Failed to detect language:', error);
      }
    };

    detectLanguage();
  }, [isLanguageDetected]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 min-h-[72px]">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  {language === 'zh' ? '简历生成器' : 'Resume Builder'}
                </h1>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <LanguageSwitcher language={language} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
          {!user ? (
            <div className="mb-4">
              <LoginForm onLogin={handleLogin} language={language} />
            </div>
          ) : (
            <div className="mb-4 flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-xs px-3 py-1.5"
              >
                {language === 'zh' ? '退出' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="resume-container">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card card-hover">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {language === 'zh' ? '简历信息' : 'Resume Information'}
                </h2>
                <div className="flex items-center space-x-3">
                  <SaveButton
                    status={saveStatus}
                    onClick={saveResume}
                    language={language}
                  />
                  <button
                    onClick={openPreviewModal}
                    className="btn btn-primary"
                  >
                    {language === 'zh' ? '全屏预览' : 'Full Preview'}
                  </button>
                </div>
              </div>
              {isLoadingResume ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                </div>
              ) : (
                <ResumeForm
                  resumeData={resumeData}
                  onResumeDataChange={handleResumeDataChange}
                  language={language}
                />
              )}
            </div>

            <div className="space-y-6">
              <StyleSelector
                style={resumeStyle}
                onStyleChange={handleStyleChange}
                language={language}
              />
              
              <div className="card card-hover">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'zh' ? '简历预览' : 'Resume Preview'}
                  </h2>
                  <button
                    onClick={handleDownloadPDFInline}
                    className="btn btn-primary"
                    disabled={!user}
                  >
                    {!user ? (language === 'zh' ? '登录后下载' : 'Login to Download') : (language === 'zh' ? '下载PDF' : 'Download PDF')}
                  </button>
                </div>
                <div id="resume-preview-inline" className="bg-white p-4 rounded-lg shadow-inner border border-gray-100 overflow-auto max-h-[600px]">
                  <ResumePreview
                    resumeData={resumeData}
                    style={resumeStyle}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-100 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">
                  {language === 'zh' ? '简历生成器' : 'Resume Builder'}
                </span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        title={language === 'zh' ? '简历预览' : 'Resume Preview'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary"
              disabled={!user}
            >
              {!user ? (language === 'zh' ? '登录后下载' : 'Login to Download') : (language === 'zh' ? '下载PDF' : 'Download PDF')}
            </button>
          </div>
          <div id="resume-preview-modal" className="bg-white p-8 rounded-lg shadow-lg">
            <ResumePreview
              resumeData={resumeData}
              style={resumeStyle}
              language={language}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}