export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
  type: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  department: string;
  tags: string[];
  positionTags: string[];
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
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
    location: string;
    age: string;
    title: string;
    status: string;
    salary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  awards: string[];
  otherInfo: Record<string, string | string[]>;
}

export type ResumeStyle = 'style-1' | 'style-2' | 'style-3';

export type Language = 'zh' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
}