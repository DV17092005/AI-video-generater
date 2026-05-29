/**
 * Index.js - Entry point for AI Agent System
 */

const AIAgent = require('./core/AIAgent');
const MemoryManager = require('./memory/MemoryManager');
const PerformanceEvaluator = require('./evaluation/PerformanceEvaluator');
const FeedbackManager = require('./feedback/FeedbackManager');
const PrivacyManager = require('./privacy/PrivacyManager');
const AgentUtils = require('./utils/AgentUtils');

module.exports = {
  AIAgent,
  MemoryManager,
  PerformanceEvaluator,
  FeedbackManager,
  PrivacyManager,
  AgentUtils,
  
  // Initialize function
  async createAgent(config) {
    const agent = new AIAgent(config);
    await agent.initialize();
    return agent;
  }
};
