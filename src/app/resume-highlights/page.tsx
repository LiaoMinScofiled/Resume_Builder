'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';
import ResumeFillBanner from '@/components/ResumeFillBanner';

export default function ResumeHighlightsPage() {
  const [resume, setResume] = useState('');

  const generate = async (): Promise<string> => {
    if (!resume.trim()) {
      throw new Error('请粘贴候选人简历内容');
    }
    const response = await fetch('/api/hr-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'highlights', resume }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="简历亮点提炼"
      titleEn="Resume Highlights Extractor"
      descZh="粘贴简历，AI 自动提炼核心亮点、关键词与技能标签"
      descEn="Paste a resume, AI extracts core highlights, keywords and skill tags"
      generate={generate}
      nextSteps={[
        { href: '/resume-polish', labelZh: '按亮点润色简历', labelEn: 'Polish with highlights' },
        { href: '/greeting', labelZh: '生成打招呼话术', labelEn: 'Generate greeting scripts' },
      ]}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">候选人简历（必填）</h2>
        <ResumeFillBanner onFill={setResume} />
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="粘贴候选人的完整简历内容..."
          rows={16}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
