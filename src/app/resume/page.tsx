'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResumeData } from '@/types/resume';

import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { useApp } from '@/contexts/AppContext';

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
    location: '',
    age: '',
    title: '',
    status: '',
    salary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  awards: [],
  otherInfo: {},
};

export default function ResumeBuilder() {
  const { language, user } = useApp();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  // 字体状态
  const [fontFamily, setFontFamily] = useState<string>('微软雅黑');
  // 字体大小状态
  const [fontSize, setFontSize] = useState<number>(12);
  // 字体灰度状态 (字重)
  const [fontWeight, setFontWeight] = useState<number>(400);
  // 下拉菜单状态
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // 预览简历弹窗状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  // 样式调整弹窗状态
  const [showStyleModal, setShowStyleModal] = useState(false);
  // 模板设置弹窗状态
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // 样式设置状态
  const [moduleSpacing, setModuleSpacing] = useState<number>(18);
  const [lineSpacing, setLineSpacing] = useState<number>(21);
  const [pageMargin, setPageMargin] = useState<number>(12);
  const [infoPosition, setInfoPosition] = useState<'left' | 'center' | 'right'>('left');
  const [infoNameStyle, setInfoNameStyle] = useState<'text' | 'icon' | 'simple'>('text');
  
  // 模板设置状态
  const [dateStyle, setDateStyle] = useState<'dot' | 'chinese' | 'english'>('dot');
  const [datePosition, setDatePosition] = useState<'left' | 'right'>('right');
  // 模板样式状态
  const [resumeTemplate, setResumeTemplate] = useState<'template-1' | 'template-2' | 'template-3' | 'template-4' | 'template-5'>('template-1');

  // 测试环境变量
  useEffect(() => {
    console.log('=== 环境变量测试 ===');
    console.log('NEXT_PUBLIC_DASHSCOPE_API_KEY:', process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY);
    console.log('API Key configured:', !!process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY);
    console.log('API Key length:', process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY ? process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY.length : 0);
  }, []);

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

  const handleSaveResume = async () => {
    if (!user) return;
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

  // 模块导航状态
  const [activeModule, setActiveModule] = useState<string>('basic');

  // 处理模块点击事件
  const handleModuleClick = (module: string) => {
    setActiveModule(module);
  };
  // 技能布局状态
  const [skillLayout, setSkillLayout] = useState<'single' | 'double' | 'triple'>('double');
  // 技能样式状态
  const [skillStyle, setSkillStyle] = useState<string>('default');
  // 荣誉墙布局状态
  const [awardLayout, setAwardLayout] = useState<string>('title-tile-bg');
  
  const handleSkillLayoutChange = (layout: 'single' | 'double' | 'triple') => {
    setSkillLayout(layout);
  };
  
  const handleSkillStyleChange = (style: string) => {
    setSkillStyle(style);
  };
  
  const handleAwardLayoutChange = (layout: string) => {
    setAwardLayout(layout);
  };
  


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
            
            <div className="flex items-center gap-4">
              {/* 简历预览功能控件 */}
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                onClick={() => setShowPreviewModal(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {language === 'zh' ? '预览简历' : 'Preview Resume'}
              </button>
              
              {/* PDF下载控件 */}
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {language === 'zh' ? '下载PDF' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingResume ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* 左边栏：信息填写模块 */}
            <div>
              {/* 模块导航 */}
              <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
                <button
                  onClick={() => setActiveModule('basic')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'basic' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {language === 'zh' ? '基本信息' : 'Basic Info'}
                </button>
                <button
                  onClick={() => setActiveModule('education')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'education' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {language === 'zh' ? '教育经历' : 'Education'}
                </button>
                <button
                  onClick={() => setActiveModule('experience')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'experience' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {language === 'zh' ? '工作经历' : 'Experience'}
                </button>
                <button
                  onClick={() => setActiveModule('projects')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'projects' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {language === 'zh' ? '项目经历' : 'Projects'}
                </button>
                <button
                  onClick={() => setActiveModule('summary')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'summary' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {language === 'zh' ? '个人总结' : 'Summary'}
                </button>
                <button
                  onClick={() => setActiveModule('skills')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'skills' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {language === 'zh' ? '技能专长' : 'Skills'}
                </button>
                <button
                  onClick={() => setActiveModule('awards')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'awards' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {language === 'zh' ? '荣誉奖项' : 'Awards'}
                </button>
                <button
                  onClick={() => setActiveModule('other')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeModule === 'other' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {language === 'zh' ? '其他信息' : 'Other Info'}
                </button>
              </div>
              
              {/* 信息填写表单 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ResumeForm
                  resumeData={resumeData}
                  onResumeDataChange={handleResumeDataChange}
                  language={language}
                  activeModule={activeModule}
                  onSkillLayoutChange={handleSkillLayoutChange}
                  onSkillStyleChange={handleSkillStyleChange}
                  onAwardLayoutChange={handleAwardLayoutChange}
                  onFontFamilyChange={setFontFamily}
                />
              </div>
            </div>
            
            {/* 右边栏：简历预览和样式选择 */}
            <div>
              {/* 样式选择控件 */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4">
                    {/* 字体选择 */}
                    <div className="relative">
                      <button 
                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => setOpenDropdown(openDropdown === 'font' ? null : 'font')}
                      >
                        {fontFamily} ▼
                      </button>
                      {openDropdown === 'font' && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            {['微软雅黑', '宋体', '黑体', '楷体', '仿宋', '霞鹜文楷', '思源黑体', '仓耳渔阳体'].map((font) => (
                              <button
                                key={font}
                                className={`block w-full text-left px-4 py-2 text-sm ${fontFamily === font ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => {
                                  setFontFamily(font);
                                  setOpenDropdown(null);
                                }}
                              >
                                {font}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 字体大小选择 */}
                    <div className="relative">
                      <button 
                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
                      >
                        {fontSize} ▼
                      </button>
                      {openDropdown === 'size' && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            {[10, 11, 12, 13, 14, 15, 16, 18].map((size) => (
                              <button
                                key={size}
                                className={`block w-full text-left px-4 py-2 text-sm ${fontSize === size ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => {
                                  setFontSize(size);
                                  setOpenDropdown(null);
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 字体灰度选择 */}
                    <div className="relative">
                      <button 
                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => setOpenDropdown(openDropdown === 'weight' ? null : 'weight')}
                      >
                        A ▼
                      </button>
                      {openDropdown === 'weight' && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">{language === 'zh' ? '字体灰度' : 'Font Weight'}</h4>
                            <div className="flex flex-wrap gap-2">
                              {[300, 400, 500, 600, 700].map((weight) => (
                                <button
                                  key={weight}
                                  className={`px-3 py-1 rounded-md ${fontWeight === weight ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`}
                                  onClick={() => {
                                    setFontWeight(weight);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <span style={{ fontWeight: weight }}>A</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => setShowStyleModal(true)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {language === 'zh' ? '调整样式' : 'Adjust Style'}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => setShowTemplateModal(true)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {language === 'zh' ? '模板设置' : 'Template Settings'}
                    </button>
                    <div className="relative">
                      <select 
                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors border-none outline-none cursor-pointer"
                        value={resumeTemplate}
                        onChange={(e) => setResumeTemplate(e.target.value as 'template-1' | 'template-2' | 'template-3' | 'template-4' | 'template-5')}
                      >
                        <option value="template-1">{language === 'zh' ? '现代简约' : 'Modern Simple'}</option>
                        <option value="template-2">{language === 'zh' ? '专业商务' : 'Professional Business'}</option>
                        <option value="template-3">{language === 'zh' ? '创意设计' : 'Creative Design'}</option>
                        <option value="template-4">{language === 'zh' ? '经典学术' : 'Classic Academic'}</option>
                        <option value="template-5">{language === 'zh' ? '简约卡片' : 'Simple Card'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 简历预览 */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  {language === 'zh' ? '简历预览' : 'Resume Preview'}
                </h2>
                <div id="resume-preview-inline" className="bg-white p-4 rounded-lg border border-gray-100 overflow-auto max-h-[800px]">
                  <ResumePreview
                    resumeData={resumeData}
                    language={language}
                    skillLayout={skillLayout}
                    skillStyle={skillStyle}
                    awardLayout={awardLayout}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    onModuleClick={handleModuleClick}
                    moduleSpacing={moduleSpacing}
                    lineSpacing={lineSpacing}
                    pageMargin={pageMargin}
                    infoPosition={infoPosition}
                    infoNameStyle={infoNameStyle}
                    dateStyle={dateStyle}
                    datePosition={datePosition}
                    template={resumeTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 预览简历弹窗 */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{language === 'zh' ? '预览简历' : 'Preview Resume'}</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPreviewModal(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <ResumePreview
                    resumeData={resumeData}
                    language={language}
                    skillLayout={skillLayout}
                    skillStyle={skillStyle}
                    awardLayout={awardLayout}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    moduleSpacing={moduleSpacing}
                    lineSpacing={lineSpacing}
                    pageMargin={pageMargin}
                    infoPosition={infoPosition}
                    infoNameStyle={infoNameStyle}
                    dateStyle={dateStyle}
                    datePosition={datePosition}
                    template={resumeTemplate}
                  />
                </div>
              </div>

            </div>
          </div>
      )}
      
      {/* 样式调整弹窗 */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{language === 'zh' ? '调整样式' : 'Adjust Style'}</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowStyleModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* 间距设置 */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {language === 'zh' ? '间距设置' : 'Spacing Settings'}
                </h4>
                
                {/* 模块上下间距 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'zh' ? '模块上下间距:' : 'Module Spacing:'}
                    </label>
                    <span className="text-sm font-medium text-gray-700">{moduleSpacing}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={moduleSpacing}
                    onChange={(e) => setModuleSpacing(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                
                {/* 行间距 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'zh' ? '行间距:' : 'Line Spacing:'}
                    </label>
                    <span className="text-sm font-medium text-gray-700">{lineSpacing}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={lineSpacing}
                    onChange={(e) => setLineSpacing(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                
                {/* 页边距 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'zh' ? '页边距:' : 'Page Margin:'}
                    </label>
                    <span className="text-sm font-medium text-gray-700">{pageMargin}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={pageMargin}
                    onChange={(e) => setPageMargin(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
              
              {/* 信息样式 */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {language === 'zh' ? '信息样式' : 'Info Style'}
                </h4>
                
                {/* 信息位置 */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === 'zh' ? '信息位置:' : 'Info Position:'}
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoPosition === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoPosition('left')}
                    >
                      {language === 'zh' ? '居左' : 'Left'}
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoPosition === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoPosition('center')}
                    >
                      {language === 'zh' ? '居中' : 'Center'}
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoPosition === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoPosition('right')}
                    >
                      {language === 'zh' ? '居右' : 'Right'}
                    </button>
                  </div>
                </div>
                
                {/* 信息名称样式 */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === 'zh' ? '信息名称:' : 'Info Name Style:'}
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoNameStyle === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoNameStyle('text')}
                    >
                      {language === 'zh' ? '文字' : 'Text'}
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoNameStyle === 'icon' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoNameStyle('icon')}
                    >
                      {language === 'zh' ? '图标' : 'Icon'}
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${infoNameStyle === 'simple' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setInfoNameStyle('simple')}
                    >
                      {language === 'zh' ? '简约' : 'Simple'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 模板设置弹窗 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{language === 'zh' ? '模板设置' : 'Template Settings'}</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowTemplateModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* 日期样式 */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {language === 'zh' ? '日期样式' : 'Date Style'}
                </h4>
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${dateStyle === 'dot' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDateStyle('dot')}
                  >
                    2025.04
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${dateStyle === 'chinese' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDateStyle('chinese')}
                  >
                    2025年04月
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${dateStyle === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDateStyle('english')}
                  >
                    Apr 2025
                  </button>
                </div>
              </div>
              
              {/* 日期位置 */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {language === 'zh' ? '日期位置' : 'Date Position'}
                </h4>
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${datePosition === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDatePosition('left')}
                  >
                    {language === 'zh' ? '居左' : 'Left'}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${datePosition === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDatePosition('right')}
                  >
                    {language === 'zh' ? '居右' : 'Right'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      

      </main>
    </div>
  );
}
