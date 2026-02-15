'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import * as OpenCC from 'opencc-js';

export default function ConvertPage() {
  const { language, setLanguage } = useApp();
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
                {language === 'zh' ? '在线工具箱' : 'Online Tools'}
              </span>
            </Link>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '繁简转换' : 'Traditional/Simplified Converter'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '中文繁体和简体相互转换' : 'Convert between Traditional and Simplified Chinese'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setConvertDirection('s2t')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                convertDirection === 's2t'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '简体转繁体' : 'Simplified to Traditional'}
            </button>
            <button
              onClick={() => setConvertDirection('t2s')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                convertDirection === 't2s'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '繁体转简体' : 'Traditional to Simplified'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '输入文本' : 'Input Text'}
              </h2>
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === 'zh' ? '请输入要转换的文本...' : 'Please enter text to convert...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={12}
                />
                <div className="flex gap-2">
                  <button
                    onClick={convertText}
                    disabled={isConverting}
                    className="btn btn-primary flex-1"
                  >
                    {isConverting
                      ? (language === 'zh' ? '转换中...' : 'Converting...')
                      : (language === 'zh' ? '开始转换' : 'Start Conversion')}
                  </button>
                  <button
                    onClick={clearText}
                    className="btn btn-secondary"
                  >
                    {language === 'zh' ? '清空' : 'Clear'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '转换结果' : 'Conversion Result'}
              </h2>
              <div className="space-y-4">
                <textarea
                  value={outputText}
                  readOnly
                  placeholder={language === 'zh' ? '转换结果将显示在这里...' : 'Conversion result will appear here...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                  rows={12}
                />
                <button
                  onClick={copyText}
                  disabled={!outputText}
                  className="btn btn-secondary w-full"
                >
                  {language === 'zh' ? '复制结果' : 'Copy Result'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'zh' ? '使用技巧' : 'Usage Tips'}
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              {language === 'zh' ? '• 支持简体中文和繁体中文之间的相互转换' : '• Supports conversion between Simplified and Traditional Chinese'}
            </p>
            <p>
              {language === 'zh' ? '• 转换速度快，准确率高' : '• Fast conversion with high accuracy'}
            </p>
            <p>
              {language === 'zh' ? '• 支持大量文本转换' : '• Supports large text conversion'}
            </p>
            <p>
              {language === 'zh' ? '• 点击复制按钮快速复制结果' : '• Click copy button to quickly copy results'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
