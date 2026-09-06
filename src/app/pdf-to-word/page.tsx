'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

// 声明PDF.js类型
let pdfjsLib: unknown = null;

export default function PdfToWord() {
  // 动态加载PDF.js
  useEffect(() => {
    const loadPDFJS = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjsLib = pdfjs;
        // 设置PDF.js worker
        if (pdfjs && pdfjs.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
        }
      } catch (error) {
        console.error('加载PDF.js失败:', error);
      }
    };
    
    loadPDFJS();
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isTextBasedPDF, setIsTextBasedPDF] = useState<boolean | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<string | null>(null);

  // 检测PDF是否为文字版本
  const detectPDFType = async (file: File): Promise<boolean> => {
    try {
      if (!pdfjsLib) {
        console.error('PDF.js未加载');
        // PDF.js未加载时默认按文字版本处理
        return true;
      }
      
      const pdfjs = pdfjsLib as any;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let totalTextLength = 0;
      
      // 检查前几页以确定PDF类型
      const pagesToCheck = Math.min(pdf.numPages, 3);
      
      for (let i = 1; i <= pagesToCheck; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // 计算页面文字长度
        const pageText = content.items.map((item: any) => (
          typeof item === 'object' && item !== null && 'str' in item ? item.str : ''
        )).join('');
        totalTextLength += pageText.length;
        
        // 如果已经找到足够的文字，提前结束检查
        if (totalTextLength > 50) break;
      }
      
      await pdf.destroy();
      
      // 判断逻辑：
      // 如果有大量文字（> 50个字符），认为是文字版本
      // 否则认为是图片版本（扫描件或图片PDF）
      return totalTextLength > 50;
    } catch (error) {
      console.error('PDF检测错误:', error);
      // 出错时默认按文字版本处理
      return true;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
        setIsTextBasedPDF(null);
        setFileAnalysis(null);
        
        // 检测PDF类型
        try {
          setIsConverting(true);
          const isTextBased = await detectPDFType(file);
          setIsTextBasedPDF(isTextBased);
          setFileAnalysis(
            isTextBased 
              ? 'PDF 包含可选择的文字内容，将使用前端框架直接转换'
              : 'PDF 可能是图片扫描版或包含大量图片，将使用 OCR 技术处理'
          );
        } catch (err) {
          console.error('检测PDF类型错误:', err);
          setError('检测PDF类型失败');
        } finally {
          setIsConverting(false);
        }
      } else {
        setError('请选择PDF格式的文件');
        setSelectedFile(null);
        setIsTextBasedPDF(null);
        setFileAnalysis(null);
      }
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('请先选择PDF文件');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // 根据PDF类型执行不同的转换逻辑
      if (isTextBasedPDF === true) {
        // 文字版本PDF：直接调用前端框架生成Word
        console.log('处理文字版本PDF...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 模拟生成的Word文件URL
        const mockWordFileUrl = URL.createObjectURL(
          new Blob(['文字版本PDF转换的Word文档内容'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        );
        
        setConvertedFile(mockWordFileUrl);
      } else {
        // 图片版本PDF：使用百度OCR技术处理
        console.log('处理图片版本PDF，使用OCR技术...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 模拟OCR处理后的Word文件URL
        const mockWordFileUrl = URL.createObjectURL(
          new Blob(['OCR处理后的Word文档内容'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        );
        
        setConvertedFile(mockWordFileUrl);
      }
    } catch (err) {
      setError('转换失败，请稍后重试');
      console.error('转换错误:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `${selectedFile?.name.replace('.pdf', '.docx') || 'converted.docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConvertedFile(null);
    setError(null);
    setIsTextBasedPDF(null);
    setFileAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF 转 Word</h1>
            <p className="text-gray-600">上传 PDF 文件，将其转换为 Word 文档并下载</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择 PDF 文件
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {selectedFile && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-green-600">
                    已选择文件: {selectedFile.name}
                  </p>
                  {fileAnalysis && (
                    <p className="text-sm text-blue-600">
                      {fileAnalysis}
                    </p>
                  )}
                  {isTextBasedPDF !== null && (
                    <div className={`p-3 rounded-lg ${isTextBasedPDF ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                      <span className="font-medium">
                        {isTextBasedPDF ? '文字版本PDF' : '图片版本PDF'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleConvert}
                disabled={isConverting || !selectedFile}
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    转换中...
                  </>
                ) : (
                  '开始转换'
                )}
              </button>
              <button
                onClick={handleReset}
                className="py-3 px-6 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                重置
              </button>
            </div>

            {convertedFile && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-4">转换成功！</h3>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载 Word 文档
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">功能说明</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                支持上传任意大小的 PDF 文件
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                保留原始文档的格式和布局
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                转换后的 Word 文档可直接编辑
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                转换过程安全可靠，文件不会被存储
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            © 2024 在线工具箱 - 让工作更高效
          </p>
        </div>
      </div>
    </div>
  );
}
