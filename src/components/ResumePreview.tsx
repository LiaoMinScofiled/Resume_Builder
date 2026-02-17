import React from 'react';
import { ResumeData, Language, Skill } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  language: Language;
  keywords?: string;
  highlightKeywords?: boolean;
  skillLayout?: 'single' | 'double' | 'triple';
  skillStyle?: string;
  awardLayout?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  onModuleClick?: (module: string) => void;
  moduleSpacing?: number;
  lineSpacing?: number;
  pageMargin?: number;
  infoPosition?: 'left' | 'center' | 'right';
  infoNameStyle?: 'text' | 'icon' | 'simple';
  dateStyle?: 'dot' | 'chinese' | 'english';
  datePosition?: 'left' | 'right';
  template?: 'template-1' | 'template-2' | 'template-3' | 'template-4' | 'template-5';
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, language, keywords, highlightKeywords, skillLayout = 'double', skillStyle = 'default', awardLayout = 'title-tile-bg', fontFamily = '微软雅黑', fontSize = 12, fontWeight = 400, onModuleClick, moduleSpacing = 18, lineSpacing = 21, pageMargin = 12, infoPosition = 'left', infoNameStyle = 'text', dateStyle = 'dot', datePosition = 'right', template = 'template-1' }) => {
  const getStyleClass = () => {
    // 根据模板返回不同的样式类名
    switch (template) {
      case 'template-1':
        return 'resume-template-1';
      case 'template-2':
        return 'resume-template-2';
      case 'template-3':
        return 'resume-template-3';
      case 'template-4':
        return 'resume-template-4';
      case 'template-5':
        return 'resume-template-5';
      default:
        return 'resume-template-1';
    }
  };

  // 关键词高亮函数
  const highlightText = (text: string) => {
    if (!highlightKeywords || !keywords) return text;
    
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    if (keywordArray.length === 0) return text;
    
    let result = text;
    keywordArray.forEach(keyword => {
      if (keyword) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        result = result.replace(regex, '<mark class="keyword-highlight">$1</mark>');
      }
    });
    return result;
  };
  
  // 渲染个人信息项函数
  const renderPersonalInfoItem = (label: string, value: string, icon?: string) => {
    if (!value) return null;
    
    switch (infoNameStyle) {
      case 'text':
        return (
          <span>
            {label}: {value}
          </span>
        );
      case 'icon':
        return (
          <span className="flex items-center gap-1">
            {icon && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            )}
            {value}
          </span>
        );
      case 'simple':
        return (
          <span>
            {value}
          </span>
        );
      default:
        return (
          <span>
            {label}: {value}
          </span>
        );
    }
  };
  
  // 格式化日期函数
  const formatDate = (date: string) => {
    if (!date) return '';
    
    // 假设日期格式为 YYYY-MM 或 YYYY
    const parts = date.split('-');
    
    if (parts.length === 2) {
      const year = parts[0];
      const month = parts[1];
      
      // 确保year和month都存在
      if (!year || !month) return date;
      
      switch (dateStyle) {
        case 'dot':
          return `${year}.${month}`;
        case 'chinese':
          return `${year}年${month}月`;
        case 'english':
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const monthIndex = parseInt(month) - 1;
          return `${monthNames[monthIndex]} ${year}`;
        default:
          return `${year}.${month}`;
      }
    } else if (parts.length === 1) {
      // 只包含年份的情况
      const year = parts[0];
      
      if (!year) return date;
      
      switch (dateStyle) {
        case 'dot':
          return `${year}`;
        case 'chinese':
          return `${year}年`;
        case 'english':
          return `${year}`;
        default:
          return `${year}`;
      }
    } else {
      // 其他格式
      return date;
    }
  };
  
  // 调试日志
  console.log('ResumePreview props:', {
    resumeData: resumeData.education,
    datePosition,
    dateStyle
  });
  
  // 渲染技能条函数
  const renderSkillBar = (skill: Skill) => {
    const level = skill.level || 80;
    const percentage = level;
    
    switch (skillStyle) {
      case 'dots':
        const totalDots = 10;
        const filledDots = Math.round(percentage / 10);
        return (
          <div className="flex gap-1">
            {[...Array(totalDots)].map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full ${index < filledDots ? 'bg-gray-700' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        );
      case 'bars':
        const totalBars = 10;
        const filledBars = Math.round(percentage / 10);
        return (
          <div className="flex gap-1">
            {[...Array(totalBars)].map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-6 ${index < filledBars ? 'bg-gray-700' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        );
      case 'rounded':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-700 h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        );
      case 'boxed':
        return (
          <div className="w-full bg-gray-200 border border-gray-300 h-4">
            <div 
              className="bg-gray-700 h-4" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        );
      case 'angled':
        return (
          <div className="w-full bg-gray-200 relative overflow-hidden h-4">
            <div 
              className="bg-gray-700 h-4" 
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-700 transform skew-x-12"></div>
            </div>
          </div>
        );
      case 'slider':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2 relative">
            <div 
              className="bg-gray-700 h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
            <div 
              className="absolute top-1/2 transform -translate-y-1/2" 
              style={{ left: `${percentage}%` }}
            >
              <div className="w-4 h-4 bg-gray-700 rounded-full border-2 border-white"></div>
            </div>
          </div>
        );
      case 'squares':
        const totalSquares = 10;
        const filledSquares = Math.round(percentage / 10);
        return (
          <div className="flex gap-1">
            {[...Array(totalSquares)].map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 ${index < filledSquares ? 'bg-gray-700' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        );
      default:
        return (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-700 h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        );
    }
  };

  return (
    <div id="resume-preview" className={getStyleClass() + " max-w-4xl mx-auto bg-white"} style={{ fontFamily: fontFamily, fontSize: fontSize + 'px', fontWeight: fontWeight, padding: pageMargin + 'px', lineHeight: (lineSpacing / fontSize).toFixed(2) }}>
      {/* 个人信息部分 */}
      {(resumeData.personalInfo.name || resumeData.personalInfo.phone || resumeData.personalInfo.email || resumeData.personalInfo.location || resumeData.personalInfo.age || resumeData.personalInfo.gender || resumeData.personalInfo.title || resumeData.personalInfo.status || resumeData.personalInfo.salary || resumeData.personalInfo.photo) && (
        <div 
          className={`cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2 mb-${moduleSpacing}`}
          onClick={() => onModuleClick && onModuleClick('basic')}
        >
          {/* 居中布局：头像在上，个人信息在下 */}
          {infoPosition === 'center' && (
            <div className="text-center">
              {/* 头像 */}
              {resumeData.personalInfo.photo && (
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resumeData.personalInfo.photo}
                    alt={language === 'zh' ? '照片' : 'Photo'}
                    className="w-24 h-32 object-cover rounded-lg shadow-md border border-gray-200 mx-auto"
                  />
                </div>
              )}
              
              {/* 个人信息内容 */}
              <div>
                {/* 姓名 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {resumeData.personalInfo.name}
                </h1>
                
                {/* 联系方式和职业信息 */}
                <div className="text-gray-600 space-y-2">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {renderPersonalInfoItem(
                      language === 'zh' ? '电话' : 'Phone',
                      resumeData.personalInfo.phone || '',
                      'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '邮箱' : 'Email',
                      resumeData.personalInfo.email || '',
                      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '城市' : 'City',
                      resumeData.personalInfo.location || '',
                      'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '年龄' : 'Age',
                      resumeData.personalInfo.age || '',
                      'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '性别' : 'Gender',
                      resumeData.personalInfo.gender ? (resumeData.personalInfo.gender === 'male' ? (language === 'zh' ? '男' : 'Male') :
                       resumeData.personalInfo.gender === 'female' ? (language === 'zh' ? '女' : 'Female') :
                       (language === 'zh' ? '其他' : 'Other')) : '',
                      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '职位' : 'Position',
                      resumeData.personalInfo.title || '',
                      'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    {renderPersonalInfoItem(
                      language === 'zh' ? '状态' : 'Status',
                      resumeData.personalInfo.status || '',
                      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '薪资' : 'Salary',
                      resumeData.personalInfo.salary || '',
                      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 居左或居右布局：头像和个人信息在同一行 */}
          {(infoPosition === 'left' || infoPosition === 'right') && (
            <div className={`flex items-center ${infoPosition === 'left' ? 'justify-start' : 'justify-end'}`}>
              {/* 头像 - 根据位置调整顺序 */}
              {resumeData.personalInfo.photo && infoPosition === 'left' && (
                <div className="mr-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resumeData.personalInfo.photo}
                    alt={language === 'zh' ? '照片' : 'Photo'}
                    className="w-24 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                  />
                </div>
              )}
              
              {/* 个人信息内容 */}
              <div className={`${infoPosition === 'left' ? 'text-left' : 'text-right'}`}>
                {/* 姓名 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {resumeData.personalInfo.name}
                </h1>
                
                {/* 联系方式和职业信息 */}
                <div className="text-gray-600 space-y-2">
                  <div className="flex flex-wrap gap-3">
                    {renderPersonalInfoItem(
                      language === 'zh' ? '电话' : 'Phone',
                      resumeData.personalInfo.phone || '',
                      'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '邮箱' : 'Email',
                      resumeData.personalInfo.email || '',
                      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '城市' : 'City',
                      resumeData.personalInfo.location || '',
                      'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '年龄' : 'Age',
                      resumeData.personalInfo.age || '',
                      'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '性别' : 'Gender',
                      resumeData.personalInfo.gender === 'male' ? (language === 'zh' ? '男' : 'Male') :
                       resumeData.personalInfo.gender === 'female' ? (language === 'zh' ? '女' : 'Female') :
                       (language === 'zh' ? '其他' : 'Other'),
                      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '职位' : 'Position',
                      resumeData.personalInfo.title || '',
                      'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {renderPersonalInfoItem(
                      language === 'zh' ? '状态' : 'Status',
                      resumeData.personalInfo.status || '',
                      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                    {renderPersonalInfoItem(
                      language === 'zh' ? '薪资' : 'Salary',
                      resumeData.personalInfo.salary || '',
                      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    )}
                  </div>
                </div>
              </div>
              
              {/* 头像 - 根据位置调整顺序 */}
              {resumeData.personalInfo.photo && infoPosition === 'right' && (
                <div className="ml-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resumeData.personalInfo.photo}
                    alt={language === 'zh' ? '照片' : 'Photo'}
                    className="w-24 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 教育经历 */}
      {resumeData.education.length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('education')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '教育经历' : 'Education'}
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className={`flex items-center justify-between mb-1 ${datePosition === 'left' ? 'flex-row-reverse' : ''}`}>
                {/* 学校名称 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{edu.school}{edu.degree ? ` - ${edu.degree}` : ''}</h3>
                  {edu.type && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {edu.type.map((type, index) => (
                        <span key={index} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* 日期显示 - 简化逻辑，确保日期能够正确显示 */}
                {(edu.startDate || edu.endDate) && (
                  <span className={`text-sm text-gray-600 font-medium ${datePosition === 'left' ? 'mr-4' : 'ml-4'} whitespace-nowrap flex-shrink-0`}>
                    {edu.startDate && edu.endDate ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}` : (edu.startDate ? formatDate(edu.startDate) : formatDate(edu.endDate))}
                  </span>
                )}
              </div>
              <p className="text-gray-700 font-medium">{edu.major}</p>
              {edu.description && (
                <ul className="mt-2 space-y-2">
                  {edu.description.split('\n').map((line, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: highlightText(line) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 工作经历 */}
      {resumeData.experience.length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('experience')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '工作经历' : 'Experience'}
          </h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className={`flex items-center justify-between mb-1 ${datePosition === 'left' ? 'flex-row-reverse' : ''}`}>
                {/* 公司名称 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{exp.company}{exp.department ? ` - ${exp.department}` : ''}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exp.tags && exp.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 日期显示 - 简化逻辑，确保日期能够正确显示 */}
                {(exp.startDate || exp.endDate) && (
                  <span className={`text-sm text-gray-600 font-medium ${datePosition === 'left' ? 'mr-4' : 'ml-4'} whitespace-nowrap flex-shrink-0`}>
                    {exp.startDate && exp.endDate ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}` : (exp.startDate ? formatDate(exp.startDate) : formatDate(exp.endDate))}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{exp.position}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exp.positionTags && exp.positionTags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {exp.location}
                </span>
              </div>
              {exp.description && (
                <ul className="mt-2 space-y-2">
                  {exp.description.split('\n').map((line, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: highlightText(line) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 项目经历 */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('projects')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '项目经历' : 'Projects'}
          </h2>
          {resumeData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className={`flex items-center justify-between mb-1 ${datePosition === 'left' ? 'flex-row-reverse' : ''}`}>
                {/* 项目名称 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{project.name}{project.role ? ` - ${project.role}` : ''}</h3>
                </div>
                {/* 日期显示 - 简化逻辑，确保日期能够正确显示 */}
                {(project.startDate || project.endDate) && (
                  <span className={`text-sm text-gray-600 font-medium ${datePosition === 'left' ? 'mr-4' : 'ml-4'} whitespace-nowrap flex-shrink-0`}>
                    {project.startDate && project.endDate ? `${formatDate(project.startDate)} - ${formatDate(project.endDate)}` : (project.startDate ? formatDate(project.startDate) : formatDate(project.endDate))}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{project.company}</p>
              {project.description && (
                <ul className="mt-2 space-y-2">
                  {project.description.split('\n').map((line, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: highlightText(line) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 个人总结 */}
      {resumeData.personalInfo.summary && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('basic')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '个人总结' : 'Summary'}
          </h2>
          <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightText(resumeData.personalInfo.summary) }} />
        </div>
      )}

      {/* 技能专长 */}
      {resumeData.skills.length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('skills')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '技能专长' : 'Skills'}
          </h2>
          <div className={`grid ${skillLayout === 'single' ? 'grid-cols-1' : skillLayout === 'double' ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">{skill.name}</span>
                </div>
                {renderSkillBar(skill)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 荣誉奖项 */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('awards')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '荣誉奖项' : 'Awards'}
          </h2>
          {/* 根据awardLayout渲染不同布局的荣誉奖项 */}
          {(awardLayout === 'title-tile-bg' || awardLayout === 'title-tile-border') && (
            <div className="flex flex-wrap gap-3">
              {resumeData.awards.map((award, index) => (
                <span 
                  key={index} 
                  className={`inline-block px-4 py-2 rounded-md flex items-center ${awardLayout === 'title-tile-bg' ? 'bg-gray-700 text-white' : 'border border-gray-700 text-gray-700'}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {award}
                </span>
              ))}
            </div>
          )}
          {awardLayout === 'column-list-single' && (
            <div className="space-y-2">
              {resumeData.awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{award}</span>
                </div>
              ))}
            </div>
          )}
          {awardLayout === 'column-list-double' && (
            <div className="grid grid-cols-2 gap-2">
              {resumeData.awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{award}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 其他信息 */}
      {resumeData.otherInfo && Object.keys(resumeData.otherInfo).length > 0 && (
        <div 
          className={`mb-${moduleSpacing} cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2`}
          onClick={() => onModuleClick && onModuleClick('other')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '其他信息' : 'Other Information'}
          </h2>
          {Object.entries(resumeData.otherInfo).map(([key, value]) => (
            <div key={key} className="mb-3">
              <h3 className="font-semibold text-gray-800 mb-2">{key}</h3>
              {typeof value === 'string' ? (
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: highlightText(value) }} />
              ) : (
                <ul className="space-y-2">
                  {value.map((item, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: highlightText(item) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;