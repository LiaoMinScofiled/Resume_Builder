'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ToolCard from '@/components/ToolCard';
import LoginForm from '@/components/LoginForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import { User } from '@/types/resume';

export default function Home() {
  const { language, setLanguage, user, setUser } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [paid, setPaid] = useState(false);

  // 个人收款码图片路径（请将收款码图片放到 public/payment/ 目录下）
  const QR_CODES = {
    wechat: '/payment/wechat.png',
    alipay: '/payment/alipay.png',
  } as const;

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {language === 'zh' ? '在线工具箱' : 'Online Tools'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm hover:text-primary transition-colors duration-200"
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsDonateModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 text-sm cursor-pointer"
              >
                {language === 'zh' ? '支持我们' : 'Support Us'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              🆓 {language === 'zh' ? '完全免费' : 'Completely Free'}
            </span>
            <span className="px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              🤖 {language === 'zh' ? 'AI 增强' : 'AI Enhanced'}
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {language === 'zh' ? '在线工具箱' : 'Online Tools'}
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-6">
            {language === 'zh' ? '选择您需要的工具，快速完成各种任务' : 'Choose the tools you need to complete tasks quickly'}
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-80">
            {language === 'zh' ? '集成 AI 技术，提供智能简历生成、内容润色等功能，所有工具完全免费使用' : 'Integrated with AI technology, offering intelligent resume generation, content polishing, and all tools are completely free'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute -top-4 right-4 z-10 flex flex-col gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
                AI
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '简历生成器' : 'Resume Builder'}
              description={language === 'zh' ? 'AI 智能简历生成，支持内容自动润色、多种风格模板、中英文切换，一键导出 PDF' : 'AI-powered resume generator with automatic content polishing, multiple style templates, bilingual support, one-click PDF export'}
              icon={
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              href="/resume"
              color="border-blue-500"
              className="border-2 transform hover:scale-105 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
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
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
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
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
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
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
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

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '编码/解码' : 'Encoder/Decoder'}
              description={language === 'zh' ? 'URL 编码/解码、Base64 编码/解码，快速转换' : 'URL Encode/Decode, Base64 Encode/Decode, fast conversion'}
              icon={
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              href="/encoder"
              color="border-pink-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '密码工具' : 'Password Tools'}
              description={language === 'zh' ? '密码强度检测、安全密码生成，保护账户安全' : 'Password strength checker, secure password generator, protect your accounts'}
              icon={
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              href="/password"
              color="border-emerald-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '网名/ID生成器' : 'Nickname/ID Generator'}
              description={language === 'zh' ? '古风、游戏、英文、情侣等多种风格，个性化网名生成' : 'Ancient, game, English, couple and other styles, personalized nickname generation'}
              icon={
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              href="/nickname"
              color="border-rose-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '配色方案生成器' : 'Color Palette Generator'}
              description={language === 'zh' ? '提取图片配色、生成调色板、配色可视化预览' : 'Extract colors from images, generate palettes, visualize color schemes'}
              icon={
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              href="/colorpalette"
              color="border-pink-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '图片压缩器' : 'Image Compressor'}
              description={language === 'zh' ? '批量压缩图片、调整尺寸、转换格式、去除EXIF' : 'Batch compress images, resize, convert formats, remove EXIF'}
              icon={
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              href="/imagecompressor"
              color="border-teal-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '文件加密工具' : 'File Encryption Tool'}
              description={language === 'zh' ? '加密文件或文件夹，保护隐私安全，本地加密解密' : 'Encrypt files or folders to protect privacy, local encryption and decryption'}
              icon={
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              href="/encrypt"
              color="border-orange-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '数据转换与校验' : 'Data Converter & Validator'}
              description={language === 'zh' ? 'JSON/YAML/CSV 格式互转、Schema 校验、示例生成、Diff 比较' : 'JSON/YAML/CSV format conversion, Schema validation, example generation, Diff comparison'}
              icon={
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
              href="/dataconverter"
              color="border-indigo-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? '数据可视化生成器' : 'Data Visualization Generator'}
              description={language === 'zh' ? '上传 CSV 数据，生成精美图表，导出 PNG/SVG' : 'Upload CSV data, generate beautiful charts, export PNG/SVG'}
              icon={
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              href="/dataviz"
              color="border-cyan-500"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                Free
              </span>
            </div>
            <ToolCard
              title={language === 'zh' ? 'PDF 转 Word' : 'PDF to Word'}
              description={language === 'zh' ? '上传 PDF 文件，转换为 Word 文档并下载' : 'Upload PDF files, convert to Word documents and download'}
              icon={
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              href="/pdf-to-word"
              color="border-blue-500"
            />
          </div>
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

      {isDonateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsDonateModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'zh' ? '支持我们' : 'Support Us'}
              </h2>
              <button
                onClick={() => {
                  setIsDonateModalOpen(false);
                  setPaid(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {language === 'zh' ? '如果您觉得我们的工具对您有帮助，欢迎通过微信或支付宝扫码支持我们的发展' : 'If you find our tools helpful, please scan the QR code with WeChat or Alipay to support our development'}
              </p>

              {!paid ? (
                <>
                  {/* 支付方式切换 */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setPayMethod('wechat')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        payMethod === 'wechat'
                          ? 'bg-green-500 text-white shadow-md shadow-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2C4.438 2 1 4.736 1 8.127c0 1.956 1.143 3.703 2.916 4.84l-.729 2.19 2.552-1.276c.876.18 1.663.442 2.552.442.246 0 .49-.012.731-.034a5.92 5.92 0 0 1-.226-1.577c0-3.312 3.245-6 7.24-6 .257 0 .511.012.762.035C15.664 3.788 12.463 2 8.691 2zm-2.7 4.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm5.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16.4 9c-3.59 0-6.5 2.343-6.5 5.234 0 2.89 2.91 5.233 6.5 5.233.717 0 1.407-.11 2.05-.31l1.87.95-.5-1.675C21.317 17.04 22 15.686 22 14.234 22 11.343 19.09 9 16.4 9zm-2.1 2.7a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4zm4.2 0a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" />
                      </svg>
                      {language === 'zh' ? '微信支付' : 'WeChat Pay'}
                    </button>
                    <button
                      onClick={() => setPayMethod('alipay')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        payMethod === 'alipay'
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.5 17.5c-1.2-.6-3-1.4-4.7-2.1.6-1 1-2.1 1.3-3.3H13V10.5h4v-1h-4V7h-1.5v2.5H7.5v1h4v1.6H8.2v1h6.8c-.2.8-.6 1.6-1.1 2.3-2-.8-4.1-1.4-5.9-1.2-1.7.1-3 .8-3.5 1.5-1 1.5-.1 3.3 2.3 3.3 1.9 0 3.8-1 5.4-2.6 2 1 4.9 2.5 7.4 3.8l.9-1.2zM5.2 18.3c-1.6 0-2-.9-1.5-1.6.4-.5 1.1-.8 2-.9 1.5-.1 3.2.4 5 1.1-1.4 1.1-3.3 1.4-5.5 1.4z" />
                      </svg>
                      {language === 'zh' ? '支付宝' : 'Alipay'}
                    </button>
                  </div>

                  {/* 收款码展示 */}
                  <div
                    className={`p-6 rounded-2xl mb-6 ${
                      payMethod === 'wechat' ? 'bg-green-50' : 'bg-blue-50'
                    }`}
                  >
                    <p className="text-gray-700 mb-4 font-medium">
                      {language === 'zh'
                        ? `请使用${payMethod === 'wechat' ? '微信' : '支付宝'}扫一扫`
                        : `Scan with ${payMethod === 'wechat' ? 'WeChat' : 'Alipay'}`}
                    </p>
                    <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                      <Image
                        src={QR_CODES[payMethod]}
                        alt={language === 'zh' ? '收款码' : 'Payment QR Code'}
                        width={320}
                        height={320}
                        className="w-72 h-72 object-contain"
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-4">
                      {language === 'zh'
                        ? '扫码后请在 App 内输入打赏金额'
                        : 'Please enter the amount in the app after scanning'}
                    </p>
                  </div>

                  {/* 建议金额 */}
                  <div className="mb-6">
                    <p className="text-gray-700 mb-3 text-sm">
                      {language === 'zh' ? '建议打赏金额（仅供参考）' : 'Suggested amounts (for reference only)'}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 5, 10].map((amount) => (
                        <span
                          key={amount}
                          className="py-2 border border-gray-200 rounded-lg text-gray-600 text-center"
                        >
                          ¥{amount}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 我已支付按钮 */}
                  <button
                    onClick={() => setPaid(true)}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow hover:shadow-md transition-all duration-200"
                  >
                    {language === 'zh' ? '我已完成支付' : 'I have completed payment'}
                  </button>
                </>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === 'zh' ? '感谢您的支持！' : 'Thank you for your support!'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === 'zh'
                      ? '您的打赏是我们持续改进的动力，祝您工作顺利！'
                      : 'Your support motivates us to keep improving. Wish you all the best!'}
                  </p>
                  <button
                    onClick={() => {
                      setIsDonateModalOpen(false);
                      setPaid(false);
                    }}
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {language === 'zh' ? '关闭' : 'Close'}
                  </button>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-6">
                {language === 'zh' ? '您的支持是我们持续改进的动力，谢谢！' : 'Your support is our motivation to keep improving, thank you!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
