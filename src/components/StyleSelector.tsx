import React from 'react';
import { ResumeStyle } from '@/types/resume';

interface StyleSelectorProps {
  style: ResumeStyle;
  onStyleChange: (style: ResumeStyle) => void;
  language: 'zh' | 'en';
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ style, onStyleChange, language }) => {
  return (
    <div className="card">
      <h3 className="section-title">{language === 'zh' ? '简历样式' : 'Resume Style'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onStyleChange('style-1')}
          className={`card border-2 ${style === 'style-1' ? 'border-primary' : 'border-gray-200'}`}
        >
          <h4 className="font-medium mb-2">{language === 'zh' ? '现代简约' : 'Modern Minimalist'}</h4>
          <p className="text-sm text-gray-600">{language === 'zh' ? '极简设计' : 'Minimal Design'}</p>
        </button>
        <button
          onClick={() => onStyleChange('style-2')}
          className={`card border-2 ${style === 'style-2' ? 'border-primary' : 'border-gray-200'}`}
        >
          <h4 className="font-medium mb-2">{language === 'zh' ? '专业商务' : 'Professional'}</h4>
          <p className="text-sm text-gray-600">{language === 'zh' ? '传统格式' : 'Traditional Format'}</p>
        </button>
        <button
          onClick={() => onStyleChange('style-3')}
          className={`card border-2 ${style === 'style-3' ? 'border-primary' : 'border-gray-200'}`}
        >
          <h4 className="font-medium mb-2">{language === 'zh' ? '创意设计' : 'Creative'}</h4>
          <p className="text-sm text-gray-600">{language === 'zh' ? '彩色、图形化' : 'Colorful, Graphic'}</p>
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;