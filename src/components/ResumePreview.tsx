import React from 'react';
import { ResumeData, ResumeStyle, Language } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  style: ResumeStyle;
  language: Language;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, style, language }) => {
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

  return (
    <div id="resume-preview" className={getStyleClass()}>
      {/* 个人信息 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
        <div className="text-gray-600 space-y-1">
          {resumeData.personalInfo.phone && <p>{language === 'zh' ? '电话：' : 'Phone：'} {resumeData.personalInfo.phone}</p>}
          {resumeData.personalInfo.email && <p>{language === 'zh' ? '邮箱：' : 'Email：'} {resumeData.personalInfo.email}</p>}
          {resumeData.personalInfo.address && <p>{language === 'zh' ? '地址：' : 'Address：'} {resumeData.personalInfo.address}</p>}
        </div>
        {resumeData.personalInfo.summary && (
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-line">{resumeData.personalInfo.summary}</p>
          </div>
        )}
      </div>

      {/* 教育背景 */}
      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            {language === 'zh' ? '教育背景' : 'Education'}
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{edu.school}</h3>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-gray-600">{edu.degree} · {edu.major}</p>
              {edu.description && (
                <p className="text-gray-700 mt-1 whitespace-pre-line">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 工作经历 */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            {language === 'zh' ? '工作经历' : 'Experience'}
          </h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-gray-700 mt-1 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 技能 */}
      {resumeData.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            {language === 'zh' ? '技能' : 'Skills'}
          </h2>
          <div className="space-y-3">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <p className="text-gray-700 whitespace-pre-line">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;