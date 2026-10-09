import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

type ToolType = 'jd' | 'highlights' | 'interview' | 'polish' | 'roast';

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
      const { resume, focus = '' } = body;
      const user = `请对以下候选人简历进行润色改写，使其表达更专业、更书面化，去除口语化表达，突出成果与能力。

原始简历：
"""
${resume}
"""
${focus ? `
重点优化方向（来自简历毒舌诊断，请针对性解决这些问题）：
${focus}
` : ''}
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

    case 'roast': {
      const { resume, position = '', lang = 'zh' } = body;
      const langDesc = lang === 'en' ? '英文' : '中文';
      const user = `请以毒舌 HR 的风格诊断以下简历，给出犀利、扎心但专业的评价。

目标岗位：${position || '（未指定，请根据简历推断）'}

简历内容：
"""
${resume}
"""

要求：
1. 只输出一个 JSON 对象，不要 markdown 代码块标记，不要任何解释文字。
2. 除 JSON 的 key 外，所有评语文本使用${langDesc}输出。
3. JSON 结构如下：
{
  "score": <0-100 整数总分>,
  "grade": "<S|A|B|C|D>",
  "verdict": "<一句话毒舌总评，30字以内，犀利幽默>",
  "dimensions": [
    { "name": "内容质量", "score": 0, "comment": "<毒舌点评，40字以内>" },
    { "name": "量化成果", "score": 0, "comment": "<毒舌点评，40字以内>" },
    { "name": "关键词密度", "score": 0, "comment": "<毒舌点评，40字以内>" },
    { "name": "格式规范", "score": 0, "comment": "<毒舌点评，40字以内>" },
    { "name": "岗位竞争力", "score": 0, "comment": "<毒舌点评，40字以内>" }
  ],
  "roasts": ["<毒舌吐槽 3-5 条，一针见血且具体到简历原文>"],
  "suggestions": ["<可执行的修改建议 3-5 条，具体到怎么改>"],
  "missingKeywords": ["<这份简历缺失的高频关键词，0-8 个>"]
}
4. 毒舌但不人身攻击，所有吐槽必须指向简历内容本身。
5. 评分要严格：70 分以上代表优秀，大多数普通简历应在 40-65 之间。
6. 建议必须具体可落地，能直接指导修改。`;
      return [
        {
          role: 'system',
          content:
            '你是一名以「毒舌」著称的资深 HR 总监，阅简历无数，点评犀利扎心但专业中肯。毒舌是为了让候选人进步，绝不空洞攻击，你的点评在网上被求职者疯传。',
        },
        { role: 'user', content: user },
      ];
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body as { type?: string } & Record<string, string>;

    const validTypes: ToolType[] = ['jd', 'highlights', 'interview', 'polish', 'roast'];
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
    if (type === 'roast' && !params.resume?.trim()) {
      return NextResponse.json({ error: '请粘贴简历内容' }, { status: 400 });
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
