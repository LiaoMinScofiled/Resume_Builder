'use client';

import React, { useState } from 'react';
import { ResumeData, Education, Experience, Skill } from '@/types/resume';
import MonthPicker from './MonthPicker';

interface ResumeFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
  language: 'zh' | 'en';
  activeModule: string;
  onSkillLayoutChange?: (layout: 'single' | 'double' | 'triple') => void;
  onSkillStyleChange?: (style: string) => void;
  onAwardLayoutChange?: (layout: string) => void;
  onFontFamilyChange?: (font: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, onResumeDataChange, language, activeModule, onSkillLayoutChange, onSkillStyleChange, onAwardLayoutChange, onFontFamilyChange }) => {
  const [skillLayout, setSkillLayout] = useState<'single' | 'double' | 'triple'>('double');
  const [skillStyle, setSkillStyle] = useState<string>('default');
  const [awardLayout, setAwardLayout] = useState<string>('title-tile-bg');
  const [fontFamily, setFontFamily] = useState<string>('微软雅黑');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [editingAwardText, setEditingAwardText] = useState<string>('');

  // 其他信息编辑状态
  const [otherInfoItems, setOtherInfoItems] = useState<{ title: string; content: string }[]>([]);
  const [editingOtherInfoIndex, setEditingOtherInfoIndex] = useState<number | null>(null);
  const [editingOtherInfoTitle, setEditingOtherInfoTitle] = useState<string>('');
  const [editingOtherInfoContent, setEditingOtherInfoContent] = useState<string>('');
  
  // 年龄/生日切换状态
  const [showAge, setShowAge] = useState<boolean>(true);
  
  // 已添加的额外字段状态
  const [addedFields, setAddedFields] = useState<Set<string>>(new Set());
  
  // 当技能布局变化时，通知父组件
  const handleSkillLayoutChange = (layout: 'single' | 'double' | 'triple') => {
    setSkillLayout(layout);
    if (onSkillLayoutChange) {
      onSkillLayoutChange(layout);
    }
  };
  
  // 当技能样式变化时，通知父组件
  const handleSkillStyleChange = (style: string) => {
    setSkillStyle(style);
    if (onSkillStyleChange) {
      onSkillStyleChange(style);
    }
  };
  
  // 当荣誉墙布局变化时，通知父组件
  const handleAwardLayoutChange = (layout: string) => {
    setAwardLayout(layout);
    if (onAwardLayoutChange) {
      onAwardLayoutChange(layout);
    }
  };
  
  // 当字体变化时，通知父组件
  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    if (onFontFamilyChange) {
      onFontFamilyChange(font);
    }
  };
  
  // 开始编辑荣誉奖项
  const startEditAward = (index: number, text: string) => {
    setEditingAwardIndex(index);
    setEditingAwardText(text);
  };
  
  // 保存编辑的荣誉奖项
  const saveEditAward = (index: number) => {
    if (resumeData.awards) {
      const newAwards = [...resumeData.awards];
      newAwards[index] = editingAwardText;
      onResumeDataChange({
        ...resumeData,
        awards: newAwards,
      });
      setEditingAwardIndex(null);
      setEditingAwardText('');
    }
  };
  
  // 取消编辑荣誉奖项
  const cancelEditAward = () => {
    setEditingAwardIndex(null);
    setEditingAwardText('');
  };
  
  // 删除荣誉奖项
  const deleteAward = (index: number) => {
    if (resumeData.awards) {
      const newAwards = resumeData.awards.filter((_, i) => i !== index);
      onResumeDataChange({
        ...resumeData,
        awards: newAwards,
      });
    }
  };

  // 添加其他信息项
  const addOtherInfoItem = () => {
    const newItem = {
      title: language === 'zh' ? '自定义' : 'Custom',
      content: language === 'zh' ? '请在此输入内容...' : 'Please enter content here...'
    };
    const newItems = [...otherInfoItems, newItem];
    setOtherInfoItems(newItems);
    // 自动进入编辑状态
    setEditingOtherInfoIndex(newItems.length - 1);
    setEditingOtherInfoTitle(newItem.title);
    setEditingOtherInfoContent(newItem.content);
    
    // 同步更新到全局状态
    const otherInfoMap: Record<string, string> = {};
    newItems.forEach(item => {
      otherInfoMap[item.title] = item.content;
    });
    onResumeDataChange({
      ...resumeData,
      otherInfo: otherInfoMap
    });
  };

  // 开始编辑其他信息项
  const startEditOtherInfo = (index: number, item: { title: string; content: string }) => {
    setEditingOtherInfoIndex(index);
    setEditingOtherInfoTitle(item.title);
    setEditingOtherInfoContent(item.content);
  };

  // 保存其他信息编辑
  const saveEditOtherInfo = (index: number) => {
    const updatedItems = [...otherInfoItems];
    updatedItems[index] = {
      title: editingOtherInfoTitle,
      content: editingOtherInfoContent
    };
    setOtherInfoItems(updatedItems);
    setEditingOtherInfoIndex(null);
    setEditingOtherInfoTitle('');
    setEditingOtherInfoContent('');
    
    // 同步更新到全局状态
    const otherInfoMap: Record<string, string> = {};
    updatedItems.forEach(item => {
      otherInfoMap[item.title] = item.content;
    });
    onResumeDataChange({
      ...resumeData,
      otherInfo: otherInfoMap
    });
  };

  // 取消其他信息编辑
  const cancelEditOtherInfo = () => {
    setEditingOtherInfoIndex(null);
    setEditingOtherInfoTitle('');
    setEditingOtherInfoContent('');
  };

  // 删除其他信息项
  const deleteOtherInfoItem = (index: number) => {
    const updatedItems = [...otherInfoItems];
    const deletedItem = updatedItems.splice(index, 1)[0];
    setOtherInfoItems(updatedItems);
    if (editingOtherInfoIndex === index) {
      setEditingOtherInfoIndex(null);
      setEditingOtherInfoTitle('');
      setEditingOtherInfoContent('');
    }
    
    // 从addedFields中移除对应的字段类型
    const fieldTypeMap: Record<string, string> = {
      '身高': 'height',
      '体重': 'weight',
      '民族': 'ethnicity',
      '籍贯': 'hometown',
      '政治面貌': 'political',
      '婚姻状态': 'marital',
      'Height': 'height',
      'Weight': 'weight',
      'Ethnicity': 'ethnicity',
      'Hometown': 'hometown',
      'Political Status': 'political',
      'Marital Status': 'marital'
    };
    
    const fieldType = fieldTypeMap[deletedItem.title];
    if (fieldType) {
      const newAddedFields = new Set(addedFields);
      newAddedFields.delete(fieldType);
      setAddedFields(newAddedFields);
    }
    
    // 同步更新到全局状态
    const otherInfoMap: Record<string, string> = {};
    updatedItems.forEach(item => {
      otherInfoMap[item.title] = item.content;
    });
    onResumeDataChange({
      ...resumeData,
      otherInfo: otherInfoMap
    });
  };
  
  // 开始编辑技能
  const startEditSkill = (id: string) => {
    setEditingSkillId(id);
  };
  
  // 取消编辑技能
  const cancelEditSkill = () => {
    setEditingSkillId(null);
  };
  
  // 保存技能编辑
  const saveEditSkill = (id: string, name: string, level: number) => {
    updateSkill(id, 'name', name);
    updateSkill(id, 'level', level * 10); // 转换为0-100的范围
    setEditingSkillId(null);
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  // 切换年龄/生日显示
  const toggleAgeBirthday = (showAgeFlag: boolean) => {
    setShowAge(showAgeFlag);
  };

  // 添加额外信息字段
  const addExtraField = (fieldType: string) => {
    if (!addedFields.has(fieldType)) {
      const newAddedFields = new Set(addedFields);
      newAddedFields.add(fieldType);
      setAddedFields(newAddedFields);
      
      // 添加到其他信息项中
      const fieldLabels: Record<string, string> = {
        height: language === 'zh' ? '身高' : 'Height',
        weight: language === 'zh' ? '体重' : 'Weight',
        ethnicity: language === 'zh' ? '民族' : 'Ethnicity',
        hometown: language === 'zh' ? '籍贯' : 'Hometown',
        political: language === 'zh' ? '政治面貌' : 'Political Status',
        marital: language === 'zh' ? '婚姻状态' : 'Marital Status'
      };
      
      const newItem = {
        title: fieldLabels[fieldType] || fieldType,
        content: language === 'zh' ? '请输入内容' : 'Please enter content'
      };
      
      const newItems = [...otherInfoItems, newItem];
      setOtherInfoItems(newItems);
      
      // 同步更新到全局状态
      const otherInfoMap: Record<string, string> = {};
      newItems.forEach(item => {
        otherInfoMap[item.title] = item.content;
      });
      onResumeDataChange({
        ...resumeData,
        otherInfo: otherInfoMap
      });
    }
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
      type: [],
    };
    onResumeDataChange({
      ...resumeData,
      education: [...(resumeData.education || []), newEducation],
    });
  };

  const updateEducation = (id: string, field: string, value: string | string[]) => {
    onResumeDataChange({
      ...resumeData,
      education: (resumeData.education || []).map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const toggleEducationType = (id: string, type: string) => {
    onResumeDataChange({
      ...resumeData,
      education: (resumeData.education || []).map(edu => {
        if (edu.id === id) {
          const currentTypes = edu.type || [];
          if (currentTypes.includes(type)) {
            // 如果已存在，则移除
            return { ...edu, type: currentTypes.filter(t => t !== type) };
          } else {
            // 如果不存在，则添加
            return { ...edu, type: [...currentTypes, type] };
          }
        }
        return edu;
      }),
    });
  };

  const removeEducation = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      education: (resumeData.education || []).filter(edu => edu.id !== id),
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
      department: '',
      tags: [],
      positionTags: [],
      location: '',
    };
    onResumeDataChange({
      ...resumeData,
      experience: [...(resumeData.experience || []), newExperience],
    });
  };

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    onResumeDataChange({
      ...resumeData,
      experience: (resumeData.experience || []).map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const toggleExperienceTag = (id: string, tag: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: (resumeData.experience || []).map(exp => {
        if (exp.id === id) {
          const currentTags = exp.tags || [];
          if (currentTags.includes(tag)) {
            // 如果已存在，则移除
            return { ...exp, tags: currentTags.filter(t => t !== tag) };
          } else {
            // 如果不存在，则添加
            return { ...exp, tags: [...currentTags, tag] };
          }
        }
        return exp;
      }),
    });
  };

  const toggleExperiencePositionTag = (id: string, tag: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: (resumeData.experience || []).map(exp => {
        if (exp.id === id) {
          const currentTags = exp.positionTags || [];
          if (currentTags.includes(tag)) {
            // 如果已存在，则移除
            return { ...exp, positionTags: currentTags.filter(t => t !== tag) };
          } else {
            // 如果不存在，则添加
            return { ...exp, positionTags: [...currentTags, tag] };
          }
        }
        return exp;
      }),
    });
  };

  const [customTagInput, setCustomTagInput] = useState('');
  const [customPositionTagInput, setCustomPositionTagInput] = useState('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingTagType, setEditingTagType] = useState<'company' | 'position' | null>(null);

  const handleCustomTag = (id: string, tagType: 'company' | 'position') => {
    setEditingExpId(id);
    setEditingTagType(tagType);
  };

  const confirmCustomTag = (id: string, tagType: 'company' | 'position') => {
    const input = tagType === 'company' ? customTagInput : customPositionTagInput;
    if (input.trim()) {
      if (tagType === 'company') {
        toggleExperienceTag(id, input.trim());
        setCustomTagInput('');
      } else {
        toggleExperiencePositionTag(id, input.trim());
        setCustomPositionTagInput('');
      }
      setEditingExpId(null);
      setEditingTagType(null);
    }
  };

  const removeExperience = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: (resumeData.experience || []).filter(exp => exp.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 80,
      description: '',
    };
    onResumeDataChange({
      ...resumeData,
      skills: [...(resumeData.skills || []), newSkill],
    });
  };

  const updateSkill = (id: string, field: string, value: string | number) => {
    onResumeDataChange({
      ...resumeData,
      skills: (resumeData.skills || []).map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      skills: (resumeData.skills || []).filter(skill => skill.id !== id),
    });
  };

  // 项目经历相关函数
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onResumeDataChange({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProject],
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      projects: (resumeData.projects || []).map(project =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      projects: (resumeData.projects || []).filter(project => project.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      {activeModule === 'basic' && (
        <div className="space-y-6">
          {/* 基本信息头部 */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'zh' ? '基本信息' : 'Basic Information'}
              </h3>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'zh' ? '基本信息的最大作用是让对方知道你是谁，以及如何联系你，其他非加分项信息可以考虑不写哦😊' : 'The main purpose of basic information is to let others know who you are and how to contact you. You can consider not writing other non-value-adding information😊'}
            </p>
          </div>
          
          {/* 基本信息表单 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* 个人信息和照片行 */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* 左侧：个人信息 */}
              <div className="flex-1">
                {/* 第一行：姓名和性别 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 姓名 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '姓名' : 'Name'}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      placeholder={language === 'zh' ? '请输入姓名' : 'Enter your name'}
                    />
                  </div>
                  
                  {/* 性别 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '性别' : 'Gender'}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <select
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={resumeData.personalInfo.gender || ''}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    >
                      <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                      <option value="male">{language === 'zh' ? '男' : 'Male'}</option>
                      <option value="female">{language === 'zh' ? '女' : 'Female'}</option>
                    </select>
                  </div>
                </div>
                
                {/* 第二行：年龄和所在城市 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 年龄/生日 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{showAge ? (language === 'zh' ? '年龄' : 'Age') : (language === 'zh' ? '生日' : 'Birthday')}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        {showAge ? (
                          <input
                            type="text"
                            className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={resumeData.personalInfo.age}
                            onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                            placeholder={language === 'zh' ? '请输入年龄' : 'Enter your age'}
                          />
                        ) : (
                          <input
                            type="date"
                            className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={resumeData.personalInfo.birthDate}
                            onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
                            placeholder={language === 'zh' ? '请输入生日' : 'Enter your birthday'}
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          className={`px-3 py-1 rounded-md text-xs font-medium ${showAge ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          onClick={() => toggleAgeBirthday(true)}
                        >
                          {language === 'zh' ? '年龄' : 'Age'}
                        </button>
                        <button 
                          type="button"
                          className={`px-3 py-1 rounded-md text-xs font-medium ${!showAge ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                          onClick={() => toggleAgeBirthday(false)}
                        >
                          {language === 'zh' ? '生日' : 'Birthday'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 所在城市 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '所在城市' : 'City'}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder={language === 'zh' ? '请输入所在城市' : 'Enter your city'}
                    />
                  </div>
                </div>
                
                {/* 其他信息行 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 左侧：邮箱 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '邮箱' : 'Email'}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder={language === 'zh' ? '请输入邮箱地址' : 'Enter your email address'}
                    />
                  </div>
                  
                  {/* 右侧：电话 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '电话' : 'Phone'}</label>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder={language === 'zh' ? '请输入电话号码' : 'Enter your phone number'}
                    />
                  </div>
                </div>
              </div>
              
              {/* 右侧：个人照片 */}
              <div className="flex-shrink-0">
                <label className="text-sm font-medium text-gray-700 block mb-2">{language === 'zh' ? '个人照片' : 'Personal Photo'}</label>
                <div className="relative">
                  {resumeData.personalInfo.photo ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resumeData.personalInfo.photo}
                        alt={language === 'zh' ? '照片' : 'Photo'}
                        className="w-32 h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.files && target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                // 调整图片尺寸到标准简历照片大小
                                const img = new Image();
                                img.onload = () => {
                                  // 标准简历照片尺寸：295×413像素（一寸照片，300DPI）
                                  const canvas = document.createElement('canvas');
                                  const ctx = canvas.getContext('2d');
                                  canvas.width = 295;
                                  canvas.height = 413;
                                  
                                  // 计算图片缩放比例，保持 aspect ratio
                                  const scale = Math.min(295 / img.width, 413 / img.height);
                                  const x = (295 - img.width * scale) / 2;
                                  const y = (413 - img.height * scale) / 2;
                                  
                                  // 填充白色背景
                                  if (ctx) {
                                    ctx.fillStyle = '#ffffff';
                                    ctx.fillRect(0, 0, 295, 413);
                                    
                                    // 绘制并缩放图片
                                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                  }
                                  
                                  // 转换为 data URL
                                  const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
                                  handlePersonalInfoChange('photo', resizedImage);
                                };
                                img.src = event.target?.result as string;
                              };
                              reader.readAsDataURL(target.files[0]);
                            }
                          };
                          input.click();
                        }}
                      />
                      <div className="absolute top-0 right-0 flex flex-col gap-1 bg-white bg-opacity-80 rounded-bl-md">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const target = e.target as HTMLInputElement;
                              if (target.files && target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  // 调整图片尺寸到标准简历照片大小
                                  const img = new Image();
                                  img.onload = () => {
                                    // 标准简历照片尺寸：295×413像素（一寸照片，300DPI）
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    canvas.width = 295;
                                    canvas.height = 413;
                                    
                                    // 计算图片缩放比例，保持 aspect ratio
                                    const scale = Math.min(295 / img.width, 413 / img.height);
                                    const x = (295 - img.width * scale) / 2;
                                    const y = (413 - img.height * scale) / 2;
                                    
                                    // 填充白色背景
                                    if (ctx) {
                                      ctx.fillStyle = '#ffffff';
                                      ctx.fillRect(0, 0, 295, 413);
                                      
                                      // 绘制并缩放图片
                                      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                    }
                                    
                                    // 转换为 data URL
                                    const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
                                    handlePersonalInfoChange('photo', resizedImage);
                                  };
                                  img.src = event.target?.result as string;
                                };
                                reader.readAsDataURL(target.files[0]);
                              }
                            };
                            input.click();
                          }}
                        >
                          {language === 'zh' ? '更换' : 'Change'}
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-red-500 hover:bg-red-50 rounded"
                          onClick={() => handlePersonalInfoChange('photo', '')}
                        >
                          {language === 'zh' ? '删除' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-32 h-40 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files && target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              // 调整图片尺寸到标准简历照片大小
                              const img = new Image();
                              img.onload = () => {
                                // 标准简历照片尺寸：295×413像素（一寸照片，300DPI）
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = 295;
                                canvas.height = 413;
                                
                                // 计算图片缩放比例，保持 aspect ratio
                                const scale = Math.min(295 / img.width, 413 / img.height);
                                const x = (295 - img.width * scale) / 2;
                                const y = (413 - img.height * scale) / 2;
                                
                                // 填充白色背景
                                if (ctx) {
                                  ctx.fillStyle = '#ffffff';
                                  ctx.fillRect(0, 0, 295, 413);
                                  
                                  // 绘制并缩放图片
                                  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                }
                                
                                // 转换为 data URL
                                const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
                                handlePersonalInfoChange('photo', resizedImage);
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(target.files[0]);
                          }
                        };
                        input.click();
                      }}
                    >
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          
            {/* 可添加的额外字段 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{language === 'zh' ? '添加更多信息' : 'Add More Information'}</h4>
              <div className="flex flex-wrap gap-3">
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('height') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('height')}
                  disabled={addedFields.has('height')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '身高' : 'Height'}
                </button>
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('weight') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('weight')}
                  disabled={addedFields.has('weight')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '体重' : 'Weight'}
                </button>
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('ethnicity') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('ethnicity')}
                  disabled={addedFields.has('ethnicity')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '民族' : 'Ethnicity'}
                </button>
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('hometown') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('hometown')}
                  disabled={addedFields.has('hometown')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '籍贯' : 'Hometown'}
                </button>
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('political') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('political')}
                  disabled={addedFields.has('political')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '政治面貌' : 'Political Status'}
                </button>
                <button 
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${addedFields.has('marital') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => addExtraField('marital')}
                  disabled={addedFields.has('marital')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {language === 'zh' ? '婚姻状态' : 'Marital Status'}
                </button>
              </div>
            </div>
            
            {/* 已添加的额外信息字段 */}
            {otherInfoItems.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{language === 'zh' ? '已添加信息' : 'Added Information'}</h4>
                <div className="space-y-3">
                  {otherInfoItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <button 
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteOtherInfoItem(index)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        value={item.content}
                        onChange={(e) => {
                          const updatedItems = [...otherInfoItems];
                          updatedItems[index].content = e.target.value;
                          setOtherInfoItems(updatedItems);
                          
                          // 同步更新到全局状态
                          const otherInfoMap: Record<string, string> = {};
                          updatedItems.forEach(i => {
                            otherInfoMap[i.title] = i.content;
                          });
                          onResumeDataChange({
                            ...resumeData,
                            otherInfo: otherInfoMap
                          });
                        }}
                        placeholder={language === 'zh' ? '请输入内容' : 'Please enter content'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 求职意向 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{language === 'zh' ? '求职意向' : 'Job Intention'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 工作状态 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '工作状态' : 'Job Status'}</label>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resumeData.personalInfo.status}
                    onChange={(e) => handlePersonalInfoChange('status', e.target.value)}
                    placeholder={language === 'zh' ? '请输入工作状态' : 'Enter your job status'}
                  />
                </div>
                
                {/* 意向城市 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '意向城市' : 'Desired City'}</label>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder={language === 'zh' ? '请输入意向城市' : 'Enter your desired city'}
                  />
                </div>
                
                {/* 职位 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '职位' : 'Position'}</label>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                    placeholder={language === 'zh' ? '请输入意向职位' : 'Enter your desired position'}
                  />
                </div>
                
                {/* 薪资 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">{language === 'zh' ? '薪资' : 'Salary'}</label>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M11 5a2 2 0 002 2h2a2 2 0 002-2M11 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resumeData.personalInfo.salary}
                    onChange={(e) => handlePersonalInfoChange('salary', e.target.value)}
                    placeholder={language === 'zh' ? '请输入薪资期望' : 'Enter your salary expectation'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 教育经历 */}
      {activeModule === 'education' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">{language === 'zh' ? '教育经历' : 'Education'}</h3>
            <button
              onClick={addEducation}
              className="btn btn-primary text-sm"
            >
              {language === 'zh' ? '添加' : 'Add'}
            </button>
          </div>
          
          {/* 确保至少有一个教育经历项 */}
          {(!resumeData.education || resumeData.education.length === 0) && (addEducation(), null)}
          
          {/* 显示教育经历编辑表单 */}
          {(resumeData.education || []).map((edu, index) => (
            <div key={edu.id} className="card mb-4 relative">
              {index > 0 && (
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    aria-label={language === 'zh' ? '删除教育经历' : 'Delete education'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="p-4">
                <div className="space-y-4">
                  {/* 学校信息 */}
                  <div className="space-y-2">
                    <label className="form-label font-medium">{language === 'zh' ? '学校' : 'School'}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder={language === 'zh' ? '请输入学校名称' : 'Enter school name'}
                    />
                    
                    {/* 学校类型标签 */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${(edu.type || []).includes('985') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => toggleEducationType(edu.id, '985')}
                      >
                        985
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${(edu.type || []).includes('双一流') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => toggleEducationType(edu.id, '双一流')}
                      >
                        {language === 'zh' ? '双一流' : 'Double First Class'}
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${(edu.type || []).includes('海外QS前100') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => toggleEducationType(edu.id, '海外QS前100')}
                      >
                        海外QS前100
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${(edu.type || []).includes('211') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => toggleEducationType(edu.id, '211')}
                      >
                        211
                      </button>
                      <button 
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {language === 'zh' ? '自定义' : 'Custom'}
                      </button>
                    </div>
                  </div>
                  
                  {/* 学历和专业 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '学历' : 'Degree'}</label>
                      <select
                        className="form-input"
                        value={edu.degree || '本科'}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      >
                        <option value="初中">{language === 'zh' ? '初中' : 'Junior High'}</option>
                        <option value="高中">{language === 'zh' ? '高中' : 'High School'}</option>
                        <option value="专科">{language === 'zh' ? '专科' : 'Associate'}</option>
                        <option value="本科">{language === 'zh' ? '本科' : 'Bachelor'}</option>
                        <option value="硕士">{language === 'zh' ? '硕士' : 'Master'}</option>
                        <option value="博士">{language === 'zh' ? '博士' : 'PhD'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '专业' : 'Major'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.major}
                        onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                        placeholder={language === 'zh' ? '请输入专业名称' : 'Enter major'}
                      />
                    </div>
                  </div>
                  
                  {/* 时间 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '开始时间' : 'Start Date'}</label>
                      <MonthPicker
                        value={edu.startDate}
                        onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                        placeholder={language === 'zh' ? '2019-09' : '2019-09'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '结束时间' : 'End Date'}</label>
                      <MonthPicker
                        value={edu.endDate}
                        onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                        placeholder={language === 'zh' ? '2023-06' : '2023-06'}
                      />
                    </div>
                  </div>
                  
                  {/* 描述 */}
                  <div className="form-group">
                    <label className="form-label font-medium">{language === 'zh' ? '描述' : 'Description'}</label>
                    {/* 富文本编辑工具栏 */}
                    <div className="bg-gray-50 p-2 rounded-t-lg border border-b-0 border-gray-200 flex flex-wrap items-center gap-2">
                      {/* 字体样式 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('bold', false, undefined)}
                        >
                          <span className="font-bold">B</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('italic', false, undefined)}
                        >
                          <span className="font-italic">I</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('strikeThrough', false, undefined)}
                        >
                          <span className="line-through">S</span>
                        </button>
                      </div>
                      {/* 列表 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                      </div>
                      {/* 缩进 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('outdent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('indent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      {/* 润色按钮 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm"
                          onClick={async () => {
                            const descriptionElement = document.querySelector(`[data-edu-id="${edu.id}"]`);
                            if (descriptionElement) {
                              const originalContent = descriptionElement.innerHTML;
                              
                              if (!originalContent || originalContent.trim() === '<p><br></p>' || originalContent.trim() === '') {
                                alert(language === 'zh' ? '请先输入教育经历描述内容' : 'Please enter education description first');
                                return;
                              }
                              
                              try {
                                console.log('开始润色操作');
                                console.log('Original content:', originalContent);
                                console.log('Extracted text:', originalContent.replace(/<[^>]*>/g, ''));
                                
                                // 导入DashScope API
                                console.log('Importing dashscope module...');
                                const { callDashScopeAPI } = await import('@/lib/dashscope');
                                console.log('Import successful');
                                
                                // 调用API进行润色
                                const prompt = `请对以下教育经历描述进行润色，使其更加专业、简洁、有吸引力：\n\n${originalContent.replace(/<[^>]*>/g, '')}`;
                                console.log('Prompt:', prompt);
                                
                                console.log('Calling API...');
                                const polishedContent = await callDashScopeAPI(prompt);
                                console.log('API call successful');
                                console.log('Polished content:', polishedContent);
                                
                                // 更新内容
                                descriptionElement.innerHTML = `<p>${polishedContent}</p>`;
                                updateEducation(edu.id, 'description', `<p>${polishedContent}</p>`);
                                console.log('Content updated successfully');
                              } catch (error) {
                                console.error('润色失败:', error);
                                console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
                                alert(language === 'zh' ? '润色失败，请检查API配置' : 'Polishing failed, please check API configuration');
                              }
                            }
                          }}
                        >
                          {language === 'zh' ? '润色' : 'Polish'}
                        </button>
                      </div>
                    </div>
                    {/* 富文本编辑器 */}
                    <div
                      className="form-textarea rounded-t-none border border-gray-200 min-h-[100px] p-3"
                      contentEditable
                      data-edu-id={edu.id}
                      onBlur={(e) => updateEducation(edu.id, 'description', (e.target as HTMLElement).innerHTML)}
                      dangerouslySetInnerHTML={{ __html: edu.description || '' }}
                    />
                    {!edu.description && (
                      <div className="absolute pointer-events-none px-3 py-2 text-gray-500">
                        {language === 'zh' ? '请输入教育经历描述' : 'Enter education description'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 工作经历 */}
      {activeModule === 'experience' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">{language === 'zh' ? '工作经历' : 'Experience'}</h3>
            <button
              onClick={addExperience}
              className="btn btn-primary text-sm"
            >
              {language === 'zh' ? '添加' : 'Add'}
            </button>
          </div>
          
          {/* 确保至少有一个工作经历项 */}
          {(!resumeData.experience || resumeData.experience.length === 0) && (addExperience(), null)}
          
          {/* 显示工作经历编辑表单 */}
          {(resumeData.experience || []).map((exp, index) => (
            <div key={exp.id} className="card mb-4 relative">
              {index > 0 && (
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    aria-label={language === 'zh' ? '删除工作经历' : 'Delete experience'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="p-4">
                <div className="space-y-4">
                  {/* 公司和职位 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="form-label font-medium">{language === 'zh' ? '公司' : 'Company'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder={language === 'zh' ? '请输入公司名称' : 'Enter company name'}
                      />
                      
                      {/* 公司类型标签 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('互联网大厂') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '互联网大厂')}
                        >
                          {language === 'zh' ? '互联网大厂' : 'Internet Giant'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('技术领先') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '技术领先')}
                        >
                          {language === 'zh' ? '技术领先' : 'Tech Leader'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('世界500强') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '世界500强')}
                        >
                          {language === 'zh' ? '世界500强' : 'Fortune 500'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('业内TOP3') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '业内TOP3')}
                        >
                          {language === 'zh' ? '业内TOP3' : 'Top 3 in Industry'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('美股上市') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '美股上市')}
                        >
                          {language === 'zh' ? '美股上市' : 'US Listed'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('港股上市') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '港股上市')}
                        >
                          {language === 'zh' ? '港股上市' : 'HK Listed'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('A股上市') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, 'A股上市')}
                        >
                          {language === 'zh' ? 'A股上市' : 'A-Share Listed'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('独角兽') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, '独角兽')}
                        >
                          {language === 'zh' ? '独角兽' : 'Unicorn'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.tags || []).includes('C轮融资') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperienceTag(exp.id, 'C轮融资')}
                        >
                          {language === 'zh' ? 'C轮融资' : 'Series C'}
                        </button>
                        {editingExpId === exp.id && editingTagType === 'company' ? (
                          <>
                            <input
                              type="text"
                              className="px-3 py-1 rounded-full text-sm border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={customTagInput}
                              onChange={(e) => setCustomTagInput(e.target.value)}
                              placeholder={language === 'zh' ? '自定义标签' : 'Custom tag'}
                              autoFocus
                            />
                            <button 
                              className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => confirmCustomTag(exp.id, 'company')}
                            >
                              {language === 'zh' ? '确定' : 'Confirm'}
                            </button>
                          </>
                        ) : (
                          <button 
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => handleCustomTag(exp.id, 'company')}
                          >
                            + {language === 'zh' ? '自定义' : 'Custom'}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="form-label font-medium">{language === 'zh' ? '职位名称' : 'Position'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder={language === 'zh' ? '请输入职位名称' : 'Enter position'}
                      />
                      
                      {/* 职位标签 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.positionTags || []).includes('移动开发') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperiencePositionTag(exp.id, '移动开发')}
                        >
                          {language === 'zh' ? '移动开发' : 'Mobile Dev'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.positionTags || []).includes('架构设计') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperiencePositionTag(exp.id, '架构设计')}
                        >
                          {language === 'zh' ? '架构设计' : 'Architecture'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.positionTags || []).includes('团队管理') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperiencePositionTag(exp.id, '团队管理')}
                        >
                          {language === 'zh' ? '团队管理' : 'Team Management'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.positionTags || []).includes('实习') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperiencePositionTag(exp.id, '实习')}
                        >
                          {language === 'zh' ? '实习' : 'Internship'}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${(exp.positionTags || []).includes('兼职') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => toggleExperiencePositionTag(exp.id, '兼职')}
                        >
                          {language === 'zh' ? '兼职' : 'Part-time'}
                        </button>
                        {editingExpId === exp.id && editingTagType === 'position' ? (
                          <>
                            <input
                              type="text"
                              className="px-3 py-1 rounded-full text-sm border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={customPositionTagInput}
                              onChange={(e) => setCustomPositionTagInput(e.target.value)}
                              placeholder={language === 'zh' ? '自定义标签' : 'Custom tag'}
                              autoFocus
                            />
                            <button 
                              className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => confirmCustomTag(exp.id, 'position')}
                            >
                              {language === 'zh' ? '确定' : 'Confirm'}
                            </button>
                          </>
                        ) : (
                          <button 
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => handleCustomTag(exp.id, 'position')}
                          >
                            + {language === 'zh' ? '自定义' : 'Custom'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 部门和城市 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '所在部门' : 'Department'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.department}
                        onChange={(e) => updateExperience(exp.id, 'department', e.target.value)}
                        placeholder={language === 'zh' ? '请输入所在部门' : 'Enter department'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '所在城市' : 'City'}</label>
                      <input
                            type="text"
                            className="form-input"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder={language === 'zh' ? '请输入所在城市' : 'Enter city'}
                          />
                    </div>
                  </div>
                  
                  {/* 时间 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '开始时间' : 'Start Date'}</label>
                      <MonthPicker
                        value={exp.startDate}
                        onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                        placeholder={language === 'zh' ? '2019-01' : '2019-01'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '结束时间' : 'End Date'}</label>
                      <MonthPicker
                        value={exp.endDate}
                        onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                        placeholder={language === 'zh' ? '2023-06' : '2023-06'}
                      />
                    </div>
                  </div>
                  
                  {/* 工作描述 */}
                  <div className="form-group">
                    <label className="form-label font-medium">{language === 'zh' ? '工作描述' : 'Job Description'}</label>
                    {/* 富文本编辑工具栏 */}
                    <div className="bg-gray-50 p-2 rounded-t-lg border border-b-0 border-gray-200 flex flex-wrap items-center gap-2">
                      {/* 字体样式 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('bold', false, undefined)}
                        >
                          <span className="font-bold">B</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('italic', false, undefined)}
                        >
                          <span className="font-italic">I</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('strikeThrough', false, undefined)}
                        >
                          <span className="line-through">S</span>
                        </button>
                      </div>
                      {/* 列表 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                      </div>
                      {/* 缩进 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('outdent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('indent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      {/* 润色按钮 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm"
                          onClick={async () => {
                            // 工作经历润色
                            const element = document.querySelector(`[data-exp-id="${exp.id}"]`);
                            if (element) {
                              const originalContent = element.innerHTML;
                               
                              if (!originalContent || originalContent.trim() === '<p><br></p>' || originalContent.trim() === '') {
                                alert(language === 'zh' ? '请先输入工作描述内容' : 'Please enter job description first');
                                return;
                              }
                               
                              try {
                                // 导入DashScope API
                                const { callDashScopeAPI } = await import('@/lib/dashscope');
                                
                                // 调用API进行润色
                                const prompt = `请对以下工作经历描述进行润色，使其更加专业、简洁、有吸引力：\n\n${originalContent.replace(/<[^>]*>/g, '')}`;
                                const polishedContent = await callDashScopeAPI(prompt);
                                
                                // 更新内容
                                element.innerHTML = `<p>${polishedContent}</p>`;
                                updateExperience(exp.id, 'description', `<p>${polishedContent}</p>`);
                              } catch (error) {
                                console.error('润色失败:', error);
                                alert(language === 'zh' ? '润色失败，请检查API配置' : 'Polishing failed, please check API configuration');
                              }
                            }
                          }}
                        >
                          {language === 'zh' ? '润色' : 'Polish'}
                        </button>
                      </div>
                    </div>
                    {/* 富文本编辑器 */}
                    <div
                      className="form-textarea rounded-t-none border border-gray-200 min-h-[120px] p-3"
                      contentEditable
                      data-exp-id={exp.id}
                      onBlur={(e) => updateExperience(exp.id, 'description', (e.target as HTMLElement).innerHTML)}
                      dangerouslySetInnerHTML={{ __html: exp.description || '' }}
                    />
                    {!exp.description && (
                      <div className="absolute pointer-events-none px-3 py-2 text-gray-500">
                        {language === 'zh' ? '请输入工作描述' : 'Enter job description'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 项目经历 */}
      {activeModule === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">{language === 'zh' ? '项目经历' : 'Projects'}</h3>
            <button
              onClick={addProject}
              className="btn btn-primary text-sm"
            >
              {language === 'zh' ? '添加' : 'Add'}
            </button>
          </div>
          
          {/* 确保至少有一个项目经历项 */}
          {(!resumeData.projects || resumeData.projects.length === 0) && (addProject(), null)}
          
          {/* 显示项目经历编辑表单 */}
          {(resumeData.projects || []).map((project, index) => (
            <div key={project.id} className="card mb-4 relative">
              {index > 0 && (
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => removeProject(project.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    aria-label={language === 'zh' ? '删除项目经历' : 'Delete project'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="p-4">
                <div className="space-y-4">
                  {/* 项目名称 */}
                  <div className="space-y-2">
                    <label className="form-label font-medium">{language === 'zh' ? '项目名称' : 'Project Name'}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder={language === 'zh' ? '请输入项目名称' : 'Enter project name'}
                    />
                  </div>
                  
                  {/* 角色和公司 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '我的角色' : 'My Role'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={project.role}
                        onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                        placeholder={language === 'zh' ? '请输入角色' : 'Enter role'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '所属公司' : 'Company'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={project.company}
                        onChange={(e) => updateProject(project.id, 'company', e.target.value)}
                        placeholder={language === 'zh' ? '请输入公司名称' : 'Enter company name'}
                      />
                    </div>
                  </div>
                  
                  {/* 时间 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '开始时间' : 'Start Date'}</label>
                      <MonthPicker
                        value={project.startDate}
                        onChange={(value) => updateProject(project.id, 'startDate', value)}
                        placeholder={language === 'zh' ? '2020-01' : '2020-01'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{language === 'zh' ? '结束时间' : 'End Date'}</label>
                      <MonthPicker
                        value={project.endDate}
                        onChange={(value) => updateProject(project.id, 'endDate', value)}
                        placeholder={language === 'zh' ? '2021-12' : '2021-12'}
                      />
                    </div>
                  </div>
                  
                  {/* 项目描述 */}
                  <div className="form-group">
                    <label className="form-label font-medium">{language === 'zh' ? '项目描述' : 'Project Description'}</label>
                    {/* 富文本编辑工具栏 */}
                    <div className="bg-gray-50 p-2 rounded-t-lg border border-b-0 border-gray-200 flex flex-wrap items-center gap-2">
                      {/* 字体样式 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('bold', false, undefined)}
                        >
                          <span className="font-bold">B</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('italic', false, undefined)}
                        >
                          <span className="font-italic">I</span>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('strikeThrough', false, undefined)}
                        >
                          <span className="line-through">S</span>
                        </button>
                      </div>
                      {/* 列表 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                      </div>
                      {/* 缩进 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('outdent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          onClick={() => document.execCommand('indent', false, undefined)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      {/* 润色按钮 */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm"
                          onClick={async () => {
                            // 项目经历润色
                            const element = document.querySelector(`[data-proj-id="${project.id}"]`);
                            if (element) {
                              const originalContent = element.innerHTML;
                               
                              if (!originalContent || originalContent.trim() === '<p><br></p>' || originalContent.trim() === '') {
                                alert(language === 'zh' ? '请先输入项目描述内容' : 'Please enter project description first');
                                return;
                              }
                               
                              try {
                                // 导入DashScope API
                                const { callDashScopeAPI } = await import('@/lib/dashscope');
                                
                                // 调用API进行润色
                                const prompt = `请对以下项目经历描述进行润色，使其更加专业、简洁、有吸引力：\n\n${originalContent.replace(/<[^>]*>/g, '')}`;
                                const polishedContent = await callDashScopeAPI(prompt);
                                
                                // 更新内容
                                element.innerHTML = `<p>${polishedContent}</p>`;
                                updateProject(project.id, 'description', `<p>${polishedContent}</p>`);
                              } catch (error) {
                                console.error('润色失败:', error);
                                alert(language === 'zh' ? '润色失败，请检查API配置' : 'Polishing failed, please check API configuration');
                              }
                            }
                          }}
                        >
                          {language === 'zh' ? '润色' : 'Polish'}
                        </button>
                      </div>
                    </div>
                    {/* 富文本编辑器 */}
                    <div
                      className="form-textarea rounded-t-none border border-gray-200 min-h-[120px] p-3"
                      contentEditable
                      data-proj-id={project.id}
                      onBlur={(e) => updateProject(project.id, 'description', (e.target as HTMLElement).innerHTML)}
                      dangerouslySetInnerHTML={{ __html: project.description || '' }}
                    />
                    {!project.description && (
                      <div className="absolute pointer-events-none px-3 py-2 text-gray-500">
                        {language === 'zh' ? '请输入项目描述' : 'Enter project description'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 个人总结 */}
      {activeModule === 'summary' && (
        <div className="card">
          <div className="p-4 relative">
            {/* 删除个人总结按钮 */}
            {resumeData.personalInfo.summary && (
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => handlePersonalInfoChange('summary', '')}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  aria-label={language === 'zh' ? '删除个人总结' : 'Delete summary'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{language === 'zh' ? '个人总结' : 'Summary'}</h3>
              <p className="text-gray-600 text-sm">
                {language === 'zh' ? '个人总结是一段凝练专业要点阐述，帮助你命中对方招聘需求的关键点' : 'Personal summary is a concise statement of professional highlights to help you meet the recruitment needs'}
              </p>
            </div>
            
            {/* 富文本编辑工具栏 */}
            <div className="bg-gray-50 p-3 rounded-t-lg border border-b-0 border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                {/* 字体样式 */}
                <div className="flex items-center gap-2">
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('formatBlock', false, '<h3>')}
                  >
                    <span className="font-bold">H</span>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('bold', false, undefined)}
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('italic', false, undefined)}
                  >
                    <span className="font-italic">I</span>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('strikeThrough', false, undefined)}
                  >
                    <span className="line-through">S</span>
                  </button>
                </div>
                
                {/* 字体大小 */}
                <div className="flex items-center gap-2">
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('decreaseFontSize', false, undefined)}
                  >-</button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('increaseFontSize', false, undefined)}
                  >+</button>
                  <span className="text-sm">66</span>
                </div>
                
                {/* 对齐方式 */}
                <div className="flex items-center gap-2">
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('justifyLeft', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('justifyCenter', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('justifyRight', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('justifyFull', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                
                {/* 列表 */}
                <div className="flex items-center gap-2">
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
                
                {/* 缩进 */}
                <div className="flex items-center gap-2">
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('outdent', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => document.execCommand('indent', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* 链接 */}
                <div>
                  <button 
                    className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      const url = prompt('请输入链接地址:');
                      if (url) {
                        document.execCommand('createLink', false, url);
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* 个人总结富文本编辑器 */}
            <div
              className="form-textarea rounded-t-none border border-gray-200 min-h-[150px] p-3"
              contentEditable
              onBlur={(e) => handlePersonalInfoChange('summary', (e.target as HTMLElement).innerHTML)}
              dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary || '' }}
            />
            {!resumeData.personalInfo.summary && (
              <div className="absolute pointer-events-none px-3 py-2 text-gray-500">
                {language === 'zh' ? '请输入个人总结' : 'Enter your personal summary'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 技能专长 */}
      {activeModule === 'skills' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{language === 'zh' ? '技能专长' : 'Skills'}</h3>
            <p className="text-gray-600 text-sm">
              {language === 'zh' ? '使用图形样式表示掌握技能的熟练程度，可以增加简历的设计感。' : 'Using graphical styles to represent skill proficiency can enhance the resume design.'}
            </p>
          </div>
          
          {/* 字体设置 */}
          <div className="card mb-4">
            <div className="p-4">
              <h4 className="font-medium mb-4">{language === 'zh' ? '字体设置' : 'Font Settings'}</h4>
              <div>
                <label className="form-label mb-2 block">{language === 'zh' ? '简历字体' : 'Resume Font'}</label>
                <select
                  className="form-select"
                  value={fontFamily}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                >
                  <option value="微软雅黑">微软雅黑</option>
                  <option value="宋体">宋体</option>
                  <option value="黑体">黑体</option>
                  <option value="楷体">楷体</option>
                  <option value="仿宋">仿宋</option>
                  <option value="霞鹜文楷">霞鹜文楷</option>
                  <option value="思源黑体">思源黑体</option>
                  <option value="仓耳渔阳体">仓耳渔阳体</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 技能条设置 */}
          <div className="card mb-4">
            <div className="p-4">
              <h4 className="font-medium mb-4">{language === 'zh' ? '技能条设置' : 'Skill Bar Settings'}</h4>
              
              {/* 技能条布局 */}
              <div className="mb-4">
                <label className="form-label mb-2 block">{language === 'zh' ? '技能条布局' : 'Skill Bar Layout'}</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-4 py-2 rounded-md border ${skillLayout === 'single' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleSkillLayoutChange('single')}
                  >
                    {language === 'zh' ? '单栏' : 'Single Column'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md border ${skillLayout === 'double' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleSkillLayoutChange('double')}
                  >
                    {language === 'zh' ? '双栏' : 'Double Column'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md border ${skillLayout === 'triple' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleSkillLayoutChange('triple')}
                  >
                    {language === 'zh' ? '三栏' : 'Triple Column'}
                  </button>
                </div>
              </div>
              
              {/* 技能条样式 */}
              <div>
                <label className="form-label mb-2 block">{language === 'zh' ? '技能条样式' : 'Skill Bar Style'}</label>
                <select
                  className="form-select"
                  value={skillStyle}
                  onChange={(e) => handleSkillStyleChange(e.target.value)}
                >
                  <option value="default">默认样式 (━━━━━●━━━)</option>
                  <option value="dots">圆点样式 (●●●●●●●○○○)</option>
                  <option value="bars">柱状样式 (▓▓▓▓▓▓▓░░░)</option>
                  <option value="rounded">圆角样式 (━━━━━)</option>
                  <option value="boxed">方框样式 (▌▌▌▌▌▌░░░)</option>
                  <option value="angled">斜角样式 (▌▌▌▌▌▌/░░)</option>
                  <option value="slider">滑块样式 (━━━━━○━━━)</option>
                  <option value="squares">方块样式 (■■■■■■□□□□)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 添加技能 */}
          <div>
            <h4 className="font-medium mb-4">{language === 'zh' ? '添加技能' : 'Add Skills'}</h4>
            
            {/* 技能列表 */}
            <div className="space-y-2">
              {(resumeData.skills || []).map((skill) => (
                <div key={skill.id} className="p-3 border border-gray-200 rounded-md">
                  {/* 编辑状态 */}
                  {editingSkillId === skill.id ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                              type="text"
                              className="form-input"
                              defaultValue={skill.name}
                              ref={(input) => { if (input) input.focus(); }}
                              id={`skill-name-${skill.id}`}
                            />
                      </div>
                      <div>
                        <select
                          className="form-select"
                          defaultValue={Math.round(skill.level / 10)}
                          id={`skill-level-${skill.id}`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                            <option key={level} value={level}>
                              {level} {level <= 3 ? language === 'zh' ? '入门' : 'Beginner' : level <= 6 ? language === 'zh' ? '熟悉' : 'Familiar' : language === 'zh' ? '熟练' : 'Skilled'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={cancelEditSkill}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const nameInput = document.getElementById(`skill-name-${skill.id}`) as HTMLInputElement;
                            const levelSelect = document.getElementById(`skill-level-${skill.id}`) as HTMLSelectElement;
                            if (nameInput && levelSelect) {
                              saveEditSkill(skill.id, nameInput.value, parseInt(levelSelect.value));
                            }
                          }}
                          className="text-green-500 hover:text-green-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* 显示状态 */
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="mx-4">
                        <span className="text-sm">
                          {language === 'zh' ? '熟练度：' : 'Proficiency: '}
                          {Math.round(skill.level / 10)}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditSkill(skill.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ))}
              
              {/* 添加技能按钮 */}
              <button
                onClick={addSkill}
                className="btn btn-primary w-full text-center"
              >
                {language === 'zh' ? '添加技能' : 'Add Skill'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 荣誉奖项 */}
      {activeModule === 'awards' && (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{language === 'zh' ? '荣誉奖项' : 'Awards'}</h3>
            <p className="text-gray-600 text-sm">
              {language === 'zh' ? '荣誉表示外界对你能力的客观认可，将极大提升你的印象分。' : 'Awards represent objective recognition of your abilities and will greatly enhance your impression.'}
            </p>
          </div>
          
          {/* 荣誉墙设置 */}
          <div className="card mb-4">
            <div className="p-4">
              <h4 className="font-medium mb-4">{language === 'zh' ? '荣誉墙设置' : 'Award Wall Settings'}</h4>
              
              {/* 荣誉墙布局 */}
              <div className="mb-4">
                <label className="form-label mb-2 block">{language === 'zh' ? '荣誉墙布局' : 'Award Wall Layout'}</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-4 py-2 rounded-md border ${awardLayout === 'title-tile-bg' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleAwardLayoutChange('title-tile-bg')}
                  >
                    {language === 'zh' ? '标题平铺-底色' : 'Title Tile - Background'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md border ${awardLayout === 'title-tile-border' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleAwardLayoutChange('title-tile-border')}
                  >
                    {language === 'zh' ? '标题平铺-描边' : 'Title Tile - Border'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md border ${awardLayout === 'column-list-single' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleAwardLayoutChange('column-list-single')}
                  >
                    {language === 'zh' ? '分栏罗列-单栏' : 'Column List - Single'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md border ${awardLayout === 'column-list-double' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => handleAwardLayoutChange('column-list-double')}
                  >
                    {language === 'zh' ? '分栏罗列-双栏' : 'Column List - Double'}
                  </button>
                </div>
              </div>
              

            </div>
          </div>
          
          {/* 添加荣誉 */}
          <div>
            <h4 className="font-medium mb-4">{language === 'zh' ? '添加荣誉' : 'Add Awards'}</h4>
            
            {/* 荣誉列表 */}
            <div className="space-y-2">
              {resumeData.awards && resumeData.awards.map((award, index) => (
                <div key={index} className={`p-3 border rounded-md ${editingAwardIndex === index ? 'border-blue-500' : 'border-gray-200'}`}>
                  {editingAwardIndex === index ? (
                    // 编辑状态
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingAwardText}
                        onChange={(e) => setEditingAwardText(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        autoFocus
                      />
                      <button 
                        onClick={() => saveEditAward(index)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        onClick={cancelEditAward}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteAward(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // 非编辑状态
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span>{award}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEditAward(index, award)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteAward(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ))}
              
              {/* 添加荣誉按钮 */}
              <button
                onClick={() => {
                  const newAwards = [...(resumeData.awards || []), ''];
                  onResumeDataChange({
                    ...resumeData,
                    awards: newAwards,
                  });
                }}
                className="btn btn-primary w-full text-center"
              >
                {language === 'zh' ? '添加荣誉' : 'Add Award'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 其他信息 */}
      {activeModule === 'other' && (
        <div className="space-y-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{language === 'zh' ? '其他信息' : 'Other Info'}</h3>
              {otherInfoItems.length > 0 && (
                <>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'zh' ? '你可以在这里罗列你所掌握的技能、语言、证书，个人的兴趣爱好，以凸显你的能力' : 'You can list your skills, languages, certificates, and personal interests here to highlight your abilities.'}
            </p>
          </div>
          
          {/* 其他信息列表 */}
          <div className="space-y-4">
            {/* 其他信息项 */}
            {otherInfoItems.map((item, index) => (
              <div key={index} className={`border rounded-md overflow-hidden ${editingOtherInfoIndex === index ? 'border-blue-500' : 'border-gray-200'}`}>
                {/* 标题行 */}
                <div className="flex justify-between items-center p-3 bg-gray-50">
                  {editingOtherInfoIndex === index ? (
                    // 编辑状态的标题
                    <input
                      type="text"
                      value={editingOtherInfoTitle}
                      onChange={(e) => setEditingOtherInfoTitle(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      autoFocus
                    />
                  ) : (
                    // 非编辑状态的标题
                    <div>
                      <span className="font-medium text-blue-600">{item.title}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {editingOtherInfoIndex === index ? (
                      // 编辑状态的按钮
                      <>
                        <button 
                          onClick={() => saveEditOtherInfo(index)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={cancelEditOtherInfo}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                          <button 
                            onClick={() => deleteOtherInfoItem(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                      </>
                    ) : (
                      // 非编辑状态的按钮
                      <>
                        <button 
                          onClick={() => startEditOtherInfo(index, item)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                          <button 
                            onClick={() => deleteOtherInfoItem(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                      </>
                    )}
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>
                </div>
              
              {/* 富文本编辑器 */}
              <div className="border-t border-gray-200">
                {/* 工具栏 */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('formatBlock', false, '<h3>')}
                  >
                    <span className="font-bold">H</span>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('bold', false, undefined)}
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('italic', false, undefined)}
                  >
                    <span className="font-italic">I</span>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('strikeThrough', false, undefined)}
                  >
                    <span className="line-through">S</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('decreaseFontSize', false, undefined)}
                  >
                    <span>--</span>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('increaseFontSize', false, undefined)}
                  >
                    <span>66</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('outdent', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => document.execCommand('indent', false, undefined)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button 
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                    onClick={() => {
                      const url = prompt('请输入链接地址:');
                      if (url) {
                        document.execCommand('createLink', false, url);
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                </div>
                
                {/* 编辑区域 */}
                <div className="p-4 min-h-[150px]">
                  {editingOtherInfoIndex === index ? (
                    // 编辑状态的内容
                    <div
                      contentEditable
                      onBlur={(e) => setEditingOtherInfoContent((e.target as HTMLElement).innerHTML)}
                      dangerouslySetInnerHTML={{ __html: editingOtherInfoContent }}
                      className="w-full p-2 border border-gray-300 rounded-md min-h-[150px]"
                    />
                  ) : (
                    // 非编辑状态的内容
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  )}
                </div>
              </div>
            </div>
            ))}
            
            {/* 添加其他信息按钮 */}
            <button 
              onClick={addOtherInfoItem}
              className="btn btn-primary w-full text-center"
            >
              {language === 'zh' ? '添加其他信息' : 'Add Other Info'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;