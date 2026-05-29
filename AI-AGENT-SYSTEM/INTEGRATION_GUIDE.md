/**
 * Integration Guide for Backend
 * How to integrate AI Agent System with Express backend
 */

/*
  STEP 1: Install dependencies
  =============================
  npm install axios uuid mongoose redis bcryptjs jsonwebtoken pinecone-client
  
  
  STEP 2: Update your Express app.js
  ===================================
  
  const express = require('express');
  const cors = require('cors');
  const agentRoutes = require('./AI-AGENT-SYSTEM/integration/routes');
  
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Mount agent routes
  app.use('/api/agent', agentRoutes);
  
  // Your other routes...
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/videos', require('./routes/videoRoutes'));
  
  module.exports = app;


  STEP 3: Environment Variables (.env)
  ====================================
  
  # Vector Database (Pinecone)
  VECTOR_DB_API_KEY=<your-pinecone-api-key>
  VECTOR_ENV=production
  
  # OpenAI API
  OPENAI_API_KEY=<your-openai-api-key>
  
  # Encryption
  ENCRYPTION_KEY=<32-character-hex-string>
  
  # Database
  MONGODB_URI=<your-mongodb-uri>
  REDIS_URL=<your-redis-url>


  STEP 4: Use in your controllers
  ==============================
  
  // In videoController.js
  const { createAgent } = require('../AI-AGENT-SYSTEM');
  
  exports.generateVideoScript = async (req, res) => {
    try {
      const agent = await createAgent(agentConfig);
      
      const result = await agent.process({
        userId: req.user.id,
        taskType: 'generate_script',
        input: req.body.script_params,
        taskDescription: 'Generate video script based on user input'
      });
      
      if (result.success) {
        // Store result in database
        const video = await Video.create({
          userId: req.user.id,
          script: result.result,
          confidence: result.confidence,
          taskId: result.taskId
        });
        
        res.json({ success: true, video });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  STEP 5: Monitor Performance
  ==========================
  
  // Periodically check agent status
  setInterval(async () => {
    const agent = await createAgent(agentConfig);
    const status = await agent.getStatus();
    
    if (status.performance.health.status === 'CRITICAL') {
      console.error('ALERT: Agent health critical');
      // Send notification, trigger maintenance, etc.
    }
  }, 60 * 60 * 1000); // Every hour


  STEP 6: Handle User Consent
  ===========================
  
  // In user settings endpoint
  app.post('/api/users/:userId/preferences', async (req, res) => {
    const agent = await createAgent(agentConfig);
    
    const result = agent.setUserConsent(req.params.userId, {
      dataCollection: req.body.allowTracking || false,
      personalization: req.body.allowPersonalization || false,
      feedbackLearning: req.body.allowLearning || false
    });
    
    res.json(result);
  });


  API ENDPOINTS AVAILABLE
  =======================
  
  POST /api/agent/process
    - Process a task with full learning pipeline
    
  POST /api/agent/feedback
    - Submit feedback for a completed task
    
  GET /api/agent/status
    - Get agent status and performance metrics
    
  GET /api/agent/metrics
    - Get detailed performance metrics and recommendations
    
  POST /api/agent/consent
    - Set user consent preferences
    
  GET /api/agent/consent/:userId
    - Get user consent status
    
  POST /api/agent/data/export/:userId
    - Export user data (GDPR)
    
  DELETE /api/agent/data/:userId
    - Delete all user data (GDPR)
    
  GET /api/agent/audit
    - Get audit log
    
  GET /api/agent/compliance
    - Get compliance report


  EXAMPLE USAGE
  =============
  
  // 1. Create request
  const taskRequest = {
    userId: 'user@example.com',
    taskType: 'generate_script',
    input: {
      topic: 'AI and Machine Learning',
      duration: 60,
      style: 'educational'
    },
    taskDescription: 'Generate a video script about AI'
  };
  
  // 2. Process request
  const result = await agent.process(taskRequest);
  
  // 3. Submit feedback
  await agent.submitFeedback(result.taskId, {
    userId: taskRequest.userId,
    rating: 5,
    comment: 'Great script, very informative',
    wasHelpful: true,
    tags: ['excellent', 'well-structured']
  });
  
  // 4. Check status
  const status = await agent.getStatus(taskRequest.userId);


  TESTING
  =======
  
  // Test the integration
  curl -X POST http://localhost:3000/api/agent/process \\
    -H "Content-Type: application/json" \\
    -d '{
      "userId": "test@example.com",
      "taskType": "test_task",
      "input": {"message": "Hello agent"},
      "taskDescription": "Test task"
    }'


  MONITORING
  ==========
  
  Key metrics to monitor:
  - Task success rate (target: >80%)
  - Average confidence score (target: >0.75)
  - User satisfaction (target: >=4.0/5)
  - Average execution time (target: <5000ms)
  - Error patterns and frequencies
  
  Set up alerts for:
  - Success rate below 70%
  - Health status = CRITICAL
  - User satisfaction below 3.0
  - Execution time > 10 seconds


  TROUBLESHOOTING
  ===============
  
  1. "Agent not available" error
     - Check if Pinecone/OpenAI keys are set
     - Verify API connectivity
     - Check network access
  
  2. Memory/vector DB initialization failed
     - Agent will degrade gracefully
     - Continue without personalization
     - Check API credentials
  
  3. High execution times
     - Review task complexity
     - Check API response times
     - Monitor system resources
  
  4. Low success rates
     - Check error patterns via /api/agent/metrics
     - Review failed task inputs
     - Update strategies based on recommendations
*/

module.exports = {
  integrationGuide: true
};
