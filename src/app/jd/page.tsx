'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

export default function JdPage() {
  const [position, setPosition] = useState('');
  const [keywords, setKeywords] = useState('');
  const [company, setCompany] = useState('');

  const generate = async (): Promise<string> => {
    if (!position.trim()) {
      throw new Error('请填写岗位名称');
    }
    const response = await fetch('/api/hr-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'jd', position, keywords, company }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="JD 职位描述生成器"
      titleEn="JD Generator"
      descZh="输入岗位名称与关键词，AI 生成完整专业的职位描述"
      descEn="Enter position and keywords, AI generates a complete professional job description"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">岗位名称（必填）</h2>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="例如：高级后端工程师 / 产品经理 / 数据分析师"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">核心关键词（选填）</h2>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="例如：Go、微服务、高并发、团队管理"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">公司/行业（选填）</h2>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="例如：互联网 / 电商 / 金融科技"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </HrToolLayout>
  );
}
