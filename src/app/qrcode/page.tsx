'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export default function QRCodeGenerator() {
  const { language, setLanguage, user } = useApp();
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert(language === 'zh' ? '请输入内容' : 'Please enter content');
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });

      setQrCode(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert(language === 'zh' ? '生成二维码失败' : 'Failed to generate QR code');
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    if (!user) {
      alert(language === 'zh' ? '请先登录后下载' : 'Please login first to download');
      return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCode;
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      scanQRCode(result);
    };
    reader.readAsDataURL(file);
  };

  const scanQRCode = (imageData: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setScanResult(code.data);
      } else {
        setScanResult('');
        alert(language === 'zh' ? '无法识别二维码，请上传清晰的二维码图片' : 'Unable to recognize QR code, please upload a clear QR code image');
      }
    };
    img.src = imageData;
  };

  const copyScanResult = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    alert(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            {language === 'zh' ? '二维码生成解析器' : 'QR Code Generator & Scanner'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '生成自定义二维码，或解析二维码内容' : 'Generate custom QR codes or scan QR code content'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setMode('generate')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'generate'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '生成二维码' : 'Generate QR Code'}
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                mode === 'scan'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'zh' ? '解析二维码' : 'Scan QR Code'}
            </button>
          </div>
        </div>

        {mode === 'generate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '输入内容' : 'Input Content'}
                </h2>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">{language === 'zh' ? '文本或链接' : 'Text or Link'}</label>
                    <textarea
                      className="form-textarea"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={language === 'zh' ? '请输入要生成二维码的文本或链接...' : 'Enter text or link to generate QR code...'}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '尺寸' : 'Size'}: {size}px</label>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="32"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '二维码颜色' : 'QR Code Color'}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">{color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{language === 'zh' ? '背景颜色' : 'Background Color'}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">{bgColor}</span>
                    </div>
                  </div>

                  <button
                    onClick={generateQRCode}
                    className="btn btn-primary w-full"
                  >
                    {language === 'zh' ? '生成二维码' : 'Generate QR Code'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '预览' : 'Preview'}
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  {qrCode ? (
                    <>
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="border-2 border-gray-200 rounded-lg shadow-lg"
                      />
                      <button
                        onClick={downloadQRCode}
                        className="btn btn-secondary"
                      >
                        {language === 'zh' ? '下载二维码' : 'Download QR Code'}
                      </button>
                      {!user && (
                        <p className="text-sm text-gray-500">
                          {language === 'zh' ? '需要登录后才能下载' : 'Login required to download'}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">
                        {language === 'zh' ? '在左侧输入内容并点击生成' : 'Enter content on left and click generate'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '上传二维码图片' : 'Upload QR Code Image'}
                </h2>
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">
                      {language === 'zh' ? '点击或拖拽上传二维码图片' : 'Click or drag to upload QR code image'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'zh' ? '支持 PNG、JPG、GIF 格式' : 'Supports PNG, JPG, GIF formats'}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedImage && (
                    <div className="mt-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded QR Code"
                        className="w-full max-w-md mx-auto border-2 border-gray-200 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '解析结果' : 'Scan Result'}
                </h2>
                <div className="space-y-4">
                  {scanResult ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans">
                          {scanResult}
                        </pre>
                      </div>
                      <button
                        onClick={copyScanResult}
                        className="btn btn-secondary w-full"
                      >
                        {language === 'zh' ? '复制结果' : 'Copy Result'}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">
                        {language === 'zh' ? '上传二维码图片后显示解析结果' : 'Upload QR code image to see scan result'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
