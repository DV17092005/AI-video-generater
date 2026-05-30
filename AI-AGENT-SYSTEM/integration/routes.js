/**
 * Backend Integration Routes
 * Exposes AI Agent functionality via REST API
 */

const express = require('express');
const { createAgent } = require('../index');
const agentConfig = require('./config');

const router = express.Router();
let agent = null;

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_KEY_MISSING_ERROR = {
  success: false,
  error: 'OPENAI_API_KEY is not configured. Set OPENAI_API_KEY in your environment or .env file to use AI agent routes.'
};

router.use((req, res, next) => {
  if (!OPENAI_KEY) {
    return res.status(503).json(OPENAI_KEY_MISSING_ERROR);
  }
  next();
});

// Middleware to initialize agent
router.use(async (req, res, next) => {
  if (!agent) {
    try {
      agent = await createAgent(agentConfig);
    } catch (error) {
      console.error('Agent initialization failed:', error.message);
      return res.status(500).json({ error: 'Agent not available' });
    }
  }
  next();
});

/**
 * POST /api/agent/init
 * Initialize the AI Agent
 */
router.post('/init', async (req, res) => {
  try {
    agent = await createAgent(agentConfig);
    const status = await agent.getStatus();
    res.json({
      success: true,
      agent: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/process
 * Process a task request
 */
router.post('/process', async (req, res) => {
  try {
    const { userId, taskType, input, taskDescription, feedback } = req.body;

    const request = {
      userId,
      taskType,
      input,
      taskDescription: taskDescription || JSON.stringify(input)
    };

    const result = await agent.process(request);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/feedback
 * Submit feedback for a task
 */
router.post('/feedback', async (req, res) => {
  try {
    const { taskId, userId, rating, comment, corrections, tags } = req.body;

    const result = await agent.submitFeedback(taskId, {
      userId,
      rating,
      comment,
      corrections,
      tags,
      wasHelpful: rating >= 4
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/status
 * Get agent status and metrics
 */
router.get('/status', async (req, res) => {
  try {
    const { userId } = req.query;
    const status = await agent.getStatus(userId);
    res.json(status);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/metrics
 * Get detailed performance metrics
 */
router.get('/metrics', (req, res) => {
  try {
    const metrics = agent.evaluator.getPerformanceMetrics();
    const recommendations = agent.evaluator.getImprovementRecommendations();

    res.json({
      metrics,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/consent
 * Set user consent preferences
 */
router.post('/consent', (req, res) => {
  try {
    const { userId, dataCollection, personalization, feedbackLearning } = req.body;

    const result = agent.setUserConsent(userId, {
      dataCollection,
      personalization,
      feedbackLearning
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/consent/:userId
 * Get user consent status
 */
router.get('/consent/:userId', (req, res) => {
  try {
    const consent = agent.getUserConsent(req.params.userId);
    res.json(consent);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/data/export/:userId
 * Export user data (GDPR)
 */
router.post('/data/export/:userId', async (req, res) => {
  try {
    const data = await agent.exportUserData(req.params.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/agent/data/:userId
 * Delete user data (GDPR right to be forgotten)
 */
router.delete('/data/:userId', async (req, res) => {
  try {
    const result = await agent.deleteUserData(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/audit
 * Get audit log
 */
router.get('/audit', (req, res) => {
  try {
    const { userId, limit } = req.query;
    const audit = agent.privacy.getAuditLog(userId, limit);
    res.json(audit);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/compliance
 * Get compliance report
 */
router.get('/compliance', (req, res) => {
  try {
    const report = agent.privacy.getComplianceReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
