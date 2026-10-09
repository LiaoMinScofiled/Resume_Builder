// 简历本地存储：在「毒舌诊断 → 润色 → 面试题 → 打招呼话术」等工具间传递简历内容
// 数据仅保存在用户浏览器 localStorage，不上传服务器

const KEY = 'tb_resume';

export interface StoredResume {
  text: string;
  // 来源工具：roast 毒舌诊断 / polish 润色改写 / manual 手动保存等
  source: string;
  // 附加信息（如毒舌诊断给出的重点优化方向），供润色等工具针对性使用
  meta?: string;
  savedAt: number;
}

export function saveResume(text: string, source: string, meta?: string): void {
  try {
    const data: StoredResume = { text, source, meta, savedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // localStorage 不可用（隐私模式等）时静默忽略
  }
}

export function loadResume(): StoredResume | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredResume;
    return data?.text ? data : null;
  } catch {
    return null;
  }
}

export function clearResume(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 忽略
  }
}

export const RESUME_SOURCE_LABELS: Record<string, { zh: string; en: string }> = {
  roast: { zh: '毒舌诊断', en: 'Roast Diagnosis' },
  polish: { zh: '润色改写', en: 'Resume Polish' },
  interview: { zh: '面试题生成', en: 'Interview Questions' },
  highlights: { zh: '亮点提炼', en: 'Highlights' },
  greeting: { zh: '打招呼话术', en: 'Greeting Scripts' },
  manual: { zh: '手动保存', en: 'Manual Save' },
};
