/**
 * Feedback Manager
 * Processes user feedback and learns from outcomes
 */

class FeedbackManager {
  constructor(config = {}) {
    this.feedbackHistory = [];
    this.learningRate = config.learningRate || 0.1;
    this.minFeedbackCount = config.minFeedbackCount || 10;
    this.feedbackWeights = {
      rating: config.ratingWeight || 0.5,
      correction: config.correctionWeight || 0.3,
      helpful: config.helpfulWeight || 0.2
    };
  }

  /**
   * Submit task feedback
   */
  submitFeedback(feedbackData) {
    const {
      taskId,
      rating = 5,
      comment = '',
      corrections = {},
      wasHelpful = true,
      tags = [],
      userId
    } = feedbackData;

    const feedback = {
      taskId,
      userId,
      timestamp: new Date().toISOString(),
      rating: Math.min(5, Math.max(1, rating)), // Clamp to 1-5
      comment,
      corrections,
      wasHelpful,
      tags,
      processed: false
    };

    this.feedbackHistory.push(feedback);

    return {
      success: true,
      taskId,
      feedbackCount: this.feedbackHistory.length,
      message: 'Feedback submitted successfully'
    };
  }

  /**
   * Analyze feedback for learning patterns
   */
  analyzeFeedback() {
    if (this.feedbackHistory.length === 0) {
      return {
        totalFeedback: 0,
        analysis: null,
        message: 'Insufficient feedback for analysis'
      };
    }

    const analysis = {
      totalFeedback: this.feedbackHistory.length,
      averageRating: 0,
      helpfulRate: 0,
      commonIssues: {},
      sentimentAnalysis: this.analyzeSentiment(),
      learningInsights: []
    };

    // Calculate average rating
    const totalRating = this.feedbackHistory.reduce((sum, f) => sum + f.rating, 0);
    analysis.averageRating = (totalRating / this.feedbackHistory.length).toFixed(2);

    // Calculate helpful rate
    const helpfulCount = this.feedbackHistory.filter(f => f.wasHelpful).length;
    analysis.helpfulRate = ((helpfulCount / this.feedbackHistory.length) * 100).toFixed(1);

    // Analyze corrections
    for (const feedback of this.feedbackHistory) {
      if (Object.keys(feedback.corrections).length > 0) {
        for (const [field, correction] of Object.entries(feedback.corrections)) {
          if (!analysis.commonIssues[field]) {
            analysis.commonIssues[field] = 0;
          }
          analysis.commonIssues[field] += 1;
        }
      }
    }

    // Generate learning insights
    analysis.learningInsights = this.generateInsights(analysis);

    return analysis;
  }

  /**
   * Analyze sentiment in feedback comments
   */
  analyzeSentiment() {
    const sentimentScores = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    const positiveWords = ['good', 'great', 'excellent', 'perfect', 'amazing', 'helpful', 'useful'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'wrong', 'broken', 'useless'];

    for (const feedback of this.feedbackHistory) {
      const comment = feedback.comment.toLowerCase();
      let sentiment = 'neutral';

      for (const word of positiveWords) {
        if (comment.includes(word)) {
          sentiment = 'positive';
          break;
        }
      }

      if (sentiment === 'neutral') {
        for (const word of negativeWords) {
          if (comment.includes(word)) {
            sentiment = 'negative';
            break;
          }
        }
      }

      sentimentScores[sentiment] += 1;
    }

    return sentimentScores;
  }

