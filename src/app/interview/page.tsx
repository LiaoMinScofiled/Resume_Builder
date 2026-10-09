'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';
import ResumeFillBanner from '@/components/ResumeFillBanner';

export default function InterviewPage() {
  const [position, setPosition] = useState('');
  const [resume, setResume] = useState('');

  const generate = async (): Promise<string> => {
    if (!resume.trim()) {
      throw new Error('请粘贴候选人简历内容');
    }
    const response = await fetch('/api/hr-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'interview', position, resume }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="面试题生成器"
      titleEn="Interview Question Generator"
      descZh="按岗位与简历生成针对性面试问题，考察候选真实水平"
      descEn="Generate targeted interview questions based on position and resume"
      generate={generate}
      nextSteps={[
        { href: '/greeting', labelZh: '生成打招呼话术', labelEn: 'Generate greeting scripts' },
        { href: '/resume-roast', labelZh: '诊断一下这份简历', labelEn: 'Roast this resume' },
      ]}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">招聘岗位（选填）</h2>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="例如：高级前端工程师"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">候选人简历（必填）</h2>
        <ResumeFillBanner onFill={setResume} />
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="粘贴候选人的完整简历内容..."
          rows={14}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
