import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

type ToolType = 'jd' | 'highlights' | 'interview' | 'polish';

const SYSTEM_PROMPT =
  '你是一名资深 HR 与招聘专家，精通招聘全流程，擅长撰写职位描述、解析简历、设计面试题与润色简历，输出内容专业、结构清晰、可直接使用。';

function buildMessages(type: ToolType, body: Record<string, string>): { role: 'system' | 'user'; content: string }[] {
  const system = { role: 'system' as const, content: SYSTEM_PROMPT };

  switch (type) {
    case 'jd': {
      const { position, keywords = '', company = '' } = body;
      const user = `请为以下岗位生成一份完整、专业的职位描述（JD）。

岗位名称：${position}
${company ? `公司/行业：${company}` : ''}
${keywords ? `关键词/核心要求：${keywords}` : ''}

请严格按照以下结构输出（使用 Markdown）：
## 职位名称
## 岗位职责
（列出 5-7 条，使用编号列表，具体可执行）
## 任职要求
（列出 5-7 条，区分「必备」与「加分项」）
## 薪资范围
（给出一个合理的参考范围，如 20k-35k）
## 福利待遇
（列出 3-5 条）

要求：内容具体、可落地，避免空话套话，符合国内互联网行业招聘习惯。`;
      return [system, { role: 'user', content: user }];
    }

    case 'highlights': {
      const { resume } = body;
      const user = `请分析以下候选人简历，提炼出核心亮点、关键词和技能标签。

简历内容：
"""
${resume}
"""

请严格按照以下结构输出（使用 Markdown）：
## 核心亮点
（提炼 3-5 条最有竞争力的亮点，每条一句话，量化成果优先）
## 关键词标签
（用逗号分隔的 10-15 个关键词，如：高并发、微服务、团队管理）
## 技能标签
（按类别分组列出，如：语言 / 框架 / 工具 / 数据库）
## 一句话评价
（用一句话概括该候选人的核心竞争力）

要求：客观准确，不编造简历中不存在的信息，突出可量化的成果。`;
      return [system, { role: 'user', content: user }];
    }

    case 'interview': {
      const { position, resume } = body;
      const user = `请根据以下岗位和候选人简历，设计一套针对性强的面试问题。

招聘岗位：${position || '（未提供，请根据简历推断）'}

候选人简历：
"""
${resume}
"""

请严格按照以下结构输出（使用 Markdown）：
## 技术能力考察
（4-6 个问题，针对简历中的技术栈和项目深挖）
## 项目经验深挖
（4-5 个问题，针对具体项目问细节、难点、决策）
## 行为与软技能
（3-4 个问题，考察沟通协作、抗压、成长）
## 岗位匹配度
（3-4 个问题，考察求职动机、职业规划、稳定性）
## 面试官追问技巧
（2-3 条针对该候选人可能答不上来的点的追问建议）

要求：问题要具体、有深度，能真正区分候选人水平，避免泛泛而谈。`;
      return [system, { role: 'user', content: user }];
    }

    case 'polish': {
      const { resume } = body;
      const user = `请对以下候选人简历进行润色改写，使其表达更专业、更书面化，去除口语化表达，突出成果与能力。

原始简历：
"""
${resume}
"""

请严格按照以下结构输出（使用 Markdown）：
## 润色后的简历
（完整输出润色后的简历正文）
## 主要修改点
（列出 3-5 条关键修改说明，说明改了哪里、为什么改）

要求：
1. 保持原意，不编造或夸大事实。
2. 使用 STAR 法则（情境-任务-行动-结果）优化项目/工作描述。
3. 量化成果，将「负责了」「参与了」改为「主导」「落地」等有力动词。
4. 去除口语化、冗余表述，语言简洁专业。`;
      return [system, { role: 'user', content: user }];
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body as { type?: string } & Record<string, string>;

    const validTypes: ToolType[] = ['jd', 'highlights', 'interview', 'polish'];
    if (!type || !validTypes.includes(type as ToolType)) {
      return NextResponse.json({ error: '无效的工具类型' }, { status: 400 });
    }

    // 参数校验
    if (type === 'jd' && !params.position?.trim()) {
      return NextResponse.json({ error: '请填写岗位名称' }, { status: 400 });
    }
    if ((type === 'highlights' || type === 'polish') && !params.resume?.trim()) {
      return NextResponse.json({ error: '请粘贴候选人简历内容' }, { status: 400 });
    }
    if (type === 'interview' && !params.resume?.trim()) {
      return NextResponse.json({ error: '请粘贴候选人简历内容' }, { status: 400 });
    }

    const messages = buildMessages(type as ToolType, params);
    const content = await callDeepSeek(messages);

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error in hr-tools API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '请求处理失败' },
      { status: 500 }
    );
  }
}
