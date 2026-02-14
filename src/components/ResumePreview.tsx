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
      <div className="flex gap-8">
        {/* 左侧边栏 */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
              {language === 'zh' ? '联系方式' : 'Contact'}
            </h3>
            {resumeData.personalInfo.phone && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.email && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 break-all">{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.gender && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-600">
                  {resumeData.personalInfo.gender === 'male' ? (language === 'zh' ? '男' : 'Male') :
                   resumeData.personalInfo.gender === 'female' ? (language === 'zh' ? '女' : 'Female') :
                   (language === 'zh' ? '其他' : 'Other')}
                </span>
              </div>
            )}
            {resumeData.personalInfo.birthDate && (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{resumeData.personalInfo.birthDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 右侧主内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-8 pb-4 border-b-3 border-gray-300">
            <h1 className="text-4xl font-bold text-gray-900">
              {resumeData.personalInfo.name}
            </h1>
            {resumeData.personalInfo.photo && (
              <img
                src={resumeData.personalInfo.photo}
                alt={language === 'zh' ? '照片' : 'Photo'}
                className="w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-gray-200 flex-shrink-0"
              />
            )}
          </div>

          {/* 教育背景 */}
          {resumeData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
                {language === 'zh' ? '教育背景' : 'Education'}
              </h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <span className="text-sm text-gray-600 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{edu.degree} · {edu.major}</p>
                  {edu.description && (
                    <p className="text-gray-600 mt-2 whitespace-pre-line leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 工作经历 */}
          {resumeData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
                {language === 'zh' ? '工作经历' : 'Experience'}
              </h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 mt-2 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 技能 */}
          {resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
                {language === 'zh' ? '技能' : 'Skills'}
              </h2>
              <div className="space-y-3">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;