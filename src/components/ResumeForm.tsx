'use client';

import React from 'react';
import { ResumeData, Education, Experience, Skill } from '@/types/resume';
import CollapsibleSection from './CollapsibleSection';

interface ResumeFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
  language: 'zh' | 'en';
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, onResumeDataChange, language }) => {
  const handlePersonalInfoChange = (field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onResumeDataChange({
      ...resumeData,
      education: [...resumeData.education, newEducation],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id),
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onResumeDataChange({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      description: '',
    };
    onResumeDataChange({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const updateSkill = (id: string, description: string) => {
    onResumeDataChange({
      ...resumeData,
      skills: resumeData.skills.map(skill =>
        skill.id === id ? { ...skill, description } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {/* 个人信息 */}
      <CollapsibleSection
        title={language === 'zh' ? '个人信息' : 'Personal Information'}
        defaultExpanded={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">{language === 'zh' ? '姓名' : 'Name'}</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                placeholder={language === 'zh' ? '请输入姓名' : 'Enter your name'}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{language === 'zh' ? '邮箱' : 'Email'}</label>
              <input
                type="email"
                className="form-input"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                placeholder={language === 'zh' ? '请输入邮箱' : 'Enter your email'}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">{language === 'zh' ? '电话' : 'Phone'}</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder={language === 'zh' ? '请输入电话' : 'Enter your phone'}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{language === 'zh' ? '地址' : 'Address'}</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                placeholder={language === 'zh' ? '请输入地址' : 'Enter your address'}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'zh' ? '个人简介' : 'Summary'}</label>
            <textarea
              className="form-textarea"
              value={resumeData.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              placeholder={language === 'zh' ? '请输入个人简介' : 'Enter your summary'}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* 教育背景 */}
      <CollapsibleSection
        title={language === 'zh' ? '教育背景' : 'Education'}
        defaultExpanded={true}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">{language === 'zh' ? '教育背景' : 'Education'}</h3>
          <button
            onClick={addEducation}
            className="btn btn-primary text-sm"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="card mb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">{language === 'zh' ? '教育经历' : 'Education'}</h4>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700"
              >
                {language === 'zh' ? '删除' : 'Delete'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '学校' : 'School'}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder={language === 'zh' ? '请输入学校名称' : 'Enter school name'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '学位' : 'Degree'}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder={language === 'zh' ? '请输入学位' : 'Enter degree'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '专业' : 'Major'}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.major}
                    onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                    placeholder={language === 'zh' ? '请输入专业' : 'Enter major'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '开始日期' : 'Start Date'}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '结束日期' : 'End Date'}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{language === 'zh' ? '描述' : 'Description'}</label>
                <textarea
                  className="form-textarea"
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder={language === 'zh' ? '请输入描述' : 'Enter description'}
                />
              </div>
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* 工作经历 */}
      <CollapsibleSection
        title={language === 'zh' ? '工作经历' : 'Experience'}
        defaultExpanded={false}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">{language === 'zh' ? '工作经历' : 'Experience'}</h3>
          <button
            onClick={addExperience}
            className="btn btn-primary text-sm"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="card mb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">{language === 'zh' ? '工作经历' : 'Experience'}</h4>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                {language === 'zh' ? '删除' : 'Delete'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '公司' : 'Company'}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder={language === 'zh' ? '请输入公司名称' : 'Enter company name'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '职位' : 'Position'}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder={language === 'zh' ? '请输入职位' : 'Enter position'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '开始日期' : 'Start Date'}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{language === 'zh' ? '结束日期' : 'End Date'}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{language === 'zh' ? '描述' : 'Description'}</label>
                <textarea
                  className="form-textarea"
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder={language === 'zh' ? '请输入描述' : 'Enter description'}
                />
              </div>
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* 技能 */}
      <CollapsibleSection
        title={language === 'zh' ? '技能' : 'Skills'}
        defaultExpanded={false}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">{language === 'zh' ? '技能' : 'Skills'}</h3>
          <button
            onClick={addSkill}
            className="btn btn-primary text-sm"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        {resumeData.skills.map((skill) => (
          <div key={skill.id} className="card mb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">{language === 'zh' ? '技能' : 'Skill'}</h4>
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-red-500 hover:text-red-700"
              >
                {language === 'zh' ? '删除' : 'Delete'}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">{language === 'zh' ? '描述' : 'Description'}</label>
              <textarea
                className="form-textarea"
                value={skill.description}
                onChange={(e) => updateSkill(skill.id, e.target.value)}
                placeholder={language === 'zh' ? '请输入技能描述' : 'Enter skill description'}
              />
            </div>
          </div>
        ))}
      </CollapsibleSection>
    </div>
  );
};

export default ResumeForm;