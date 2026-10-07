'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/contexts/AppContext';

type Platform = 'boss' | 'linkedin' | 'maimai';

const PLATFORMS: { value: Platform; label: string; color: string; desc: string }[] = [
  { value: 'boss', label: 'Boss 直聘', color: '#00c1de', desc: '聊天式、口语化、简洁直接' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0a66c2', desc: '专业正式、结构清晰、行业术语' },
  { value: 'maimai', label: '脉脉', color: '#ff6a00', desc: '行业社交、人脉连接、共同话题' },
];

export default function GreetingPage() {
  const { language, setLanguage } = useApp();
  const [platform, setPlatform] = useState<Platform>('boss');
  const [position, setPosition] = useState('');
  const [resume, setResume] = useState('');
  const [outputLanguage, setOutputLanguage] = useState<'zh' | 'en'>('zh');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!resume.trim()) {
      setError(language === 'zh' ? '请先粘贴候选人简历内容' : 'Please paste the candidate resume first');
      return;
    }
    setLoading(true);
    setError(null);
    setResult('');
    setCopied(false);

    try {
      const response = await fetch('/api/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, position, resume, outputLanguage }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.content);
      } else {
        setError(data.error || (language === 'zh' ? '生成失败' : 'Generation failed'));
      }
    } catch {
      setError(language === 'zh' ? '网络错误，请稍后重试' : 'Network error, please try again later');
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
            {language === 'zh' ? 'HR 打招呼话术生成器' : 'HR Greeting Script Generator'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'zh'
              ? '根据候选人简历，为不同招聘平台生成个性化、高回复率的打招呼话术'
              : 'Generate personalized, high-response greeting scripts for different recruiting platforms based on candidate resumes'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            {/* 平台选择 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh' ? '1. 选择招聘平台' : '1. Select Platform'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      platform === p.value ? 'shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={platform === p.value ? { borderColor: p.color, backgroundColor: `${p.color}0d` } : {}}
                  >
                    <div className="font-semibold" style={{ color: p.color }}>{p.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 岗位 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh' ? '2. 招聘岗位（选填）' : '2. Position (optional)'}
              </h2>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={language === 'zh' ? '例如：高级前端工程师' : 'e.g. Senior Frontend Engineer'}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 简历 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh' ? '3. 粘贴候选人简历' : '3. Paste Candidate Resume'}
              </h2>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder={language === 'zh'
                  ? '粘贴候选人的简历内容，AI 将从中提取亮点生成个性化话术...'
                  : 'Paste the candidate resume, AI will extract highlights to generate personalized scripts...'}
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
              />
            </div>

            {/* 输出语言 + 生成按钮 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'zh' ? '4. 输出语言' : '4. Output Language'}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setOutputLanguage('zh')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    outputLanguage === 'zh' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setOutputLanguage('en')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    outputLanguage === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
                  }`}
                >
                  English
                </button>
              </div>

              <button
                onClick={generate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'zh' ? '正在生成话术...' : 'Generating...')
                  : (language === 'zh' ? '生成打招呼话术' : 'Generate Greeting Scripts')}
              </button>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
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
                  {language === 'zh' ? 'AI 正在分析简历并生成话术...' : 'AI is analyzing the resume...'}
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
                    ? '填写左侧信息后点击「生成打招呼话术」\n即可获得 3 个个性化版本'
                    : 'Fill in the info and click "Generate"\nto get 3 personalized versions'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
