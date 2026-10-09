'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

export default function MeetingSummaryPage() {
  const [content, setContent] = useState('');

  const generate = async (): Promise<string> => {
    if (!content.trim()) {
      throw new Error('请粘贴会议记录内容');
    }
    const response = await fetch('/api/ai-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'meeting', content }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="会议纪要总结"
      titleEn="Meeting Summary"
      descZh="粘贴会议记录，生成结构化纪要、结论与待办事项"
      descEn="Paste meeting notes to generate a structured summary, conclusions and action items"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">会议记录（必填）</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="粘贴会议的原始记录、讨论内容、语音转文字稿..."
          rows={18}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
