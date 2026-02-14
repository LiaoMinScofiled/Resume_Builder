'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResumeData, ResumeStyle } from '@/types/resume';
import { generatePDF } from '@/lib/pdfGenerator';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import StyleSelector from '@/components/StyleSelector';
import { useApp } from '@/contexts/AppContext';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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

export default function ResumeBuilder() {
  const { language, user } = useApp();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>('style-1');
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
    if (user) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      const timeout = setTimeout(() => {
        handleSaveResume();
      }, 2000);
      setAutoSaveTimeout(timeout);
    }
  };

  const handleStyleChange = (style: ResumeStyle) => {
    setResumeStyle(style);
  };

  const handleDownloadPDFInline = async () => {
    if (!user) {
      alert(language === 'zh' ? '请先登录' : 'Please login first');
      return;
    }
    await generatePDF('resume-preview-inline', `${resumeData.personalInfo.name || 'resume'}.pdf`);
  };

  const handleSaveResume = async () => {
    if (!user) return;

    setSaveStatus('saving');
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          resumeData,
        }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    const loadResumeData = async (userId: string) => {
      setIsLoadingResume(true);
      try {
        const response = await fetch(`/api/resume/load?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.resumeData) {
            setResumeData(data.resumeData);
          }
        }
      } catch (error) {
        console.error('Failed to load resume data:', error);
      } finally {
        setIsLoadingResume(false);
      }
    };

    if (user) {
      loadResumeData(user.id);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7-7m-7 0l-2 2m2-2l7-7 7-7" />
              </svg>
              <span className="text-xl font-bold text-gray-900">
                {language === 'zh' ? '在线工具箱' : 'Online Tools'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingResume ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ResumeForm
                resumeData={resumeData}
                onResumeDataChange={handleResumeDataChange}
                language={language}
              />
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
                  >
                    {language === 'zh' ? '下载PDF' : 'Download PDF'}
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
        ) : (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {language === 'zh' ? '简历生成器' : 'Resume Builder'}
                </h1>
                <p className="text-gray-600">
                  {language === 'zh' ? '创建专业美观的简历' : 'Create professional and beautiful resumes'}
                </p>
              </div>
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {language === 'zh' ? '请先登录' : 'Please Login First'}
                </h2>
                <p className="text-gray-600 mb-4">
                  {language === 'zh' ? '登录后即可使用简历生成器功能' : 'Login to use the resume builder'}
                </p>
                <Link
                  href="/"
                  className="btn btn-primary w-full text-center"
                >
                  {language === 'zh' ? '返回首页登录' : 'Back to Home to Login'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
