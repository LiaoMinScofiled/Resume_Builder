// import fetch from 'node-fetch';

interface DashScopeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Call DashScope API for text generation
 * @param content User input content
 * @param model Model name (default: qwen-plus)
 * @returns Generated text
 */
export async function callDashScopeAPI(content: string, model: string = 'qwen-plus'): Promise<string> {
  try {
    console.log('Calling DashScope API (server-side route)');
    console.log('Content:', content);
    console.log('Model:', model);
    
    // Call our server-side API route instead of direct external API
    const response = await fetch('/api/dashscope', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, model })
    });
    
    console.log('Server API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server API Error:', errorData);
      throw new Error(`Server API error: ${errorData.error || `HTTP status ${response.status}`}`);
    }
    
    const responseData = await response.json();
    console.log('Server API Response data:', responseData);
    
    if (responseData.success && responseData.content) {
      return responseData.content;
    }
    
    throw new Error('Invalid response from server API: ' + (responseData.error || 'No content found'));
  } catch (error) {
    console.error('Error calling DashScope API:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    throw new Error(`Failed to call DashScope API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Call DashScope API with multi-turn conversation
 * @param messages Array of messages
 * @param model Model name (default: qwen-plus)
 * @returns Generated text
 */
export async function callDashScopeWithMessages(
  messages: DashScopeMessage[],
  model: string = 'qwen-plus'
): Promise<string> {
  try {
    console.log('Calling DashScope API with messages (server-side route)');
    console.log('Messages:', messages);
    console.log('Model:', model);
    
    // For multi-turn conversations, we need to extract the latest user message
    // and prepend the system message if it doesn't exist
    const systemMessage = messages.find(msg => msg.role === 'system');
    const userMessages = messages.filter(msg => msg.role === 'user');
    
    if (userMessages.length === 0) {
      throw new Error('No user message found in messages array');
    }
    
    // Combine messages into a single content string for the server API
    let content = '';
    if (systemMessage) {
      content += `[System]: ${systemMessage.content}\n\n`;
    }
    
    userMessages.forEach((msg, index) => {
      content += `[User ${index + 1}]: ${msg.content}\n\n`;
    });
    
    // Call our server-side API route
    const response = await fetch('/api/dashscope', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, model })
    });
    
    console.log('Server API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server API Error:', errorData);
      throw new Error(`Server API error: ${errorData.error || `HTTP status ${response.status}`}`);
    }
    
    const responseData = await response.json();
    console.log('Server API Response data:', responseData);
    
    if (responseData.success && responseData.content) {
      return responseData.content;
    }
    
    throw new Error('Invalid response from server API: ' + (responseData.error || 'No content found'));
  } catch (error) {
    console.error('Error calling DashScope API with messages:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    throw new Error(`Failed to call DashScope API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
