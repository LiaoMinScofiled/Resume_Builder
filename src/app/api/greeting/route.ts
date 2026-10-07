import { NextRequest, NextResponse } from 'next/server';

interface GreetingRequest {
  platform: 'boss' | 'linkedin' | 'maimai';
  position: string;
  resume: string;
  outputLanguage: 'zh' | 'en';
}

const PLATFORM_NAMES: Record<GreetingRequest['platform'], { zh: string; en: string }> = {
  boss: { zh: 'Boss直聘', en: 'Boss Zhipin' },
  linkedin: { zh: 'LinkedIn', en: 'LinkedIn' },
  maimai: { zh: '脉脉', en: 'Maimai' },
};

const PLATFORM_STYLE: Record<GreetingRequest['platform'], string> = {
  boss: 'Boss直聘：聊天式开场，简洁直接、口语化，突出职位亮点与对候选人经历的认可，控制在 100 字以内，结尾带一个引导回复的问句。',
  linkedin: 'LinkedIn：专业正式的社交语气，结构清晰（称呼-来意-匹配点-邀约），可适当使用行业术语，控制在 150 字以内。',
  maimai: '脉脉：行业社交语气，强调同行交流与人脉连接，先建立共同话题（行业/公司/技能），再自然引出机会，控制在 120 字以内。',
};

function buildPrompt(req: GreetingRequest): string {
  const lang = req.outputLanguage === 'zh' ? '中文' : 'English';
  return `你是一名资深招聘专家（HR），擅长根据候选人简历撰写个性化、有温度的打招呼话术。

目标平台：${PLATFORM_NAMES[req.platform].zh}
平台话术风格要求：${PLATFORM_STYLE[req.platform]}
招聘岗位：${req.position || '（未提供，请根据简历推断合适岗位方向）'}
输出语言：${lang}

候选人简历：
"""
${req.resume}
"""

要求：
1. 从简历中提取 1-2 个具体亮点（公司、项目、技能、成果），在话术中自然提及，体现"认真看过简历"。
2. 不要编造简历中不存在的信息。
3. 生成 3 个不同风格版本的话术，分别标注为：
【版本一：专业稳重】
【版本二：亲切热情】
【版本三：简洁高效】
4. 每个版本单独成段，不要额外解释。`;
}

export async function POST(request: NextRequest) {
  try {
    const body: GreetingRequest = await request.json();
    const { platform, position = '', resume, outputLanguage = 'zh' } = body;

    if (!resume || !resume.trim()) {
      return NextResponse.json({ error: '请粘贴候选人简历内容' }, { status: 400 });
    }

    if (!['boss', 'linkedin', 'maimai'].includes(platform)) {
      return NextResponse.json({ error: '无效的平台参数' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'DeepSeek API Key 未配置，请在 .env 文件中设置 DEEPSEEK_API_KEY' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一名资深招聘专家，精通各招聘平台的沟通风格，擅长撰写高回复率的个性化打招呼话术。',
          },
          { role: 'user', content: buildPrompt({ platform, position, resume, outputLanguage }) },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: `DeepSeek API 错误: ${(errorData as { error?: { message?: string } }).error?.message || response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'DeepSeek 返回内容为空' }, { status: 500 });
    }

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error in greeting API route:', error);
    return NextResponse.json(
      { error: `请求处理失败: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
