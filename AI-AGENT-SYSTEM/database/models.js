/**
 * MongoDB Models for AI Agent System
 * Optional persistence layer for storing metrics and learning data
 */

const mongoose = require('mongoose');

// ==========================================
// Task Execution Record Schema
// ==========================================
const taskExecutionSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    taskType: { type: String, required: true },
    success: { type: Boolean, required: true },
    confidence: { type: Number, min: 0, max: 1 },
    executionTime: { type: Number },
    strategy: { type: String },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    error: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { collection: 'task_executions' }
);

// ==========================================
// User Feedback Schema
// ==========================================
const userFeedbackSchema = new mongoose.Schema(
  {
    feedbackId: { type: String, required: true, unique: true },
    taskId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    helpfulness: { type: Boolean },
    corrections: { type: mongoose.Schema.Types.Mixed },
    tags: [String],
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    processed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { collection: 'user_feedback' }
);

// ==========================================
// Performance Metrics Schema
// ==========================================
const performanceMetricsSchema = new mongoose.Schema(
  {
    metricsId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    period: {
      start: Date,
      end: Date
    },
    successRate: { type: Number },
    averageConfidence: { type: Number },
    averageExecutionTime: { type: Number },
    userSatisfaction: { type: Number },
    taskCount: { type: Number },
    strategiesUsed: [String],
    topErrors: { type: mongoose.Schema.Types.Mixed },
    recommendations: [String],
    health: {
      status: String,
      issues: [String]
    },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { collection: 'performance_metrics' }
);

// ==========================================
// User Consent Schema
// ==========================================
const userConsentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    dataCollection: { type: Boolean, default: false },
    personalization: { type: Boolean, default: false },
    feedbackLearning: { type: Boolean, default: false },
    consentedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String
  },
  { collection: 'user_consent' }
);

// ==========================================
// Audit Log Schema
// ==========================================
const auditLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true },
    userId: String,
    action: { type: String, required: true, index: true },
    actionType: {
      type: String,
      enum: [
        'CONSENT_UPDATED',
        'TASK_PROCESSED',
        'FEEDBACK_SUBMITTED',
        'DATA_ACCESSED',
        'DATA_DELETED',
        'SECURITY_CHECK',
        'ERROR_OCCURRED'
      ],
      index: true
    },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: String,
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
    createdAt: { type: Date, default: Date.now, index: true, expire: 7776000 } // 90 days TTL
  },
  { collection: 'audit_logs' }
);

// ==========================================
// Learning History Schema
// ==========================================
const learningHistorySchema = new mongoose.Schema(
  {
    learningId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    fromFeedback: { type: Number }, // Number of feedback entries processed
    updates: [
      {
        type: String,
        field: String,
        previousValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        reason: String
      }
    ],
    improvementMetrics: {
      successRateChange: Number,
      confidenceChange: Number,
      executionTimeChange: Number,
      satisfactionChange: Number
    },
    strategiesImproved: [String],
    learningRate: Number,
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { collection: 'learning_history' }
);

// ==========================================
// Create Models
// ==========================================
const TaskExecution = mongoose.model('TaskExecution', taskExecutionSchema);
const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);
const PerformanceMetrics = mongoose.model('PerformanceMetrics', performanceMetricsSchema);
const UserConsent = mongoose.model('UserConsent', userConsentSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
const LearningHistory = mongoose.model('LearningHistory', learningHistorySchema);

// ==========================================
// Export Models
// ==========================================
module.exports = {
  TaskExecution,
  UserFeedback,
  PerformanceMetrics,
  UserConsent,
  AuditLog,
  LearningHistory
};
