export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  description: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    gender: string;
    birthDate: string;
    photo: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

export type ResumeStyle = 'style-1' | 'style-2' | 'style-3';

export type Language = 'zh' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
}