'use client';

import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 ${className}`}>
      {/* 标题栏 */}
      <button
        onClick={toggleExpand}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {isExpanded ? '收起' : '展开'}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* 内容区域 */}
      {isExpanded && (
        <div className="p-4 pt-0 animate-fadeIn">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;