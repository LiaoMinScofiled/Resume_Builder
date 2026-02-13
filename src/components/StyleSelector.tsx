import React from 'react';
import { ResumeStyle } from '@/types/resume';

interface StyleSelectorProps {
  style: ResumeStyle;
  onStyleChange: (style: ResumeStyle) => void;
  language: 'zh' | 'en';
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ style, onStyleChange, language }) => {
  const styles = [
    {
      id: 'style-1' as ResumeStyle,
      title: language === 'zh' ? '现代简约' : 'Modern Minimalist',
      description: language === 'zh' ? '极简设计，突出重点' : 'Minimal design, highlight key points',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      gradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200'
    },
    {
      id: 'style-2' as ResumeStyle,
      title: language === 'zh' ? '专业商务' : 'Professional',
      description: language === 'zh' ? '传统格式，稳重专业' : 'Traditional format, professional',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'style-3' as ResumeStyle,
      title: language === 'zh' ? '创意设计' : 'Creative',
      description: language === 'zh' ? '彩色图形，个性鲜明' : 'Colorful, graphic, unique',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      gradient: 'from-purple-50 to-pink-100',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        {language === 'zh' ? '简历样式' : 'Resume Style'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {styles.map((styleOption) => (
          <button
            key={styleOption.id}
            onClick={() => onStyleChange(styleOption.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              ${style === styleOption.id 
                ? 'border-primary bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md' 
                : `border-gray-200 bg-gradient-to-br ${styleOption.gradient} hover:border-gray-300 hover:shadow-sm`
              }
            `}
          >
            {style === styleOption.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className={`mb-3 ${style === styleOption.id ? 'text-primary' : 'text-gray-600'}`}>
              {styleOption.icon}
            </div>
            <h4 className="font-bold mb-1 text-gray-800">{styleOption.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{styleOption.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;