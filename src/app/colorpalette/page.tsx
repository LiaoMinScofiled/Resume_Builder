'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';
import ColorThief from 'colorthief';

type MockupType = 'website' | 'button' | 'card' | 'input';

export default function ColorPalettePage() {
  const { language, setLanguage } = useApp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [colors, setColors] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [mockupType, setMockupType] = useState<MockupType>('website');
  const [copiedColor, setCopiedColor] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setColors([]);
      setPalette([]);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      extractColors();
    }
  }, [imageUrl]);

  const extractColors = () => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const colorThief = new ColorThief();
      try {
        const dominantColor = colorThief.getColor(img);
        const colorPalette = colorThief.getPalette(img, 5);
        
        const rgbToHex = (rgb: number[]) => {
          return '#' + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
        };
        
        setColors([rgbToHex(dominantColor)]);
        setPalette(colorPalette.map(rgbToHex));
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(''), 2000);
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const renderMockup = () => {
    const primaryColor = palette[0] || '#3B82F6';
    const secondaryColor = palette[1] || '#10B981';
    const accentColor = palette[2] || '#F59E0B';
    const backgroundColor = palette[3] || '#6366F1';
    const textColor = palette[4] || '#8B5CF6';

    switch (mockupType) {
      case 'website':
        return (
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: primaryColor }}>
            <div className="p-4" style={{ backgroundColor: secondaryColor }}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-white/30"></div>
                <div className="w-4 h-4 rounded-full bg-white/30"></div>
                <div className="w-4 h-4 rounded-full bg-white/30"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-4 w-3/4 mb-3 rounded" style={{ backgroundColor: accentColor }}></div>
              <div className="h-3 w-1/2 mb-2 rounded" style={{ backgroundColor: backgroundColor }}></div>
              <div className="h-3 w-2/3 rounded" style={{ backgroundColor: textColor }}></div>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="flex flex-wrap gap-4 justify-center items-center h-64">
            <button
              className="px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor, color: getContrastColor(primaryColor) }}
            >
              {language === 'zh' ? '主要按钮' : 'Primary Button'}
            </button>
            <button
              className="px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: secondaryColor, color: getContrastColor(secondaryColor) }}
            >
              {language === 'zh' ? '次要按钮' : 'Secondary Button'}
            </button>
            <button
              className="px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor, color: getContrastColor(accentColor) }}
            >
              {language === 'zh' ? '强调按钮' : 'Accent Button'}
            </button>
          </div>
        );

      case 'card':
        return (
          <div className="w-full h-64 rounded-lg shadow-lg p-6 flex flex-col justify-between" style={{ backgroundColor: primaryColor }}>
            <div>
              <div className="h-6 w-1/3 mb-4 rounded" style={{ backgroundColor: secondaryColor }}></div>
              <div className="h-4 w-full mb-2 rounded" style={{ backgroundColor: accentColor }}></div>
              <div className="h-4 w-2/3 rounded" style={{ backgroundColor: backgroundColor }}></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-8 w-24 rounded" style={{ backgroundColor: textColor }}></div>
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="w-full h-64 rounded-lg shadow-lg p-6 flex flex-col justify-center space-y-4" style={{ backgroundColor: primaryColor }}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getContrastColor(primaryColor) }}>
                {language === 'zh' ? '输入框示例' : 'Input Example'}
              </label>
              <input
                type="text"
                placeholder={language === 'zh' ? '请输入内容...' : 'Enter content...'}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: secondaryColor, backgroundColor: accentColor, color: getContrastColor(accentColor) }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getContrastColor(primaryColor) }}>
                {language === 'zh' ? '文本区域' : 'Text Area'}
              </label>
              <textarea
                placeholder={language === 'zh' ? '请输入多行文本...' : 'Enter multi-line text...'}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none resize-none"
                style={{ borderColor: backgroundColor, backgroundColor: textColor, color: getContrastColor(textColor) }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '配色方案生成器' : 'Color Palette Generator'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '上传图片提取配色，生成调色板，可视化预览' : 'Upload image to extract colors, generate palette, visualize preview'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '上传图片' : 'Upload Image'}
              </h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {language === 'zh' ? '点击上传图片' : 'Click to upload image'}
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {colors.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '主色调' : 'Dominant Color'}
                </h2>
                <div className="flex items-center space-x-4">
                  <div
                    className="w-24 h-24 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: colors[0] }}
                    onClick={() => copyToClipboard(colors[0])}
                  />
                  <div className="flex-1">
                    <div className="font-mono text-lg font-bold text-gray-800">{colors[0]}</div>
                    <div className="text-sm text-gray-600">
                      {language === 'zh' ? '点击复制' : 'Click to copy'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {palette.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {language === 'zh' ? '调色板' : 'Color Palette'}
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((color, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div
                        className="w-full h-20 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
                {copiedColor && (
                  <div className="mt-4 text-center text-sm text-green-600">
                    {language === 'zh' ? `已复制: ${copiedColor}` : `Copied: ${copiedColor}`}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '可视化预览' : 'Visual Preview'}
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {(['website', 'button', 'card', 'input'] as MockupType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMockupType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      mockupType === type
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {type === 'website' && (language === 'zh' ? '网站' : 'Website')}
                    {type === 'button' && (language === 'zh' ? '按钮' : 'Button')}
                    {type === 'card' && (language === 'zh' ? '卡片' : 'Card')}
                    {type === 'input' && (language === 'zh' ? '输入框' : 'Input')}
                  </button>
                ))}
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                {palette.length > 0 ? (
                  renderMockup()
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    {language === 'zh' ? '请先上传图片提取颜色' : 'Please upload an image first to extract colors'}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {language === 'zh' ? '使用技巧' : 'Usage Tips'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  {language === 'zh' ? '• 上传图片自动提取主色调和调色板' : '• Upload image to automatically extract dominant color and palette'}
                </p>
                <p>
                  {language === 'zh' ? '• 点击颜色可复制到剪贴板' : '• Click on color to copy to clipboard'}
                </p>
                <p>
                  {language === 'zh' ? '• 切换不同的预览类型查看配色效果' : '• Switch between different preview types to see color effects'}
                </p>
                <p>
                  {language === 'zh' ? '• 调色板包含5种协调的颜色' : '• Palette includes 5 harmonious colors'}
                </p>
                <p>
                  {language === 'zh' ? '• 适用于网页设计、UI设计等场景' : '• Suitable for web design, UI design and other scenarios'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
