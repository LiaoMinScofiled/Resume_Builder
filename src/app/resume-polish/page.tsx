'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

export default function ResumePolishPage() {
  const [resume, setResume] = useState('');

  const generate = async (): Promise<string> => {
    if (!resume.trim()) {
      throw new Error('请粘贴候选人简历内容');
    }
    const response = await fetch('/api/hr-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'polish', resume }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="简历润色改写"
      titleEn="Resume Polish"
      descZh="AI 优化简历表达，去口语化，量化成果，提升专业度"
      descEn="AI polishes resume wording, quantifies achievements, and improves professionalism"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">原始简历（必填）</h2>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="粘贴需要润色的简历内容..."
          rows={18}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
