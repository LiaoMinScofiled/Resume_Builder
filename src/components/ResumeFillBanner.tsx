'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { loadResume, RESUME_SOURCE_LABELS, StoredResume } from '@/lib/resumeStore';

interface ResumeFillBannerProps {
  onFill: (text: string) => void;
}

// 检测本地保存过的简历，提供「一键填入」，打通工具间的简历闭环
export default function ResumeFillBanner({ onFill }: ResumeFillBannerProps) {
  const { language } = useApp();
  const [stored, setStored] = useState<StoredResume | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setStored(loadResume());
  }, []);

  if (!stored || dismissed) return null;

  const sourceLabel =
    RESUME_SOURCE_LABELS[stored.source]?.[language === 'zh' ? 'zh' : 'en'] ??
    (language === 'zh' ? '上次使用' : 'Last used');
  const minutes = Math.floor((Date.now() - stored.savedAt) / 60000);
  const timeText =
    minutes < 1
      ? language === 'zh' ? '刚刚' : 'just now'
      : minutes < 60
        ? language === 'zh' ? `${minutes} 分钟前` : `${minutes} min ago`
        : language === 'zh' ? `${Math.floor(minutes / 60)} 小时前` : `${Math.floor(minutes / 60)} h ago`;

  return (
    <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-700">
        {language === 'zh' ? (
          <>
            检测到您保存过的简历（来自：<span className="font-semibold text-primary">{sourceLabel}</span>，{timeText}）
          </>
        ) : (
          <>
            Found your saved resume (from: <span className="font-semibold text-primary">{sourceLabel}</span>, {timeText})
          </>
        )}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onFill(stored.text);
            setDismissed(true);
          }}
          className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {language === 'zh' ? '一键填入' : 'Fill in'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          {language === 'zh' ? '不用了' : 'Dismiss'}
        </button>
      </div>
    </div>
  );
}