  /**
   * Generate learning insights from feedback
   */
  generateInsights(analysis) {
    const insights = [];

    // Rating-based insights
    if (analysis.averageRating >= 4.5) {
      insights.push({
        type: 'POSITIVE',
        message: 'User satisfaction is excellent. Continue current strategies.',
        action: 'Maintain and scale successful patterns'
      });
    } else if (analysis.averageRating >= 3.5) {
      insights.push({
        type: 'NEUTRAL',
        message: 'User satisfaction is moderate. Some improvements needed.',
        action: 'Review lower-rated tasks and identify common patterns'
      });
    } else {
      insights.push({
        type: 'NEGATIVE',
        message: 'User satisfaction is low. Major improvements required.',
        action: 'Priority: Address common issues and user complaints'
      });
    }

    // Helpful rate insights
    if (analysis.helpfulRate >= 80) {
      insights.push({
        type: 'POSITIVE',
        message: 'Most outputs are considered helpful by users.',
        action: 'Analyze and replicate successful output patterns'
      });
    } else if (analysis.helpfulRate < 50) {
      insights.push({
        type: 'NEGATIVE',
        message: 'Less than half of outputs are helpful.',
        action: 'Significantly improve output quality and relevance'
      });
    }

    // Issue-based insights
    const topIssues = Object.entries(analysis.commonIssues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topIssues.length > 0) {
      insights.push({
        type: 'ACTION_ITEM',
        message: 'Common issues identified',
        issues: topIssues.map(([field, count]) => `${field}: ${count} mentions`),
        action: 'Priority fix these fields to improve output quality'
      });
    }

    // Sentiment insights
    const sentiment = analysis.sentimentAnalysis;
    const total = sentiment.positive + sentiment.neutral + sentiment.negative;
    
    if (sentiment.negative > total * 0.3) {
      insights.push({
        type: 'ALERT',
        message: 'Negative sentiment detected in comments',
        action: 'Review negative feedback and implement corrective measures'
      });
    }

    return insights;
  }

  /**
   * Learn and update strategy from feedback
   */
  learnFromFeedback() {
    if (this.feedbackHistory.length < this.minFeedbackCount) {
      return {
        success: false,
        message: `Insufficient feedback. Need ${this.minFeedbackCount}, have ${this.feedbackHistory.length}`
      };
    }

    const analysis = this.analyzeFeedback();
    const learning = {
      timestamp: new Date().toISOString(),
      feedbackProcessed: this.feedbackHistory.length,
      updates: [],
      strategiesImproved: []
    };

    // Learn from ratings
    const avgRating = parseFloat(analysis.averageRating);
    if (avgRating < 3.5) {
      learning.updates.push({
        type: 'STRATEGY_ADJUSTMENT',
        factor: 'rating_improvement_needed',
        learningRate: this.learningRate * 1.5,
        action: 'Increase adjustment rate for faster improvement'
      });
    }

    // Learn from common issues
    for (const [field, count] of Object.entries(analysis.commonIssues)) {
      if (count >= this.minFeedbackCount * 0.2) { // If 20%+ of feedback mentions it
        learning.updates.push({
          type: 'FIELD_IMPROVEMENT',
          field,
          mentions: count,
          action: `Focus improvement efforts on ${field}`
        });
        learning.strategiesImproved.push(field);
      }
    }

    // Learn from helpful rate
    const helpfulRate = parseFloat(analysis.helpfulRate);
    learning.updates.push({
      type: 'QUALITY_METRIC',
      helpfulness: `${helpfulRate}%`,
      target: '90%',
      improvementNeeded: helpfulRate < 80
    });

    // Mark feedback as processed
    for (const feedback of this.feedbackHistory) {
      feedback.processed = true;
    }

    return {
      success: true,
      ...learning,
      nextLearningCycle: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next day
    };
  }

  /**
   * Get feedback statistics
   */
  getFeedbackStats() {
    if (this.feedbackHistory.length === 0) {
      return {
        totalFeedback: 0,
        stats: null
      };
    }

    const analysis = this.analyzeFeedback();

    return {
      totalFeedback: this.feedbackHistory.length,
      stats: {
        averageRating: analysis.averageRating,
        helpfulRate: `${analysis.helpfulRate}%`,
        sentiment: analysis.sentimentAnalysis,
        commonIssues: analysis.commonIssues,
        learningInsights: analysis.learningInsights
      },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get feedback for specific task
   */
  getTaskFeedback(taskId) {
    const taskFeedback = this.feedbackHistory.filter(f => f.taskId === taskId);

    return {
      taskId,
      feedbackCount: taskFeedback.length,
      feedback: taskFeedback,
      averageRating: taskFeedback.length > 0
        ? (taskFeedback.reduce((sum, f) => sum + f.rating, 0) / taskFeedback.length).toFixed(2)
        : 'N/A'
    };
  }

  /**
   * Clear feedback history (for data privacy)
   */
  clearFeedbackHistory(userId = null) {
    let removed = 0;

    if (userId) {
      removed = this.feedbackHistory.filter(f => f.userId === userId).length;
      this.feedbackHistory = this.feedbackHistory.filter(f => f.userId !== userId);
    } else {
      removed = this.feedbackHistory.length;
      this.feedbackHistory = [];
    }

    return {
      success: true,
      feedbackRemoved: removed,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = FeedbackManager;
