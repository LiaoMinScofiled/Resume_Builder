'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

export interface ToolNextStep {
  href: string;
  labelZh: string;
  labelEn: string;
}

interface HrToolLayoutProps {
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  generate: () => Promise<string>;
  children: React.ReactNode;
  // 生成成功后的回调（如：保存简历到本地，供其他工具接力）
  onSuccess?: (content: string) => void;
  // 结果底部的「下一步」链路按钮，串联工具闭环
  nextSteps?: ToolNextStep[];
}

export default function HrToolLayout({ titleZh, titleEn, descZh, descEn, generate, children, onSuccess, nextSteps }: HrToolLayoutProps) {
  const { language, setLanguage } = useApp();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult('');
    setCopied(false);
    try {
      const content = await generate();
      setResult(content);
      onSuccess?.(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === 'zh' ? '生成失败' : 'Generation failed'));
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(language === 'zh' ? '复制失败，请手动复制' : 'Copy failed, please copy manually');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'zh' ? '返回首页' : 'Back'}
            </Link>
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {language === 'zh' ? titleZh : titleEn}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'zh' ? descZh : descEn}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            {children}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'zh' ? 'AI 正在生成...' : 'Generating...')
                  : (language === 'zh' ? '生成' : 'Generate')}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
              )}
            </div>
          </div>

          {/* 右侧：输出区 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'zh' ? '生成结果' : 'Result'}
              </h2>
              {result && (
                <button
                  onClick={copyResult}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copied
                    ? (language === 'zh' ? '已复制 ✓' : 'Copied ✓')
                    : (language === 'zh' ? '复制' : 'Copy')}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">
                  {language === 'zh' ? 'AI 正在处理，请稍候...' : 'AI is processing...'}
                </p>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[15px] bg-gray-50 rounded-xl p-5">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-center text-sm">
                  {language === 'zh'
                    ? '填写左侧信息后点击「生成」\n即可获得结果'
                    : 'Fill in the info and click "Generate"'}
                </p>
              </div>
            )}

            {result && nextSteps && nextSteps.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">
                  {language === 'zh' ? '下一步，把这份简历变强' : 'Next steps'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {nextSteps.map((step) => (
                    <Link
                      key={step.href}
                      href={step.href}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      → {language === 'zh' ? step.labelZh : step.labelEn}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
