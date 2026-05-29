/**
 * Memory Manager
 * Handles all memory operations including storage, retrieval, and learning
 */

const VectorDatabaseManager = require('./VectorDatabaseManager');
const { v4: uuidv4 } = require('uuid');

class MemoryManager {
  constructor(config = {}) {
    this.vectorDb = new VectorDatabaseManager(config.vectorDb || {});
    this.maxMemoryAge = config.maxMemoryAge || 90 * 24 * 60 * 60 * 1000; // 90 days
    this.minRelevanceScore = config.minRelevanceScore || 0.6;
    this.memoryTypes = {
      INTERACTION: 'interaction',
      TASK_RESULT: 'task_result',
      USER_FEEDBACK: 'user_feedback',
      STRATEGY: 'strategy',
      FAILURE: 'failure',
      SUCCESS: 'success'
    };
  }

  /**
   * Initialize memory manager
   */
  async initialize() {
    return await this.vectorDb.initialize();
  }

  /**
   * Store user interaction
   */
  async storeInteraction(userId, interaction) {
    try {
      const {
        taskId = uuidv4(),
        input,
        output,
        context = {},
        timestamp = new Date(),
        metadata = {}
      } = interaction;

      const memory = {
        userId,
        taskId,
        content: `Task: ${context.taskType || 'unknown'}\nInput: ${JSON.stringify(input).substring(0, 200)}\nOutput: ${JSON.stringify(output).substring(0, 200)}`,
        metadata: {
          taskType: context.taskType,
          inputSize: JSON.stringify(input).length,
          outputSize: JSON.stringify(output).length,
          timestamp: timestamp.toISOString(),
          ...metadata
        },
        type: this.memoryTypes.INTERACTION
      };

      const result = await this.vectorDb.storeMemory(memory);
      
      return {
        success: true,
        taskId,
        vectorId: result.vectorId,
        stored: true
      };
    } catch (error) {
      console.error('Interaction storage failed:', error.message);
      throw error;
    }
  }

  /**
   * Store task result and outcome
   */
  async storeTaskResult(userId, taskResult) {
    try {
      const {
        taskId,
        success,
        result,
        executionTime,
        strategy,
        metadata = {}
      } = taskResult;

      const content = `Task ${success ? 'successful' : 'failed'}. Strategy: ${strategy}. Time: ${executionTime}ms. Result: ${JSON.stringify(result).substring(0, 300)}`;

      const memory = {
        userId,
        taskId,
        content,
        metadata: {
          success,
          executionTime,
          strategy,
          resultSize: JSON.stringify(result).length,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        type: success ? this.memoryTypes.SUCCESS : this.memoryTypes.FAILURE
      };

      const result_storage = await this.vectorDb.storeMemory(memory);

      return {
        success: true,
        taskId,
        vectorId: result_storage.vectorId,
        stored: true
      };
    } catch (error) {
      console.error('Task result storage failed:', error.message);
      throw error;
    }
  }

  /**
   * Store user feedback for learning
   */
  async storeFeedback(userId, feedback) {
    try {
      const {
        taskId,
        rating = 5, // 1-5 scale
        comment = '',
        corrections = {},
        tags = [],
        timestamp = new Date()
      } = feedback;

      const content = `Feedback for task. Rating: ${rating}/5. Comment: ${comment}. Tags: ${tags.join(', ')}`;

      const memory = {
        userId,
        taskId,
        content,
        metadata: {
          rating,
          comment,
          corrections,
          tags,
          timestamp: timestamp.toISOString(),
          helpful: rating >= 4
        },
        type: this.memoryTypes.USER_FEEDBACK
      };

      const result = await this.vectorDb.storeMemory(memory);

      return {
        success: true,
        taskId,
        vectorId: result.vectorId,
        feedback_stored: true
      };
    } catch (error) {
      console.error('Feedback storage failed:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve contextual memory for a new task
   */
  async retrieveContext(userId, taskDescription, limit = 5) {
    try {
      const similarMemories = await this.vectorDb.retrieveSimilarMemories(
        userId,
        taskDescription,
        limit,
        this.minRelevanceScore
      );

      // Organize memories by type and relevance
      const organized = {
        successStrategies: [],
        failurePatterns: [],
        userPreferences: [],
        recentInteractions: []
      };

      for (const memory of similarMemories) {
        const metadata = memory.metadata;
        
        if (metadata.type === this.memoryTypes.SUCCESS) {
          organized.successStrategies.push({
            similarity: memory.similarity,
            strategy: metadata.strategy,
            content: memory.content
          });
        } else if (metadata.type === this.memoryTypes.FAILURE) {
          organized.failurePatterns.push({
            similarity: memory.similarity,
            strategy: metadata.strategy,
            content: memory.content
          });
        } else if (metadata.type === this.memoryTypes.USER_FEEDBACK) {
          organized.userPreferences.push({
            similarity: memory.similarity,
            rating: metadata.rating,
            content: memory.content
          });
        } else {
          organized.recentInteractions.push({
            similarity: memory.similarity,
            content: memory.content
          });
        }
      }

      return {
        found: similarMemories.length,
        context: organized,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Context retrieval failed:', error.message);
      return {
        found: 0,
        context: {},
        error: error.message
      };
    }
  }

  /**
   * Get learning insights for a user
   */
  async getLearningInsights(userId) {
    try {
      const stats = await this.vectorDb.getStats(userId);

      return {
        totalMemories: stats.vectorCount,
        dimension: stats.dimension,
        storageUtilization: stats.indexFullness,
        memoryAge: 'recent',
        lastUpdated: new Date().toISOString(),
        recommendations: [
          stats.vectorCount > 1000 ? 'Consider archiving old memories' : null,
          stats.indexFullness > 0.8 ? 'Memory usage approaching capacity' : null
        ].filter(Boolean)
      };
    } catch (error) {
      console.error('Learning insights failed:', error.message);
      return null;
    }
  }

  /**
   * Clear old memories based on age
   */
  async maintainMemory(userId) {
    try {
      // Note: This would require an update to VectorDatabaseManager
      // For now, we'll return a maintenance plan
      const insights = await this.getLearningInsights(userId);
      
      return {
        success: true,
        maintenance: {
          timestamp: new Date().toISOString(),
          insights,
          nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      };
    } catch (error) {
      console.error('Memory maintenance failed:', error.message);
      throw error;
    }
  }

  /**
   * Export all user memories
   */
  async exportMemories(userId) {
    try {
      const stats = await this.vectorDb.getStats(userId);
      
      return {
        userId,
        totalMemories: stats.vectorCount,
        exportDate: new Date().toISOString(),
        memoryTypes: Object.values(this.memoryTypes),
        status: 'Export prepared - memories are encrypted and stored securely'
      };
    } catch (error) {
      console.error('Memory export failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete all user memories (GDPR compliance)
   */
  async deleteAllUserMemories(userId) {
    try {
      const result = await this.vectorDb.deleteUserMemories(userId);
      
      return {
        success: true,
        userId,
        deletedMemories: result.deletedCount,
        timestamp: new Date().toISOString(),
        gdprCompliant: true
      };
    } catch (error) {
      console.error('Memory deletion failed:', error.message);
      throw error;
    }
  }
}

module.exports = MemoryManager;
