/**
 * Prompt Manager
 * Provides reusable prompt templates for the AI agent.
 */

const voiceAssistantPrompt = require('./VoiceAssistantPrompt');
const defaultPrompt = require('./DefaultPrompt');

class PromptManager {
  constructor(config = {}) {
    this.defaultPromptName = (config.defaultPromptName || 'default').toLowerCase();
    this.prompts = {
      voice_assistant: voiceAssistantPrompt,
      voice: voiceAssistantPrompt,
      default: defaultPrompt
    };
  }

  getPrompt(promptName) {
    const normalized = (promptName || this.defaultPromptName).toLowerCase();
    return this.prompts[normalized] || this.prompts[this.defaultPromptName];
  }
}

module.exports = PromptManager;
