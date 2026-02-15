'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  format: string;
}

type OutputFormat = 'original' | 'webp' | 'avif' | 'jpeg' | 'png';

export default function ImageCompressorPage() {
  const { language, setLanguage } = useApp();
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('webp');
  const [removeExif, setRemoveExif] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.originalUrl);
        if (img.compressedUrl) {
          URL.revokeObjectURL(img.compressedUrl);
        }
      });
    };
  }, [images]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: CompressedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      compressedUrl: '',
      originalSize: file.size,
      compressedSize: 0,
      format: file.type.split('/')[1] || 'unknown',
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleProcessImages = async () => {
    setIsProcessing(true);

    for (const image of images) {
      try {
        const compressedUrl = await compressImage(
          image.originalFile,
          quality,
          maxWidth,
          maxHeight,
          outputFormat,
          removeExif
        );

        const compressedBlob = await fetch(compressedUrl).then((res) => res.blob());

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  compressedUrl,
                  compressedSize: compressedBlob.size,
                }
              : img
          )
        );
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setIsProcessing(false);
  };

  const compressImage = async (
    file: File,
    qualityValue: number,
    maxWidthValue: number,
    maxHeightValue: number,
    formatValue: OutputFormat,
    removeExifValue: boolean
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidthValue || height > maxHeightValue) {
          const ratio = Math.min(maxWidthValue / width, maxHeightValue / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          let mimeType = file.type;
          if (formatValue !== 'original') {
            switch (formatValue) {
              case 'webp':
                mimeType = 'image/webp';
                break;
              case 'avif':
                mimeType = 'image/avif';
                break;
              case 'jpeg':
                mimeType = 'image/jpeg';
                break;
              case 'png':
                mimeType = 'image/png';
                break;
            }
          }

          const qualityDecimal = qualityValue / 100;
          const dataUrl = canvas.toDataURL(mimeType, qualityDecimal);
          resolve(dataUrl);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDownload = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.originalFile.name.split('.')[0]}.${getFormatExtension(outputFormat)}`;
    link.click();
  };

  const handleDownloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        handleDownload(image);
      }, index * 500);
    });
  };

  const handleRemove = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.originalUrl);
      if (imageToRemove.compressedUrl) {
        URL.revokeObjectURL(imageToRemove.compressedUrl);
      }
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) {
        URL.revokeObjectURL(img.compressedUrl);
      }
    });
    setImages([]);
  };

  const getFormatExtension = (format: OutputFormat): string => {
    switch (format) {
      case 'webp':
        return 'webp';
      case 'avif':
        return 'avif';
      case 'jpeg':
        return 'jpg';
      case 'png':
        return 'png';
      default:
        return 'jpg';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateCompressionRatio = (original: number, compressed: number): number => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
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
            {language === 'zh' ? '图片压缩与格式转换器' : 'Image Compressor & Format Converter'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'zh' ? '批量压缩图片、调整尺寸、转换格式、去除EXIF信息' : 'Batch compress images, resize, convert formats, remove EXIF data'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'zh' ? '上传图片' : 'Upload Images'}
                </h2>
                {images.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    {language === 'zh' ? '清空' : 'Clear'}
                  </button>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary w-full"
              >
                <svg className="mx-auto h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ml-2">
                  {language === 'zh' ? `选择图片 (${images.length})` : `Select Images (${images.length})`}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'zh' ? '压缩设置' : 'Compression Settings'}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? `质量: ${quality}%` : `Quality: ${quality}%`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{language === 'zh' ? '低质量' : 'Low'}</span>
                    <span>{language === 'zh' ? '高质量' : 'High'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? `最大宽度: ${maxWidth}px` : `Max Width: ${maxWidth}px`}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? `最大高度: ${maxHeight}px` : `Max Height: ${maxHeight}px`}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '输出格式' : 'Output Format'}
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="original">{language === 'zh' ? '原始格式' : 'Original'}</option>
                    <option value="webp">WebP</option>
                    <option value="avif">AVIF</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="removeExif"
                    checked={removeExif}
                    onChange={(e) => setRemoveExif(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="removeExif" className="ml-2 block text-sm text-gray-700">
                    {language === 'zh' ? '去除EXIF信息' : 'Remove EXIF data'}
                  </label>
                </div>

                {images.length > 0 && (
                  <button
                    onClick={handleProcessImages}
                    disabled={isProcessing}
                    className="btn btn-primary w-full"
                  >
                    {isProcessing
                      ? (language === 'zh' ? '处理中...' : 'Processing...')
                      : (language === 'zh' ? '开始压缩' : 'Start Compression')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'zh' ? '压缩结果' : 'Compression Results'}
                </h2>
                {images.some(img => img.compressedUrl) && (
                  <button
                    onClick={handleDownloadAll}
                    className="btn btn-primary"
                  >
                    {language === 'zh' ? '下载全部' : 'Download All'}
                  </button>
                )}
              </div>

              {images.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>{language === 'zh' ? '暂无图片，请上传图片' : 'No images yet, please upload images'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <img
                            src={image.originalUrl}
                            alt={image.originalFile.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {image.compressedUrl && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                              ✓
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate mb-2">
                            {image.originalFile.name}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-600">{language === 'zh' ? '原始' : 'Original'}</div>
                              <div className="font-mono text-gray-900">{formatFileSize(image.originalSize)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">{language === 'zh' ? '压缩后' : 'Compressed'}</div>
                              <div className="font-mono text-gray-900">
                                {image.compressedSize > 0 ? formatFileSize(image.compressedSize) : (language === 'zh' ? '待处理' : 'Pending')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">{language === 'zh' ? '压缩比' : 'Ratio'}</div>
                              <div className="font-mono text-green-600">
                                {image.compressedSize > 0 ? `-${calculateCompressionRatio(image.originalSize, image.compressedSize)}%` : '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">{language === 'zh' ? '格式' : 'Format'}</div>
                              <div className="font-mono text-gray-900">
                                {outputFormat === 'original' ? image.format : outputFormat.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDownload(image)}
                          disabled={!image.compressedUrl}
                          className="btn btn-primary flex-1"
                        >
                          {language === 'zh' ? '下载' : 'Download'}
                        </button>
                        <button
                          onClick={() => handleRemove(image.id)}
                          className="btn btn-secondary"
                        >
                          {language === 'zh' ? '删除' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {language === 'zh' ? '使用技巧' : 'Usage Tips'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  {language === 'zh' ? '• 支持批量上传多张图片' : '• Supports batch upload of multiple images'}
                </p>
                <p>
                  {language === 'zh' ? '• 点击上传按钮选择图片' : '• Click upload button to select images'}
                </p>
                <p>
                  {language === 'zh' ? '• 调整质量滑块控制压缩程度' : '• Adjust quality slider to control compression level'}
                </p>
                <p>
                  {language === 'zh' ? '• 设置最大宽高限制图片尺寸' : '• Set max width/height to limit image dimensions'}
                </p>
                <p>
                  {language === 'zh' ? '• WebP和AVIF格式压缩率更高' : '• WebP and AVIF formats have higher compression rates'}
                </p>
                <p>
                  {language === 'zh' ? '• 去除EXIF保护隐私信息' : '• Remove EXIF to protect privacy information'}
                </p>
                <p>
                  {language === 'zh' ? '• 点击下载全部批量保存图片' : '• Click download all to batch save images'}
                </p>
                <p>
                  {language === 'zh' ? '• 调整参数后可重新压缩图片' : '• Re-compress images after adjusting parameters'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
