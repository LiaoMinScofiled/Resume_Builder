import React from 'react';
import { ResumeData, ResumeStyle, Language, Skill } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  style: ResumeStyle;
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
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, style, language, keywords, highlightKeywords, skillLayout = 'double', skillStyle = 'default', awardLayout = 'title-tile-bg', fontFamily = '微软雅黑', fontSize = 12, fontWeight = 400, onModuleClick }) => {
  const getStyleClass = () => {
    switch (style) {
      case 'style-1':
        return 'resume-style-1';
      case 'style-2':
        return 'resume-style-2';
      case 'style-3':
        return 'resume-style-3';
      default:
        return 'resume-style-1';
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
    <div id="resume-preview" className={getStyleClass() + " max-w-4xl mx-auto p-8 bg-white"} style={{ fontFamily: fontFamily, fontSize: fontSize + 'px', fontWeight: fontWeight }}>
      {/* 个人信息部分 */}
      {(resumeData.personalInfo.name || resumeData.personalInfo.phone || resumeData.personalInfo.email || resumeData.personalInfo.location || resumeData.personalInfo.age || resumeData.personalInfo.gender || resumeData.personalInfo.title || resumeData.personalInfo.status || resumeData.personalInfo.salary || resumeData.personalInfo.photo) && (
        <div 
          className="text-center mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
          onClick={() => onModuleClick && onModuleClick('basic')}
        >
          {/* 头像 */}
          {resumeData.personalInfo.photo && (
            <div className="absolute top-0 right-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resumeData.personalInfo.photo}
                alt={language === 'zh' ? '照片' : 'Photo'}
                className="w-32 h-40 object-cover rounded-lg shadow-lg border-2 border-gray-200"
              />
            </div>
          )}
          
          {/* 姓名 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {resumeData.personalInfo.name}
          </h1>
          
          {/* 联系方式 */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-600 mb-4">
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.email && (
              <span>{resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
            {resumeData.personalInfo.age && (
              <span>{resumeData.personalInfo.age}</span>
            )}
            {resumeData.personalInfo.gender && (
              <span>
                {resumeData.personalInfo.gender === 'male' ? (language === 'zh' ? '男' : 'Male') :
                 resumeData.personalInfo.gender === 'female' ? (language === 'zh' ? '女' : 'Female') :
                 (language === 'zh' ? '其他' : 'Other')}
              </span>
            )}
          </div>
          
          {/* 职业信息 */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-600">
            {resumeData.personalInfo.title && (
              <span>{resumeData.personalInfo.title}</span>
            )}
            {resumeData.personalInfo.status && (
              <span>{resumeData.personalInfo.status}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
            {resumeData.personalInfo.salary && (
              <span>{resumeData.personalInfo.salary}</span>
            )}
          </div>
        </div>
      )}

      {/* 教育经历 */}
      {resumeData.education.length > 0 && (
        <div 
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
          onClick={() => onModuleClick && onModuleClick('education')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '教育经历' : 'Education'}
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
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
                <span className="text-sm text-gray-600 font-medium">
                  {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.startDate || edu.endDate}
                </span>
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
          onClick={() => onModuleClick && onModuleClick('experience')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '工作经历' : 'Experience'}
          </h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.company}{exp.department ? ` - ${exp.department}` : ''}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exp.tags && exp.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || exp.endDate}
                </span>
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
          onClick={() => onModuleClick && onModuleClick('projects')}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
            {language === 'zh' ? '项目经历' : 'Projects'}
          </h2>
          {resumeData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{project.name}{project.role ? ` - ${project.role}` : ''}</h3>
                <span className="text-sm text-gray-600 font-medium">
                  {project.startDate && project.endDate ? `${project.startDate} - ${project.endDate}` : project.startDate || project.endDate}
                </span>
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
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
          className="mb-8 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
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