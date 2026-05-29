/**
 * Example Usage - AI Agent System
 * Demonstrates all key features and capabilities
 */

const { createAgent } = require('./index');

async function exampleUsage() {
  try {
    console.log('🚀 Initializing AI Agent System...\n');
    
    // Initialize the agent
    const agent = await createAgent({
      enableLearning: true,
      enablePersonalization: true
    });

    const userId = 'user@example.com';

    // ==========================================
    // 1. SET USER CONSENT
    // ==========================================
    console.log('1️⃣  Setting user consent preferences...\n');
    
    const consentResult = agent.setUserConsent(userId, {
      dataCollection: true,
      personalization: true,
      feedbackLearning: true
    });
    console.log('✓ Consent set:', consentResult.consent);
    console.log('');

    // ==========================================
    // 2. PROCESS MULTIPLE TASKS
    // ==========================================
    console.log('2️⃣  Processing multiple tasks...\n');
    
    const tasks = [
      {
        userId,
        taskType: 'generate_script',
        input: {
          topic: 'Artificial Intelligence',
          duration: 60,
          style: 'educational'
        },
        taskDescription: 'Generate a video script about AI'
      },
      {
        userId,
        taskType: 'generate_images',
        input: {
          topic: 'AI and Machine Learning',
          count: 5,
          style: 'modern'
        },
        taskDescription: 'Generate images for AI video'
      },
      {
        userId,
        taskType: 'generate_voiceover',
        input: {
          script: 'AI is transforming the world...',
          voice: 'professional_male',
          language: 'en'
        },
        taskDescription: 'Generate voiceover for the video'
      },
      {
        userId,
        taskType: 'voice_assistant_conversation',
        input: {
          userMessage: 'Hey, help me summarize this article about AI ethics',
          context: 'We are building a video generation assistant'
        },
        taskDescription: 'Respond as a real-time voice assistant',
        voiceMode: true
      }
    ];

    const results = [];
    for (const task of tasks) {
      console.log(`📝 Processing: ${task.taskType}`);
      const result = await agent.process(task);
      results.push(result);
      console.log(`✓ Success: ${result.success}, Confidence: ${result.confidence}`);
      console.log(`  Execution time: ${result.executionTime}ms`);
      console.log('');
    }

    // ==========================================
    // 3. SUBMIT FEEDBACK
    // ==========================================
    console.log('3️⃣  Submitting feedback for tasks...\n');
    
    for (let i = 0; i < results.length; i++) {
      if (results[i].success) {
        const feedback = await agent.submitFeedback(results[i].taskId, {
          userId,
          rating: 5,
          comment: `Task ${i + 1} completed successfully with excellent quality`,
          corrections: {},
          tags: ['excellent', 'on-brand'],
          wasHelpful: true
        });
        console.log(`✓ Feedback submitted for task ${i + 1}`);
      }
    }
    console.log('');

    // ==========================================
    // 4. GET AGENT STATUS
    // ==========================================
    console.log('4️⃣  Checking agent status...\n');
    
    const status = await agent.getStatus(userId);
    console.log('Agent Status:');
    console.log('  ID:', status.agentId);
    console.log('  Version:', status.version);
    console.log('  Performance:');
    console.log('    - Success Rate:', status.performance.metrics.successRate + '%');
    console.log('    - Avg Confidence:', status.performance.metrics.avgConfidence);
    console.log('    - Avg Execution Time:', status.performance.metrics.avgExecutionTime + 'ms');
    console.log('    - Health:', status.performance.health.status);
    console.log('');

    // ==========================================
    // 5. VIEW PERFORMANCE METRICS
    // ==========================================
    console.log('5️⃣  Detailed performance metrics...\n');
    
    const metrics = agent.evaluator.getPerformanceMetrics();
    console.log('Overall Metrics:');
    console.log('  Total Tasks:', metrics.summary.totalTasks);
    console.log('  Successful:', metrics.summary.successfulTasks);
    console.log('  Success Rate:', metrics.summary.successRate + '%');
    console.log('  Avg Confidence:', metrics.summary.avgConfidence);
    console.log('');

    // ==========================================
    // 6. GET IMPROVEMENT RECOMMENDATIONS
    // ==========================================
    console.log('6️⃣  AI recommendations for improvement...\n');
    
    const recommendations = agent.evaluator.getImprovementRecommendations();
    if (recommendations.length > 0) {
      recommendations.slice(0, 3).forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec.area} (Priority: ${rec.priority})`);
        console.log(`   Current: ${rec.current}`);
        console.log(`   Action: ${rec.action}`);
        console.log('');
      });
    }

    // ==========================================
    // 7. FEEDBACK ANALYSIS
    // ==========================================
    console.log('7️⃣  Feedback analysis and learning insights...\n');
    
    const feedbackStats = agent.feedback.getFeedbackStats();
    console.log('Feedback Statistics:');
    console.log('  Total Feedback:', feedbackStats.totalFeedback);
    console.log('  Avg Rating:', feedbackStats.stats.averageRating + '/5');
    console.log('  Helpful Rate:', feedbackStats.stats.helpfulRate);
    console.log('  Sentiment:');
    console.log('    - Positive:', feedbackStats.stats.sentiment.positive);
    console.log('    - Neutral:', feedbackStats.stats.sentiment.neutral);
    console.log('    - Negative:', feedbackStats.stats.sentiment.negative);
    console.log('');

    // ==========================================
    // 8. PRIVACY AND COMPLIANCE
    // ==========================================
    console.log('8️⃣  Privacy and compliance information...\n');
    
    const compliance = agent.privacy.getComplianceReport();
    console.log('Compliance Report:');
    console.log('  Users with Consent:', compliance.users.consentRate + '%');
    console.log('  Content Filter:', compliance.safetyEnabledFeatures.contentFilter);
    console.log('  Sensitive Data Blocking:', compliance.safetyEnabledFeatures.sensitiveDataBlocking);
    console.log('  Rate Limiting:', compliance.safetyEnabledFeatures.rateLimit);
    console.log('  GDPR Compliant:', compliance.gdprCompliant);
    console.log('');

    // ==========================================
    // 9. AUDIT LOG
    // ==========================================
    console.log('9️⃣  Recent audit log entries...\n');
    
    const auditLog = agent.privacy.getAuditLog(userId, 5);
    console.log(`Audit Log (Last ${auditLog.entries.length} entries):`);
    auditLog.entries.forEach(entry => {
      console.log(`  [${entry.timestamp}] ${entry.action}`);
    });
    console.log('');

    // ==========================================
    // 10. DATA EXPORT (GDPR)
    // ==========================================
    console.log('🔟 Exporting user data (GDPR compliance)...\n');
    
    const exportedData = await agent.exportUserData(userId);
    console.log('✓ Data export prepared');
    console.log(`  Total memories: ${exportedData.exports.memory.totalMemories}`);
    console.log(`  Feedback records: ${exportedData.exports.feedback.feedbackCount}`);
    console.log('  GDPR Compliant:', exportedData.gdprCompliant);
    console.log('');

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`
✓ ${results.length} tasks processed successfully
✓ Performance metrics: ${metrics.summary.successRate.toFixed(1)}% success rate
✓ User feedback analyzed: ${feedbackStats.totalFeedback} entries
✓ Memory system: Active and learning
✓ Privacy protection: GDPR compliant
✓ System health: ${status.performance.health.status}
    `);

    console.log('🎉 Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run example
if (require.main === module) {
  exampleUsage();
}

module.exports = { exampleUsage };
