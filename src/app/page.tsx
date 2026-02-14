'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import LoginForm from '@/components/LoginForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import { User } from '@/types/resume';

export default function Home() {
  const { language, setLanguage, user, setUser } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {language === 'zh' ? '在线工具箱' : 'Online Tools'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {language === 'zh' ? '退出' : 'Logout'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn btn-primary text-sm"
                >
                  {language === 'zh' ? '登录' : 'Login'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '在线工具箱' : 'Online Tools'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'zh' ? '选择您需要的工具，快速完成各种任务' : 'Choose the tools you need to complete tasks quickly'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          <ToolCard
            title={language === 'zh' ? '简历生成器' : 'Resume Builder'}
            description={language === 'zh' ? '创建专业美观的简历，支持多种风格、中英文切换，支持照片上传和PDF导出' : 'Create professional and beautiful resumes with multiple styles, bilingual support, photo upload and PDF export'}
            icon={
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            href="/resume"
            color="border-blue-500"
          />

          <ToolCard
            title={language === 'zh' ? '二维码生成解析器' : 'QR Code Generator & Scanner'}
            description={language === 'zh' ? '生成自定义二维码，支持自定义颜色、大小和样式，支持文本、链接等多种内容，同时支持二维码解析' : 'Generate custom QR codes with custom colors, sizes and styles, supporting text, links and more, also supports QR code scanning'}
            icon={
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            }
            href="/qrcode"
            color="border-purple-500"
          />

          <ToolCard
            title={language === 'zh' ? '繁简转换' : 'Traditional/Simplified'}
            description={language === 'zh' ? '中文繁体和简体相互转换，支持大段文本处理，快速准确' : 'Convert between Traditional and Simplified Chinese, support large text processing, fast and accurate'}
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            }
            href="/convert"
            color="border-green-500"
          />

          <ToolCard
            title={language === 'zh' ? '语音工具' : 'Speech Tools'}
            description={language === 'zh' ? '文字转语音、语音转文字，支持多种语音和语言，实时转换' : 'Text to Speech, Speech to Text, supports multiple voices and languages, real-time conversion'}
            icon={
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            }
            href="/speech"
            color="border-orange-500"
          />

          <ToolCard
            title={language === 'zh' ? '计算器' : 'Calculator'}
            description={language === 'zh' ? '日常计算、科学计算、程序员计算，支持多种进制转换' : 'Basic, Scientific, and Programmer Calculator with multiple base conversions'}
            icon={
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            href="/calculator"
            color="border-cyan-500"
          />
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            © 2024 {language === 'zh' ? '在线工具箱 - 让工作更高效' : 'Online Tools - Make work more efficient'}
          </p>
        </div>
      </div>

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsLoginModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'zh' ? '登录 / 注册' : 'Login / Register'}
              </h2>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <LoginForm onLogin={handleLogin} language={language} />
          </div>
        </div>
      )}
    </div>
  );
}
