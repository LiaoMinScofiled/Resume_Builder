'use client';

import React, { useState } from 'react';
import HrToolLayout from '@/components/HrToolLayout';

type Direction = 'auto' | 'zh2en' | 'en2zh';

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState<Direction>('auto');

  const generate = async (): Promise<string> => {
    if (!text.trim()) {
      throw new Error('请输入需要翻译的内容');
    }
    const response = await fetch('/api/ai-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'translate', text, direction }),
    });
    const data = await response.json();
    if (data.success) {
      return data.content;
    }
    throw new Error(data.error || '生成失败');
  };

  return (
    <HrToolLayout
      titleZh="AI 翻译润色"
      titleEn="AI Translator & Polisher"
      descZh="中英互译并地道化润色，让表达更自然"
      descEn="Translate between Chinese and English with native-level polishing"
      generate={generate}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">翻译方向</h2>
        <div className="flex gap-3">
          {([
            { value: 'auto', label: '自动检测' },
            { value: 'zh2en', label: '中译英' },
            { value: 'en2zh', label: '英译中' },
          ] as { value: Direction; label: string }[]).map((d) => (
            <button
              key={d.value}
              onClick={() => setDirection(d.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                direction === d.value ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">原文（必填）</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="粘贴需要翻译的内容..."
          rows={14}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm"
        />
      </div>
    </HrToolLayout>
  );
}
