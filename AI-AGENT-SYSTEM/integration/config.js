const fs = require('fs');
const path = require('path');

const defaultConfig = {
  agentConfig: {
    enableLearning: true,
    enablePersonalization: true,
    evaluationInterval: 100,
    taskProcessingTimeout: 30000,
    maxRetries: 3
  },
  memory: {
    apiKey: process.env.VECTOR_DB_API_KEY || null,
    environment: process.env.VECTOR_ENV || 'production',
    indexName: process.env.VECTOR_INDEX_NAME || 'ai-agent-memory',
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    openaiKey: process.env.OPENAI_API_KEY || null,
    maxMemoryAge: 7776000000,
    minRelevanceScore: 0.6
  },
  evaluation: {
    successRateThreshold: 0.8,
    avgConfidenceThreshold: 0.75,
    userSatisfactionThreshold: 4.0,
    maxExecutionTimeThreshold: 5000,
    evaluationWindow: 100
  },
  feedback: {
    learningRate: 0.1,
    minFeedbackCount: 10,
    ratingWeight: 0.5,
    correctionWeight: 0.3,
    helpfulWeight: 0.2
  },
  privacy: {
    encryptionKey: process.env.ENCRYPTION_KEY || null,
    dataRetentionDays: 90,
    safetyRules: {
      allowDataCollection: false,
      allowPersonalization: false,
      allowFeedbackLearning: false,
      blockSensitiveData: {
        enabled: true,
        patterns: ['password', 'credit card', 'ssn', 'private key', 'token']
      },
      contentFilter: {
        enabled: true,
        blockedCategories: ['hate speech', 'violence', 'adult content', 'misinformation']
      },
      rateLimit: {
        enabled: true,
        requestsPerMinute: 60,
        requestsPerHour: 1000
      },
      requiresExplicitConsent: {
        enabled: true,
        forDataCollection: true,
        forPersonalization: true,
        forFeedbackLearning: true
      }
    }
  }
};

let config = defaultConfig;
const configPath = path.resolve(__dirname, 'config.json');

if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    config = {
      ...config,
      ...parsed,
      memory: {
        ...config.memory,
        ...parsed.memory
      },
      evaluation: {
        ...config.evaluation,
        ...parsed.evaluation
      },
      feedback: {
        ...config.feedback,
        ...parsed.feedback
      },
      privacy: {
        ...config.privacy,
        ...parsed.privacy
      }
    };
  } catch (error) {
    console.warn('Failed to parse integration/config.json, using defaults:', error.message);
  }
}

module.exports = config;
