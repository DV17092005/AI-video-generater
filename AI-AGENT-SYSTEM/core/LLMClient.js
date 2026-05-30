/**
 * LLM Client
 * Provides a simple wrapper around OpenAI chat completions.
 */

const axios = require('axios');

class LLMClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 800;
    this.timeout = config.timeout || 30000;
    this.disabled = !this.apiKey;

    if (this.disabled) {
      console.warn('LLMClient disabled: OPENAI_API_KEY is not configured. AI features will be unavailable.');
    }
  }

  async createChatCompletion({ messages, model, temperature, maxTokens }) {
    if (this.disabled) {
      throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in your environment to enable AI features.');
    }

    const payload = {
      model: model || this.model,
      messages,
      temperature: temperature ?? this.temperature,
      max_tokens: maxTokens || this.maxTokens,
      n: 1
    };

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      payload,
      {
        headers,
        timeout: this.timeout
      }
    );

    const data = response.data;
    const message = data.choices?.[0]?.message?.content;
    return {
      id: data.id,
      model: data.model,
      message: message?.trim() || '',
      usage: data.usage || {}
    };
  }

  buildMessages({ systemPrompt, userPrompt, context, history = [] }) {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    for (const entry of history) {
      if (entry.role && entry.content) {
        messages.push(entry);
      }
    }

    if (context) {
      messages.push({ role: 'user', content: `Context: ${context}` });
    }

    if (userPrompt) {
      messages.push({ role: 'user', content: userPrompt });
    }

    return messages;
  }

  async generateResponse({ systemPrompt, userPrompt, context, history, model, temperature, maxTokens }) {
    const messages = this.buildMessages({ systemPrompt, userPrompt, context, history });
    return await this.createChatCompletion({ messages, model, temperature, maxTokens });
  }
}

module.exports = LLMClient;
