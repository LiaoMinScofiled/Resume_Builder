'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

export default function EncoderPage() {
  const { language, setLanguage } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  const handleUrlEncode = () => {
    try {
      const encoded = encodeURIComponent(urlInput);
      setUrlOutput(encoded);
    } catch (error) {
      setUrlOutput(language === 'zh' ? '编码失败' : 'Encoding failed');
    }
  };

  const handleUrlDecode = () => {
    try {
      const decoded = decodeURIComponent(urlInput);
      setUrlOutput(decoded);
    } catch (error) {
      setUrlOutput(language === 'zh' ? '解码失败' : 'Decoding failed');
    }
  };

  const handleUrlSubmit = () => {
    if (urlMode === 'encode') {
      handleUrlEncode();
    } else {
      handleUrlDecode();
    }
  };

  const handleUrlClear = () => {
    setUrlInput('');
    setUrlOutput('');
  };

  const handleBase64Encode = () => {
    try {
      const encoded = btoa(base64Input);
      setBase64Output(encoded);
    } catch (error) {
      setBase64Output(language === 'zh' ? '编码失败' : 'Encoding failed');
    }
  };

  const handleBase64Decode = () => {
    try {
      const decoded = atob(base64Input);
      setBase64Output(decoded);
    } catch (error) {
      setBase64Output(language === 'zh' ? '解码失败' : 'Decoding failed');
    }
  };

  const handleBase64Submit = () => {
    if (base64Mode === 'encode') {
      handleBase64Encode();
    } else {
      handleBase64Decode();
    }
  };

  const handleBase64Clear = () => {
    setBase64Input('');
    setBase64Output('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
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
            {language === 'zh' ? '编码/解码工具' : 'Encoder/Decoder Tools'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? 'URL 编码/解码、Base64 编码/解码' : 'URL Encode/Decode, Base64 Encode/Decode'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'zh' ? 'URL 编码/解码' : 'URL Encode/Decode'}
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setUrlMode('encode');
                    setUrlOutput('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    urlMode === 'encode'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {language === 'zh' ? '编码' : 'Encode'}
                </button>
                <button
                  onClick={() => {
                    setUrlMode('decode');
                    setUrlOutput('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    urlMode === 'decode'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {language === 'zh' ? '解码' : 'Decode'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输入内容' : 'Input'}
                </label>
                <textarea
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={language === 'zh' ? '请输入要' + (urlMode === 'encode' ? '编码' : '解码') + '的内容' : 'Enter text to ' + (urlMode === 'encode' ? 'encode' : 'decode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUrlSubmit}
                  className="btn btn-primary flex-1"
                >
                  {urlMode === 'encode' ? (language === 'zh' ? '编码' : 'Encode') : (language === 'zh' ? '解码' : 'Decode')}
                </button>
                <button
                  onClick={handleUrlClear}
                  className="btn btn-secondary"
                >
                  {language === 'zh' ? '清空' : 'Clear'}
                </button>
              </div>

              {urlOutput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '输出结果' : 'Output'}
                  </label>
                  <div className="relative">
                    <textarea
                      value={urlOutput}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                      rows={6}
                    />
                    <button
                      onClick={() => copyToClipboard(urlOutput)}
                      className="absolute top-2 right-2 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                    >
                      {language === 'zh' ? '复制' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'zh' ? 'Base64 编码/解码' : 'Base64 Encode/Decode'}
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setBase64Mode('encode');
                    setBase64Output('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    base64Mode === 'encode'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {language === 'zh' ? '编码' : 'Encode'}
                </button>
                <button
                  onClick={() => {
                    setBase64Mode('decode');
                    setBase64Output('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    base64Mode === 'decode'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {language === 'zh' ? '解码' : 'Decode'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '输入内容' : 'Input'}
                </label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder={language === 'zh' ? '请输入要' + (base64Mode === 'encode' ? '编码' : '解码') + '的内容' : 'Enter text to ' + (base64Mode === 'encode' ? 'encode' : 'decode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBase64Submit}
                  className="btn btn-primary flex-1"
                >
                  {base64Mode === 'encode' ? (language === 'zh' ? '编码' : 'Encode') : (language === 'zh' ? '解码' : 'Decode')}
                </button>
                <button
                  onClick={handleBase64Clear}
                  className="btn btn-secondary"
                >
                  {language === 'zh' ? '清空' : 'Clear'}
                </button>
              </div>

              {base64Output && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '输出结果' : 'Output'}
                  </label>
                  <div className="relative">
                    <textarea
                      value={base64Output}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                      rows={6}
                    />
                    <button
                      onClick={() => copyToClipboard(base64Output)}
                      className="absolute top-2 right-2 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                    >
                      {language === 'zh' ? '复制' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {language === 'zh' ? 'URL 编码说明' : 'URL Encoding Info'}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {language === 'zh' ? 'URL 编码用于将特殊字符转换为可以在 URL 中安全传输的格式。' : 'URL encoding converts special characters into a format that can be safely transmitted in URLs.'}
              </p>
              <p>
                {language === 'zh' ? '例如：空格会被编码为 "%20"，中文会被编码为 "%E4%B8%AD%E6%96%87"。' : 'For example: spaces are encoded as "%20", and Chinese characters are encoded as "%E4%B8%AD%E6%96%87".'}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {language === 'zh' ? 'Base64 编码说明' : 'Base64 Encoding Info'}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {language === 'zh' ? 'Base64 是一种用 64 个字符来表示任意二进制数据的方法。' : 'Base64 is a method of representing arbitrary binary data using 64 characters.'}
              </p>
              <p>
                {language === 'zh' ? '常用于在 HTTP 环境下传递较长的标识信息、电子邮件附件等。' : 'Commonly used for transmitting longer identification information in HTTP environments, email attachments, etc.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
