import React from 'react';
import { Language } from '@/types/resume';

interface SaveButtonProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  onClick: () => void;
  language: Language;
}

export default function SaveButton({ status, onClick, language }: SaveButtonProps) {
  const getButtonContent = () => {
    switch (status) {
      case 'idle':
        return language === 'zh' ? '点击保存' : 'Click to Save';
      case 'saving':
        return language === 'zh' ? '保存中...' : 'Saving...';
      case 'saved':
        return language === 'zh' ? '已保存' : 'Saved';
      case 'error':
        return language === 'zh' ? '保存失败' : 'Save Failed';
      default:
        return language === 'zh' ? '点击保存' : 'Click to Save';
    }
  };

  const getButtonClass = () => {
    const baseClass = 'btn transition-all duration-300 flex items-center space-x-2';
    
    switch (status) {
      case 'idle':
        return `${baseClass} btn-primary`;
      case 'saving':
        return `${baseClass} btn-primary opacity-75 cursor-not-allowed`;
      case 'saved':
        return `${baseClass} bg-green-500 hover:bg-green-600 text-white`;
      case 'error':
        return `${baseClass} bg-red-500 hover:bg-red-600 text-white`;
      default:
        return `${baseClass} btn-primary`;
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'idle':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        );
      case 'saving':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'saved':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={status === 'saving'}
      className={getButtonClass()}
    >
      {getIcon()}
      <span>{getButtonContent()}</span>
    </button>
  );
}
