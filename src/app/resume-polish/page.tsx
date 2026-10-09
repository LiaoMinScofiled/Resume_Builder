'use client';

import React, { useEffect, useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';
import ResumeFillBanner from '@/components/ResumeFillBanner';
import { useApp } from '@/contexts/AppContext';
import { loadResume, saveResume } from '@/lib/resumeStore';

export default function ResumePolishPage() {
  const { language } = useApp();
  const [resume, setResume] = useState('');
  const [roastMeta, setRoastMeta] = useState<string | null>(null);
  const [useFocus, setUseFocus] = useState(true);

  // 若之前做过毒舌诊断，提供「结合诊断重点优化」选项
  useEffect(() => {
    const stored = loadResume();
    if (stored?.meta) {
      setRoastMeta(stored.meta);
    }
  }, []);

  const generate = async (): Promise<string> => {
    if (!resume.trim()) {
      throw new Error(language === 'zh' ? '请粘贴候选人简历内容' : 'Please paste the resume first');
    }
    const response = await fetch('/api/hr-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'polish',
        resume,
        focus: useFocus && roastMeta ? roastMeta : '',
      }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || (language === 'zh' ? '生成失败' : 'Generation failed'));
  };

  // 生成成功后提取润色后的简历正文存入本地，供「再诊断」「面试题」等工具接力
  const handleSuccess = (content: string) => {
    const startIdx = content.indexOf('润色后的简历');
    const endIdx = content.indexOf('主要修改点');
    if (startIdx !== -1) {
      const seg = content
        .slice(startIdx + '润色后的简历'.length, endIdx !== -1 ? endIdx : undefined)
        .replace(/^[\s:#：]*/, '')
        .trim();
      if (seg) {
        saveResume(seg, 'polish');
        return;
      }
    }
    saveResume(content, 'polish');
  };

  return (
    <HrToolLayout
      titleZh="简历润色改写"
      titleEn="Resume Polish"
      descZh="AI 优化简历表达，去口语化，量化成果，提升专业度"
      descEn="AI polishes resume wording, quantifies achievements, and improves professionalism"
      generate={generate}
      onSuccess={handleSuccess}
      nextSteps={[
        { href: '/resume-roast', labelZh: '再诊断一次，看提了多少分', labelEn: 'Re-roast to see the score jump' },
        { href: '/interview', labelZh: '生成面试题练练手', labelEn: 'Generate interview questions' },
      ]}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'zh' ? '原始简历（必填）' : 'Original Resume (required)'}
        </h2>
        <ResumeFillBanner onFill={setResume} />
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder={language === 'zh' ? '粘贴需要润色的简历内容...' : 'Paste the resume to polish...'}
          rows={16}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
        />
        {roastMeta && (
          <label className="mt-3 flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={useFocus}
              onChange={(e) => setUseFocus(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            {language === 'zh'
              ? '结合毒舌诊断指出的问题进行针对性优化（推荐）'
              : 'Target the issues found in the roast diagnosis (recommended)'}
          </label>
        )}
      </div>
    </HrToolLayout>
  );
}
