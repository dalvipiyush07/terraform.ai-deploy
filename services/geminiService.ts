
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private messages: Array<{role: string, content: string}> = [];

  resetChat() {
    this.messages = [];
  }

  async *generateTerraformStream(prompt: string) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const apiUrl = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    const model = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined");
    }
    
    this.messages.push({ role: 'user', content: prompt });
    
    // Keep only last 4 messages to avoid context length issues
    const recentMessages = this.messages.slice(-4);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...recentMessages
        ],
        temperature: 0.1,
        max_tokens: 8000,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {}
        }
      }
    }
  }
}

export const geminiService = new GeminiService();
