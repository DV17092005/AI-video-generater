/**
 * Core AI Agent
 * Orchestrates memory, evaluation, feedback, and privacy systems
 */

const MemoryManager = require('../memory/MemoryManager');
const PerformanceEvaluator = require('../evaluation/PerformanceEvaluator');
const FeedbackManager = require('../feedback/FeedbackManager');
const PrivacyManager = require('../privacy/PrivacyManager');
const PromptManager = require('../prompts/PromptManager');
const LLMClient = require('./LLMClient');
const AgentUtils = require('../utils/AgentUtils');
const { v4: uuidv4 } = require('uuid');

class AIAgent {
  constructor(config = {}) {
    this.agentId = config.agentId || `agent_${uuidv4()}`;
    this.version = '1.0.0';
    
    // Initialize sub-systems
    this.memory = new MemoryManager(config.memory || {});
    this.evaluator = new PerformanceEvaluator(config.evaluation || {});
    this.feedback = new FeedbackManager(config.feedback || {});
    this.privacy = new PrivacyManager(config.privacy || {});
    this.promptManager = new PromptManager(config.prompt || {});
    this.llm = new LLMClient(config.llm || {});
    
    // Configuration
    this.config = {
      enableLearning: config.enableLearning !== false,
      enablePersonalization: config.enablePersonalization !== false,
      evaluationInterval: config.evaluationInterval || 100, // Evaluate every N tasks
      taskProcessingTimeout: config.taskProcessingTimeout || 30000, // 30 seconds
      maxRetries: config.maxRetries || 3
    };

    this.taskQueue = [];
    this.activeSession = null;
    this.initialized = false;

    console.log(`✓ AI Agent initialized: ${this.agentId}`);
  }

