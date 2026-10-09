'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

type ReportType = 'weekly' | 'daily';

export default function ReportPage() {
  const [content, setContent] = useState('');
  const [reportType, setReportType] = useState<ReportType>('weekly');

  const generate = async (): Promise<string> => {
    if (!content.trim()) {
      throw new Error('请填写工作内容要点');
    }
    const response = await fetch('/api/ai-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'report', content, reportType }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="周报 / 日报生成器"
      titleEn="Weekly / Daily Report Generator"
      descZh="输入工作要点，生成结构化、专业的工作汇报"
      descEn="Enter work points to generate a structured professional report"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">汇报类型</h2>
        <div className="flex gap-3">
          {([
            { value: 'weekly', label: '周报' },
            { value: 'daily', label: '日报' },
          ] as { value: ReportType; label: string }[]).map((r) => (
            <button
              key={r.value}
              onClick={() => setReportType(r.value)}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                reportType === r.value ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">工作内容要点（必填）</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="例如：完成登录模块开发、修复3个线上bug、参与需求评审..."
          rows={14}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
