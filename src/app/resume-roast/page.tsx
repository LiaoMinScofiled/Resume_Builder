'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResumeFillBanner from '@/components/ResumeFillBanner';
import { useApp } from '@/contexts/AppContext';
import { saveResume } from '@/lib/resumeStore';

interface RoastDimension {
  name: string;
  score: number;
  comment: string;
}

interface RoastResult {
  score: number;
  grade: string;
  verdict: string;
  dimensions: RoastDimension[];
  roasts: string[];
  suggestions: string[];
  missingKeywords: string[];
}

const GRADE_COLORS: Record<string, string> = {
  S: '#a855f7',
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#ef4444',
};

const GRADE_LABELS: Record<string, { zh: string; en: string }> = {
  S: { zh: '天花板级', en: 'Top Tier' },
  A: { zh: '优秀', en: 'Great' },
  B: { zh: '还能看', en: 'Decent' },
  C: { zh: '有点危险', en: 'Risky' },
  D: { zh: '建议重写', en: 'Rewrite It' },
};

// 从 AI 返回的文本中解析诊断 JSON（容错：剥离 markdown 代码块、截取大括号）
function parseRoast(raw: string): RoastResult | null {
  try {
    let text = raw.trim();
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) text = fence[1];
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    const data = JSON.parse(text.slice(start, end + 1));
    if (typeof data.score !== 'number' || !Array.isArray(data.dimensions)) return null;
    return data as RoastResult;
  } catch {
    return null;
  }
}

function buildShareText(r: RoastResult): string {
  const lines: string[] = [
    `【简历毒舌诊断】总分 ${r.score} / 100 · ${r.grade} 级`,
    `一句话点评：${r.verdict}`,
    '',
    '五维评分：',
    ...r.dimensions.map((d) => `- ${d.name} ${d.score} 分：${d.comment}`),
    '',
    '毒舌吐槽：',
    ...r.roasts.map((t, i) => `${i + 1}. ${t}`),
    '',
    '修改建议：',
    ...r.suggestions.map((s, i) => `${i + 1}. ${s}`),
  ];
  if (r.missingKeywords.length > 0) {
    lines.push('', `缺失关键词：${r.missingKeywords.join('、')}`);
  }
  lines.push('', '—— 来自在线工具箱「简历毒舌诊断」');
  return lines.join('\n');
}

const R = 54;
const CIRC = 2 * Math.PI * R;

