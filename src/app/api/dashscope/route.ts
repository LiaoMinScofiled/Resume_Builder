import { NextRequest, NextResponse } from 'next/server';

interface DashScopeRequest {
  content: string;
  model?: string;
}

/**
 * Server-side API route for DashScope text generation
 * This avoids CORS issues by making the API call from the server
 */
export async function POST(request: NextRequest) {
  try {
    const body: DashScopeRequest = await request.json();
    const { content, model = 'qwen-plus' } = body;

    const apiKey = process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'DashScope API key is not configured. Please set NEXT_PUBLIC_DASHSCOPE_API_KEY in .env file.' },
        { status: 500 }
      );
    }
    
    const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    
    const data = {
      model,
      input: {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content
          }
        ]
      },
      parameters: {
        result_format: "message"
      }
    };

    console.log('Calling DashScope API from server-side');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DashScope API error:', errorData);
      return NextResponse.json(
        { error: `API error: ${errorData.message || 'Unknown error'}`, status: response.status },
        { status: response.status }
      );
    }
    
    const responseData = await response.json();
    
    if (responseData.output && responseData.output.choices && responseData.output.choices.length > 0) {
      return NextResponse.json({
        success: true,
        content: responseData.output.choices[0].message.content
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid response from DashScope API: no choices found' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error in dashscope API route:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
