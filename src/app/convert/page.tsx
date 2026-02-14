'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import * as OpenCC from 'opencc-js';

export default function ConvertPage() {
  const { language, setLanguage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [convertDirection, setConvertDirection] = useState<'s2t' | 't2s'>('s2t');
  const [isConverting, setIsConverting] = useState(false);

  const convertText = async () => {
    if (!inputText.trim()) {
      alert(language === 'zh' ? '请输入要转换的文本' : 'Please enter text to convert');
      return;
    }

    setIsConverting(true);
    try {
      const converter = OpenCC.Converter({ from: convertDirection === 's2t' ? 'cn' : 'tw', to: convertDirection === 's2t' ? 'tw' : 'cn' });
      const result = await converter(inputText);
      setOutputText(result);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert(language === 'zh' ? '转换失败，请重试' : 'Conversion failed, please try again');
    } finally {
      setIsConverting(false);
    }
  };

  const copyText = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
  };

  const isLoggedIn = !!user;
  const isChineseMode = language === 'zh';

  if (!isLoggedIn) {
    const title = isChineseMode ? '在线工具箱' : 'Online Tools';
    const toolName = isChineseMode ? '繁简转换' : 'Traditional/Simplified';
    const toolDesc = isChineseMode ? '中文繁体和简体相互转换' : 'Convert between Traditional and Simplified Chinese';
    const loginTitle = isChineseMode ? '请先登录' : 'Please Login First';
    const loginDesc = isChineseMode ? '登录后即可使用繁简转换功能' : 'Login to use conversion tool';
    const loginBtn = isChineseMode ? '返回首页登录' : 'Back to Home to Login';

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7-7m-7 0l-2 2m2-2l7-7 7-7" />
                </svg>
                <span className="text-xl font-bold text-gray-900">
                  {title}
                </span>
              </Link>
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {toolName}
                </h1>
                <p className="text-gray-600">
                  {toolDesc}
                </p>
              </div>
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {loginTitle}
                </h2>
                <p className="text-gray-600 mb-4">
                  {loginDesc}
                </p>
                <Link
                  href="/"
                  className="btn btn-primary w-full text-center"
                >
                  {loginBtn}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isChineseMode) {
    const title = 'Online Tools';
    const toolName = 'Traditional/Simplified';
    const toolDesc = 'Convert between Traditional and Simplified Chinese';
    const switchTitle = 'Please Switch to Chinese';
    const switchDesc = 'This feature is only available in Chinese mode';
    const switchBtn = 'Switch to Chinese';

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7-7m-7 0l-2 2m2-2l7-7 7-7" />
                </svg>
                <span className="text-xl font-bold text-gray-900">
                  {title}
                </span>
              </Link>
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {toolName}
                </h1>
                <p className="text-gray-600">
                  {toolDesc}
                </p>
              </div>
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {switchTitle}
                </h2>
                <p className="text-gray-600 mb-4">
                  {switchDesc}
                </p>
                <button
                  onClick={() => setLanguage('zh')}
                  className="btn btn-primary w-full"
                >
                  {switchBtn}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7-7m-7 0l-2 2m2-2l7-7 7-7" />
              </svg>
              <span className="text-xl font-bold text-gray-900">
                {isChineseMode ? '在线工具箱' : 'Online Tools'}
              </span>
            </Link>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isChineseMode ? '繁简转换' : 'Traditional/Simplified'}
          </h1>
          <p className="text-xl text-gray-600">
            {isChineseMode ? '中文繁体和简体相互转换' : 'Convert between Traditional and Simplified Chinese'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {convertDirection === 's2t' ? '简体中文' : '繁体中文'}
                </h2>
                <button
                  onClick={() => setConvertDirection(convertDirection === 's2t' ? 't2s' : 's2t')}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  {isChineseMode ? '切换方向' : 'Switch Direction'}
                </button>
              </div>
              <div className="space-y-4">
                <textarea
                  className="form-textarea"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={convertDirection === 's2t' ? '请输入简体中文...' : '请输入繁体中文...'}
                  rows={12}
                />
                <div className="flex gap-2">
                  <button
                    onClick={convertText}
                    disabled={isConverting}
                    className="btn btn-primary flex-1"
                  >
                    {isConverting ? (isChineseMode ? '转换中...' : 'Converting...') : (isChineseMode ? '转换' : 'Convert')}
                  </button>
                  <button
                    onClick={clearText}
                    className="btn btn-secondary"
                  >
                    {isChineseMode ? '清空' : 'Clear'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {convertDirection === 's2t' ? '繁体中文' : '简体中文'}
                </h2>
                {outputText && (
                  <button
                    onClick={copyText}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    {isChineseMode ? '复制' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] border border-gray-200">
                  <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans">
                    {outputText || (isChineseMode ? '转换结果将显示在这里...' : 'Conversion result will appear here...')}
                  </pre>
                </div>
                {outputText && (
                  <div className="text-sm text-gray-500">
                    {isChineseMode ? '字数统计' : 'Character Count'}: {outputText.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