export default function ResumeRoastPage() {
  const { language, setLanguage } = useApp();
  const [position, setPosition] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState<RoastResult | null>(null);
  const [rawResult, setRawResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!resume.trim()) {
      setError(language === 'zh' ? '请先粘贴简历内容' : 'Please paste your resume first');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResult('');
    setCopied(false);

    try {
      const response = await fetch('/api/hr-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'roast', position, resume, lang: language }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || (language === 'zh' ? '诊断失败' : 'Diagnosis failed'));
      }
      const parsed = parseRoast(data.content);
      if (parsed) {
        setResult(parsed);
        // 保存简历与诊断重点，供「润色」等下游工具针对性使用，形成闭环
        const meta = [
          ...parsed.suggestions,
          ...parsed.missingKeywords.map((k) => `补充关键词「${k}」`),
        ].join('；');
        saveResume(resume, 'roast', meta);
      } else {
        setRawResult(data.content);
        saveResume(resume, 'roast');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === 'zh' ? '网络错误，请稍后重试' : 'Network error, please try again later'));
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    try {
      const text = result ? buildShareText(result) : rawResult;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(language === 'zh' ? '复制失败，请手动复制' : 'Copy failed, please copy manually');
    }
  };

  const grade = result?.grade ?? '';
  const gradeColor = GRADE_COLORS[grade] ?? '#3b82f6';
  const gradeLabel = GRADE_LABELS[grade]?.[language === 'zh' ? 'zh' : 'en'] ?? grade;

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
            {language === 'zh' ? '🔥 简历毒舌诊断' : '🔥 Resume Roast'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'zh'
              ? '毒舌 HR 在线打分：总分成绩单 + 五维评分 + 犀利吐槽 + 修改建议，扎心但有用'
              : 'A sharp-tongued HR scores your resume: report card, 5-dimension breakdown, roast and actionable fixes'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh' ? '1. 目标岗位（选填）' : '1. Target Position (optional)'}
              </h2>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={language === 'zh' ? '例如：高级前端工程师' : 'e.g. Senior Frontend Engineer'}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'zh' ? '2. 粘贴你的简历' : '2. Paste Your Resume'}
              </h2>
              <ResumeFillBanner onFill={setResume} />
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder={
                  language === 'zh'
                    ? '粘贴你的完整简历内容，AI 毒舌 HR 将犀利开麦...'
                    : 'Paste your full resume, the roast HR will tell you the truth...'
                }
                rows={14}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <button
                onClick={generate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'zh' ? '毒舌 HR 正在开麦...' : 'The roast HR is reading...')
                  : (language === 'zh' ? '开始毒舌诊断' : 'Roast My Resume')}
              </button>
              {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            </div>
          </div>

          {/* 右侧：成绩单 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'zh' ? '诊断成绩单' : 'Report Card'}
              </h2>
              {(result || rawResult) && (
                <div className="flex gap-2">
                  <button
                    onClick={copyResult}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copied ? (language === 'zh' ? '已复制 ✓' : 'Copied ✓') : (language === 'zh' ? '复制' : 'Copy')}
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setRawResult('');
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {language === 'zh' ? '再测一次' : 'Re-test'}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">
                  {language === 'zh' ? '毒舌 HR 正在逐行挑刺，请稍候...' : 'The roast HR is nitpicking line by line...'}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* 总分 + 等级 + 一句话总评 */}
                <div className="flex items-center gap-6 p-5 bg-gradient-to-br from-gray-50 to-red-50/50 rounded-2xl">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r={R} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="64"
                        cy="64"
                        r={R}
                        fill="none"
                        stroke={gradeColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.score / 100) * CIRC} ${CIRC}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{result.score}</span>
                      <span className="text-xs text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-2"
                      style={{ backgroundColor: gradeColor }}
                    >
                      {grade} 级 · {gradeLabel}
                    </span>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      “{result.verdict}”
                    </p>
                  </div>
                </div>

                {/* 五维评分 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    {language === 'zh' ? '五维评分' : '5-Dimension Scores'}
                  </h3>
                  <div className="space-y-3">
                    {result.dimensions.map((d, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-sm font-medium text-gray-700">{d.name}</span>
                          <span className="text-sm font-bold" style={{ color: GRADE_COLORS[d.score >= 80 ? 'A' : d.score >= 60 ? 'C' : 'D'] }}>
                            {d.score}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(0, Math.min(100, d.score))}%`, backgroundColor: GRADE_COLORS[d.score >= 80 ? 'A' : d.score >= 60 ? 'C' : 'D'] }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{d.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 毒舌吐槽 */}
                {result.roasts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      🔥 {language === 'zh' ? '毒舌吐槽' : 'The Roast'}
                    </h3>
                    <ul className="space-y-2">
                      {result.roasts.map((t, i) => (
                        <li key={i} className="text-sm text-gray-700 bg-red-50/70 border-l-4 border-red-400 rounded-r-lg px-3 py-2">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 修改建议 */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      ✅ {language === 'zh' ? '修改建议' : 'How to Fix'}
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 bg-green-50/70 border-l-4 border-green-400 rounded-r-lg px-3 py-2">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 缺失关键词 */}
                {result.missingKeywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      {language === 'zh' ? '缺失关键词' : 'Missing Keywords'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 分享提示 */}
                <p className="text-xs text-gray-400 text-center">
                  {language === 'zh'
                    ? '📸 截图这张成绩单分享给朋友，看看谁的简历更耐毒'
                    : '📸 Screenshot this report card and challenge your friends'}
                  <br />
                  {language === 'zh' ? '简历内容仅保存在你的浏览器本地，不会上传' : 'Your resume stays in your browser only'}
                </p>

                {/* 链路 CTA：闭环下一步 */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">
                    {language === 'zh' ? '下一步，把这份简历变强' : 'Next: make this resume stronger'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/resume-polish" className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      → {language === 'zh' ? '按诊断问题一键润色' : 'Polish with these fixes'}
                    </Link>
                    <Link href="/interview" className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      → {language === 'zh' ? '生成面试题练练手' : 'Generate interview questions'}
                    </Link>
                    <Link href="/resume-highlights" className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      → {language === 'zh' ? '提炼简历亮点' : 'Extract highlights'}
                    </Link>
                    <Link href="/greeting" className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      → {language === 'zh' ? '生成打招呼话术' : 'Greeting scripts'}
                    </Link>
                  </div>
                </div>
              </div>
            ) : rawResult ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[15px] bg-gray-50 rounded-xl p-5">
                {rawResult}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-center text-sm">
                  {language === 'zh'
                    ? '左侧粘贴简历，点击「开始毒舌诊断」\n领取你的简历成绩单'
                    : 'Paste your resume and click "Roast My Resume"\nto get your report card'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
