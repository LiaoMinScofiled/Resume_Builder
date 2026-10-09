'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

export default function XiaohongshuPage() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');

  const generate = async (): Promise<string> => {
    if (!topic.trim()) {
      throw new Error('请填写文案主题');
    }
    const response = await fetch('/api/ai-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'xiaohongshu', topic, keywords }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="小红书文案生成"
      titleEn="Xiaohongshu Copywriter"
      descZh="输入主题，生成吸睛标题 + 种草正文 + 话题标签"
      descEn="Enter a topic to generate catchy title, body copy and hashtags"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">文案主题（必填）</h2>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：秋冬通勤穿搭 / 新手养猫攻略 / 平价好用的护肤"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">关键词/卖点（选填）</h2>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="例如：显瘦、百搭、性价比高"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </HrToolLayout>
  );
}
