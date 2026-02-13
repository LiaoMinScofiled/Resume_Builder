'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData, ResumeStyle, Language, User } from '@/types/resume';
import { generatePDF } from '@/lib/pdfGenerator';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import LoginForm from '@/components/LoginForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import StyleSelector from '@/components/StyleSelector';

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
  const [isPreview, setIsPreview] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // 设置Session Cookie
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; sameSite=lax`;
  };

  const handleLogout = () => {
    setUser(null);
    // 清除Session Cookie
    document.cookie = `user=; path=/; max-age=0; sameSite=lax`;
  };

  // 从Session Cookie加载用户
  useEffect(() => {
    const cookieUser = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1];
    if (cookieUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookieUser));
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
      }
    }
  }, []);

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleStyleChange = (style: ResumeStyle) => {
    setResumeStyle(style);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleDownloadPDF = async () => {
    if (!user) return;
    await generatePDF('resume-preview', `resume-${resumeData.personalInfo.name || 'user'}`);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 items-center py-4 sm:py-0">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <h1 className="text-xl font-bold text-primary">简历生成器</h1>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <LanguageSwitcher language={language} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
          {!user ? (
            <div className="mb-4">
              <LoginForm onLogin={handleLogin} language={language} />
            </div>
          ) : (
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-sm"
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
            {/* 表单区域 */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {language === 'zh' ? '简历信息' : 'Resume Information'}
                </h2>
                <button
                  onClick={togglePreview}
                  className="btn btn-primary"
                >
                  {isPreview ? (language === 'zh' ? '返回编辑' : 'Back to Edit') : (language === 'zh' ? '预览简历' : 'Preview Resume')}
                </button>
              </div>
              {!isPreview && (
                <ResumeForm
                  resumeData={resumeData}
                  onResumeDataChange={handleResumeDataChange}
                  language={language}
                />
              )}
            </div>

            {/* 预览区域 */}
            <div className="space-y-6">
              {/* 样式选择 */}
              <StyleSelector
                style={resumeStyle}
                onStyleChange={handleStyleChange}
                language={language}
              />
              
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {language === 'zh' ? '简历预览' : 'Resume Preview'}
                  </h2>
                  <button
                    onClick={handleDownloadPDF}
                    className="btn btn-primary"
                    disabled={!user}
                  >
                    {!user ? (language === 'zh' ? '登录后下载' : 'Login to Download') : (language === 'zh' ? '下载PDF' : 'Download PDF')}
                  </button>
                </div>
                <ResumePreview
                  resumeData={resumeData}
                  style={resumeStyle}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-inner mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 简历生成器 | Resume Builder</p>
        </div>
      </footer>
    </div>
  );
}