  /**
   * Initialize all subsystems
   */
  async initialize() {
    try {
      console.log('Initializing AI Agent subsystems...');
      
      // Initialize memory system
      const memoryInitialized = await this.memory.initialize();
      if (!memoryInitialized) {
        console.warn('Memory manager initialization failed, continuing with degraded mode');
      }

      this.initialized = true;
      console.log('✓ All subsystems initialized');

      return {
        success: true,
        agentId: this.agentId,
        subsystems: {
          memory: memoryInitialized,
          privacy: true // Privacy manager doesn't need network init
        }
      };
    } catch (error) {
      console.error('Initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Process user request with full learning pipeline
   */
  async process(request) {
    const taskId = request.taskId || AgentUtils.generateTaskId();
    const startTime = Date.now();

    try {
      // Step 1: Validate and sanitize input
      const validation = this.validateRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          taskId,
          error: 'Request validation failed',
          details: validation.errors
        };
      }

      // Step 2: Privacy checks
      const privacyCheck = this.privacy.isActionAllowed(request.userId, 'dataCollection');
      if (!privacyCheck.allowed && this.config.enableLearning) {
        console.warn(`User ${request.userId} has not consented to data collection`);
      }

      // Step 3: Retrieve contextual memories
      let contextualMemory = null;
      if (this.memory.vectorDb.initialized && this.config.enablePersonalization) {
        contextualMemory = await this.memory.retrieveContext(
          request.userId,
          request.taskDescription || JSON.stringify(request.input),
          5
        );
      }

      // Step 4: Prepare prompt and strategy based on memory and mode
      const promptName = request.promptName || (request.voiceMode ? 'voice_assistant' : 'default');
      const promptInstructions = this.promptManager.getPrompt(promptName);
      const strategy = this.selectStrategy(request, contextualMemory, promptInstructions);

      // Step 5: Execute task
      const taskResult = await this.executeTask(request, strategy, promptInstructions, promptName);

      // Step 6: Record execution
      this.evaluator.recordExecution({
        taskId,
        success: taskResult.success,
        confidence: taskResult.confidence || 0.5,
        executionTime: Date.now() - startTime,
        strategy: strategy.name,
        error: taskResult.error
      });

      // Step 7: Store interaction in memory
      if (privacyCheck.allowed && this.config.enableLearning) {
        await this.memory.storeInteraction(request.userId, {
          taskId,
          input: request.input,
          output: taskResult.result,
          context: { taskType: request.taskType },
          timestamp: new Date()
        });
      }

      // Step 8: Periodic evaluation
      if (this.evaluator.metrics.taskSuccess.total % this.config.evaluationInterval === 0) {
        this.performPeriodicEvaluation(request.userId);
      }

      const response = {
        success: true,
        taskId,
        result: taskResult.result,
        confidence: taskResult.confidence,
        executionTime: Date.now() - startTime,
        learned: privacyCheck.allowed && this.config.enableLearning,
        strategy: strategy.name,
        prompt: request.promptName || (request.voiceMode ? 'voice_assistant' : 'default'),
        promptInstructions: promptInstructions.slice(0, 1200),
        insights: {
          contextUsed: contextualMemory && contextualMemory.found > 0,
          successStrategies: contextualMemory?.context.successStrategies?.length || 0,
          similarPastTasks: contextualMemory?.found || 0
        }
      };

      return response;
    } catch (error) {
      console.error(`Task ${taskId} failed:`, error.message);

      return {
        success: false,
        taskId,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Validate incoming request
   */
  validateRequest(request) {
    const errors = [];

    if (!request.userId) {
      errors.push('userId is required');
    } else if (!AgentUtils.isValidEmail(request.userId)) {
      // Optional email validation
      // errors.push('userId should be a valid email');
    }

    if (!request.taskType) {
      errors.push('taskType is required');
    }

    if (!request.input) {
      errors.push('input is required');
    }

    // Sanitize input
    if (request.input && typeof request.input === 'string') {
      request.input = AgentUtils.sanitizeInput(request.input);
    }

    // Check for sensitive data
    if (request.input) {
      const sensitiveCheck = this.privacy.scanForSensitiveData(
        JSON.stringify(request.input)
      );
      if (sensitiveCheck.isSensitive) {
        console.warn(`Sensitive data detected: ${sensitiveCheck.patternsFound.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Select strategy based on context and memory
   */
  selectStrategy(request, contextualMemory, promptInstructions) {
    let selectedStrategy = {
      name: request.taskType || 'default',
      priority: 0,
      personalized: false,
      promptInstructions
    };

    if (!contextualMemory || contextualMemory.found === 0) {
      return selectedStrategy;
    }

    // Find best performing strategy from memory
    const successStrategies = contextualMemory.context.successStrategies || [];
    if (successStrategies.length > 0) {
      const bestStrategy = successStrategies.reduce((best, current) => 
        current.similarity > (best.similarity || 0) ? current : best
      );

      selectedStrategy = {
        name: bestStrategy.strategy || 'optimized',
        priority: bestStrategy.similarity,
        personalized: true,
        basedOnPastSuccess: true
      };
    }

    // Avoid strategies that failed
    const failurePatterns = contextualMemory.context.failurePatterns || [];
    if (failurePatterns.length > 0) {
      selectedStrategy.avoidStrategies = failurePatterns.map(p => p.strategy);
    }

    return selectedStrategy;
  }

  /**
   * Execute the actual task
   */
  async executeTask(request, strategy, promptInstructions, promptName) {
    try {
      const taskText = typeof request.input === 'string'
        ? request.input
        : JSON.stringify(request.input, null, 2);

      const userPrompt = `Task: ${request.taskType}\nDescription: ${request.taskDescription || 'No description provided.'}\nInput:\n${taskText}`;

      const llmResult = await this.llm.generateResponse({
        systemPrompt: promptInstructions,
        userPrompt,
        context: request.context || '',
        model: request.model || this.llm.model,
        temperature: request.temperature,
        maxTokens: request.maxTokens
      });

      return {
        success: true,
        result: {
          taskType: request.taskType,
          output: llmResult.message,
          metadata: {
            model: llmResult.model,
            promptType: promptName,
            promptInstructions: (promptInstructions || '').slice(0, 1000),
            usage: llmResult.usage,
            strategy: strategy.name,
            personalized: strategy.personalized
          }
        },
        confidence: 0.9,
        llm: llmResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        confidence: 0
      };
    }
  }

  /**
   * Perform periodic evaluation and learning
   */
  async performPeriodicEvaluation(userId) {
    try {
      // Get current metrics
      const metrics = this.evaluator.getPerformanceMetrics();
      
      // Get improvement recommendations
      const recommendations = this.evaluator.getImprovementRecommendations();

      console.log(`\n📊 Periodic Evaluation - ${metrics.summary.successRate.toFixed(1)}% success rate`);

      // Learn from feedback if available
      const feedbackAnalysis = this.feedback.getFeedbackStats();
      if (feedbackAnalysis.totalFeedback >= this.feedback.minFeedbackCount) {
        const learning = this.feedback.learnFromFeedback();
        console.log(`📚 Learning from ${learning.feedbackProcessed} feedback entries`);
      }

      // Store evaluation in memory
      if (userId && this.memory.vectorDb.initialized) {
        await this.memory.storeTaskResult(userId, {
          taskId: `evaluation_${uuidv4()}`,
          success: metrics.summary.successRate > 0.8,
          result: metrics,
          executionTime: 0,
          strategy: 'evaluation',
          metadata: {
            recommendations: recommendations.length,
            health: metrics.health.status
          }
        });
      }

      return {
        timestamp: new Date().toISOString(),
        metrics: metrics.summary,
        health: metrics.health,
        recommendations: recommendations.slice(0, 3),
        feedbackAnalyzed: feedbackAnalysis.totalFeedback
      };
    } catch (error) {
      console.error('Periodic evaluation failed:', error.message);
      return null;
    }
  }

  /**
   * Submit feedback for a task
   */
  async submitFeedback(taskId, feedbackData) {
    try {
      const feedback = this.feedback.submitFeedback({
        taskId,
        ...feedbackData
      });

      // Record in evaluator
      this.evaluator.recordFeedback(taskId, feedbackData);

      // Store feedback in memory
      if (feedbackData.userId && this.memory.vectorDb.initialized) {
        await this.memory.storeFeedback(feedbackData.userId, {
          taskId,
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          corrections: feedbackData.corrections,
          tags: feedbackData.tags
        });
      }

      return {
        success: true,
        taskId,
        feedbackRecorded: true,
        message: 'Feedback submitted and processed'
      };
    } catch (error) {
      console.error('Feedback submission failed:', error.message);
      throw error;
    }
  }

  /**
   * Get agent status and insights
   */
  async getStatus(userId = null) {
    try {
      const metrics = this.evaluator.getPerformanceMetrics();
      const recommendations = this.evaluator.getImprovementRecommendations();
      
      let memoryInsights = null;
      if (userId && this.memory.vectorDb.initialized) {
        memoryInsights = await this.memory.getLearningInsights(userId);
      }

      const feedbackStats = this.feedback.getFeedbackStats();
      const privacyReport = this.privacy.getComplianceReport();

      return {
        agentId: this.agentId,
        version: this.version,
        initialized: this.initialized,
        timestamp: new Date().toISOString(),
        performance: {
          metrics: metrics.summary,
          health: metrics.health,
          recommendations: recommendations.slice(0, 5)
        },
        learning: {
          memory: memoryInsights,
          feedback: feedbackStats
        },
        compliance: privacyReport
      };
    } catch (error) {
      console.error('Status retrieval failed:', error.message);
      return {
        error: error.message,
        agentId: this.agentId
      };
    }
  }

  /**
   * Export all user data (GDPR)
   */
  async exportUserData(userId) {
    try {
      const privacyExport = this.privacy.exportUserData(userId);
      const memoryExport = await this.memory.exportMemories(userId);
      const feedbackExport = this.feedback.getTaskFeedback(userId);

      return {
        timestamp: new Date().toISOString(),
        userId,
        exports: {
          privacy: privacyExport,
          memory: memoryExport,
          feedback: feedbackExport
        },
        gdprCompliant: true
      };
    } catch (error) {
      console.error('Data export failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete all user data
   */
  async deleteUserData(userId) {
    try {
      const privacyDelete = this.privacy.deleteUserData(userId);
      const memoryDelete = await this.memory.deleteAllUserMemories(userId);
      const feedbackDelete = this.feedback.clearFeedbackHistory(userId);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        userId,
        deletions: {
          privacy: privacyDelete,
          memory: memoryDelete,
          feedback: feedbackDelete
        },
        gdprCompliant: true,
        message: 'All user data has been permanently deleted'
      };
    } catch (error) {
      console.error('Data deletion failed:', error.message);
      throw error;
    }
  }

  /**
   * Set user consent preferences
   */
  setUserConsent(userId, consentData) {
    return this.privacy.setUserConsent(userId, consentData);
  }

  /**
   * Get user consent preferences
   */
  getUserConsent(userId) {
    return this.privacy.getUserConsent(userId);
  }
}

module.exports = AIAgent;
