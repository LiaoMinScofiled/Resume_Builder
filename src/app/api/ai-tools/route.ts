import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

type ToolType = 'translate' | 'xiaohongshu' | 'report' | 'meeting';

function buildMessages(type: ToolType, body: Record<string, string>): { role: 'system' | 'user'; content: string }[] {
  switch (type) {
    case 'translate': {
      const { text, direction = 'auto' } = body;
      const directionDesc =
        direction === 'zh2en' ? '中译英' : direction === 'en2zh' ? '英译中' : '自动检测语言并互译（中英）';
      return [
        { role: 'system', content: '你是一名专业翻译，精通中英双语，擅长地道化润色表达。' },
        {
          role: 'user',
          content: `请将以下内容进行翻译并润色，让译文更加地道、自然、符合目标语言习惯。

翻译方向：${directionDesc}

原文：
"""
${text}
"""

请按以下结构输出：
## 译文
（输出翻译并润色后的完整内容）

## 润色说明
（简要说明 1-2 点关键润色之处，如用词、句式、语气调整）`,
        },
      ];
    }

    case 'xiaohongshu': {
      const { topic, keywords = '' } = body;
      return [
        { role: 'system', content: '你是一名小红书爆款文案专家，擅长撰写有吸引力、口语化、带 emoji 的种草文案。' },
        {
          role: 'user',
          content: `请为以下主题生成一篇小红书种草文案。

主题：${topic}
${keywords ? `关键词/卖点：${keywords}` : ''}

请按以下结构输出：
## 标题
（1-2 个吸睛标题选项，带 emoji）

## 正文
（150-300 字，口语化、有代入感，分段清晰，适当使用 emoji）

## 话题标签
（5-8 个相关标签，以 # 开头）

要求：真实自然，避免过度营销感，符合小红书平台风格。`,
        },
      ];
    }

    case 'report': {
      const { content, reportType = 'weekly' } = body;
      const typeName = reportType === 'daily' ? '日报' : '周报';
      return [
        { role: 'system', content: '你是一名职场效率专家，擅长将零散工作要点整理成结构化、专业的工作汇报。' },
        {
          role: 'user',
          content: `请根据以下工作要点，生成一份结构化的${typeName}。

${typeName}类型：${typeName}

工作要点：
"""
${content}
"""

请按以下结构输出（使用 Markdown）：
## 本周工作总结（或本日工作）
（分点列出完成的工作，量化成果）

## 数据与成果
（如有数据，突出关键指标）

## 问题与风险
（列出遇到的问题、卡点、需要的支持）

## 下周计划（或明日计划）
（分点列出）

要求：语言专业简洁，重点突出，避免流水账，符合职场汇报规范。`,
        },
      ];
    }

    case 'meeting': {
      const { content } = body;
      return [
        { role: 'system', content: '你是一名高效会议记录员，擅长从原始讨论中提炼结构化会议纪要。' },
        {
          role: 'user',
          content: `请根据以下会议原始记录，整理成一份结构化的会议纪要。

会议原始记录：
"""
${content}
"""

请按以下结构输出（使用 Markdown）：
## 会议主题
（根据内容概括）

## 会议结论
（列出达成的关键决议/共识）

## 讨论要点
（按主题分点总结，去重、提炼）

## 待办事项
（列出具体的行动项，格式：- [ ] 任务内容 @负责人）

要求：客观提炼，不遗漏关键信息，去除冗余口语，待办事项要明确可执行。`,
        },
      ];
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body as { type?: string } & Record<string, string>;

    const validTypes: ToolType[] = ['translate', 'xiaohongshu', 'report', 'meeting'];
    if (!type || !validTypes.includes(type as ToolType)) {
      return NextResponse.json({ error: '无效的工具类型' }, { status: 400 });
    }

    // 参数校验
    const needText = (type === 'translate' && !params.text?.trim()) || (type === 'report' && !params.content?.trim()) || (type === 'meeting' && !params.content?.trim());
    if (needText) {
      return NextResponse.json({ error: '请填写内容' }, { status: 400 });
    }
    if (type === 'xiaohongshu' && !params.topic?.trim()) {
      return NextResponse.json({ error: '请填写主题' }, { status: 400 });
    }

    const messages = buildMessages(type as ToolType, params);
    const content = await callDeepSeek(messages);

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error in ai-tools API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '请求处理失败' },
      { status: 500 }
    );
  }
}
