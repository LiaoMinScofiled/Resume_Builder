interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 调用 DeepSeek API（服务端）
 * @param messages 消息数组
 * @returns 生成的文本内容
 */
export async function callDeepSeek(messages: DeepSeekMessage[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 DEEPSEEK_API_KEY');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('DeepSeek API error:', errorData);
    throw new Error(
      `DeepSeek API 错误: ${(errorData as { error?: { message?: string } }).error?.message || response.status}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('DeepSeek 返回内容为空');
  }

  return content;
}
